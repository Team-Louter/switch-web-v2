"""Build the Halloween profile frame APNGs from their transparent source artwork.

Requires Pillow. The first frame is a complete image so the decoration remains
visible in viewers that show only the PNG fallback frame.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ASSETS = Path(__file__).resolve().parents[1] / "src/shared/ui/ProfileAvatar/assets"
SOURCE = ASSETS / "halloween-pumpkin-source.png"
FRAME_COUNT = 24
FRAME_DURATION_MS = 100

# The glint and pumpkin share a narrow column, keeping APNG delta frames small.
# Coordinates are in the 512px artwork canvas.
STARS = (
    (256, 52, 0.0, 1.0),
)


def make_glint_layer(size: int, progress: float) -> Image.Image:
    scale = size / 512
    soft = Image.new("RGBA", (size, size))
    soft_draw = ImageDraw.Draw(soft)
    sharp = Image.new("RGBA", (size, size))
    sharp_draw = ImageDraw.Draw(sharp)

    for x, y, phase, strength in STARS:
        pulse = (1 + math.cos(2 * math.pi * (progress - phase))) / 2
        if pulse < 0.18:
            continue

        x, y = round(x * scale), round(y * scale)
        glow_radius = max(4, round((9 + 5 * pulse) * scale))
        soft_draw.ellipse(
            (x - glow_radius, y - glow_radius, x + glow_radius, y + glow_radius),
            fill=(255, 141, 28, round(95 * pulse * strength)),
        )

        ray = max(2, round((4 + 4 * pulse) * scale))
        core = max(1, round((1 + pulse) * scale))
        alpha = round(185 * pulse * strength)
        sharp_draw.line((x - ray, y, x + ray, y), fill=(255, 225, 121, alpha), width=core)
        sharp_draw.line((x, y - ray, x, y + ray), fill=(255, 225, 121, alpha), width=core)
        sharp_draw.ellipse((x - core, y - core, x + core, y + core), fill=(255, 249, 206, alpha))

    # Keep the jack-o'-lantern readable at avatar sizes with a slow, warm pulse.
    pumpkin_pulse = (1 + math.cos(2 * math.pi * progress)) / 2
    pumpkin_x, pumpkin_y = round(256 * scale), round(452 * scale)
    pumpkin_radius = round(19 * scale)
    soft_draw.ellipse(
        (
            pumpkin_x - pumpkin_radius,
            pumpkin_y - pumpkin_radius,
            pumpkin_x + pumpkin_radius,
            pumpkin_y + pumpkin_radius,
        ),
        fill=(255, 100, 5, round(45 + 35 * pumpkin_pulse)),
    )

    return Image.alpha_composite(
        soft.filter(ImageFilter.GaussianBlur(max(1, round(7 * scale)))),
        sharp,
    )


def export(size: int, filename: str, artwork: Image.Image) -> None:
    base = artwork.resize((size, size), Image.Resampling.LANCZOS)
    frames = []
    for frame_index in range(FRAME_COUNT):
        progress = frame_index / FRAME_COUNT
        frames.append(Image.alpha_composite(base, make_glint_layer(size, progress)))

    frames[0].save(
        ASSETS / filename,
        format="PNG",
        save_all=True,
        append_images=frames[1:],
        duration=FRAME_DURATION_MS,
        loop=0,
        disposal=0,
        blend=0,
        compress_level=9,
    )


def main() -> None:
    artwork = Image.open(SOURCE).convert("RGBA")
    export(512, "halloween-pumpkin-frame.png", artwork)
    export(256, "halloween-pumpkin-frame-small.png", artwork)
    artwork.resize((256, 256), Image.Resampling.LANCZOS).save(
        ASSETS / "halloween-pumpkin-thumbnail.webp", format="WEBP", quality=85
    )


if __name__ == "__main__":
    main()
