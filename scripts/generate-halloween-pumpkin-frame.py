"""Build the Halloween profile frame APNGs from their transparent source artwork.

Requires Pillow. The first frame is a complete image so the decoration remains
visible in viewers that show only the PNG fallback frame.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


ASSETS = Path(__file__).resolve().parents[1] / "src/shared/ui/ProfileAvatar/assets"
SOURCE = ASSETS / "halloween-pumpkin-source.png"
FRAME_COUNT = 16
FRAME_DURATION_MS = 150

# Coordinates are in the 512px artwork canvas.
STARS = (
    (256, 52, 0.0, 1.0),
)


def make_animation_layer(size: int, progress: float) -> Image.Image:
    scale = size / 512
    soft = Image.new("RGBA", (size, size))
    soft_draw = ImageDraw.Draw(soft)
    sharp = Image.new("RGBA", (size, size))
    sharp_draw = ImageDraw.Draw(sharp)

    # A broad amber streak circles the frame. It remains visible when the
    # decoration is reduced to a 50px avatar.
    radius = round(222 * scale)
    center = size // 2
    ring_box = (
        center - radius,
        center - radius,
        center + radius,
        center + radius,
    )
    sweep_end = progress * 360 - 90
    for segment in range(12):
        segment_start = sweep_end - (12 - segment) * 8
        segment_end = segment_start + 8
        intensity = ((segment + 1) / 12) ** 1.5
        soft_draw.arc(
            ring_box,
            segment_start,
            segment_end,
            fill=(255, 105, 12, round(220 * intensity)),
            width=max(3, round(29 * scale)),
        )
        sharp_draw.arc(
            ring_box,
            segment_start,
            segment_end,
            fill=(255, 231, 113, round(225 * intensity)),
            width=max(1, round(6 * scale)),
        )

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


def make_flashing_frame(base: Image.Image, size: int, progress: float) -> Image.Image:
    # A sustained glow makes the whole frame change at small sizes, where the
    # moving glint alone is difficult to see.
    flash = max(0, math.sin(2 * math.pi * progress)) ** 0.8
    lit = ImageEnhance.Brightness(base).enhance(2.0)
    brightened = Image.blend(base, lit, flash * 0.9)

    halo = Image.new("RGBA", (size, size))
    halo_draw = ImageDraw.Draw(halo)
    radius = round(238 * size / 512)
    center = size // 2
    halo_draw.ellipse(
        (
            center - radius,
            center - radius,
            center + radius,
            center + radius,
        ),
        outline=(255, 116, 16, round(220 * flash)),
        width=max(3, round(20 * size / 512)),
    )
    halo = halo.filter(ImageFilter.GaussianBlur(max(2, round(13 * size / 512))))
    return Image.alpha_composite(halo, brightened)


def make_breathing_frame(frame: Image.Image, size: int, progress: float) -> Image.Image:
    # The whole decoration contracts by up to 10%, then returns to its normal
    # size. The photo stays fixed beneath it, making the movement unmistakable.
    scale = 1 - 0.1 * math.sin(2 * math.pi * progress) ** 2
    frame_size = round(size * scale)
    resized = frame.resize((frame_size, frame_size), Image.Resampling.LANCZOS)
    result = Image.new("RGBA", (size, size))
    result.alpha_composite(resized, ((size - frame_size) // 2, (size - frame_size) // 2))
    return result


def export(size: int, filename: str, artwork: Image.Image) -> list[Image.Image]:
    base = artwork.resize((size, size), Image.Resampling.LANCZOS)
    frames = []
    for frame_index in range(FRAME_COUNT):
        progress = frame_index / FRAME_COUNT
        flashing_frame = make_flashing_frame(base, size, progress)
        animated_frame = Image.alpha_composite(
            flashing_frame, make_animation_layer(size, progress)
        )
        frames.append(make_breathing_frame(animated_frame, size, progress))

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
    return frames


def export_preview(frames: list[Image.Image]) -> None:
    """Provide a browser-friendly motion preview; APNGs remain the real assets."""
    preview_frames = []
    for frame in frames:
        background = Image.new("RGBA", frame.size, "#f2f0f6")
        photo = Image.new("RGBA", frame.size)
        draw = ImageDraw.Draw(photo)
        inset = round(frame.width * (1 - 400 / 512) / 2)
        draw.ellipse(
            (inset, inset, frame.width - inset, frame.height - inset),
            fill="#625572",
        )
        preview_frames.append(
            Image.alpha_composite(Image.alpha_composite(background, photo), frame)
            .convert("RGB")
            .quantize(colors=128)
        )

    preview_frames[0].save(
        ASSETS / "halloween-pumpkin-preview.gif",
        save_all=True,
        append_images=preview_frames[1:],
        duration=FRAME_DURATION_MS,
        loop=0,
        optimize=True,
        disposal=2,
    )


def main() -> None:
    artwork = Image.open(SOURCE).convert("RGBA")
    export(512, "halloween-pumpkin-frame.png", artwork)
    small_frames = export(256, "halloween-pumpkin-frame-small.png", artwork)
    export_preview(small_frames)
    artwork.resize((256, 256), Image.Resampling.LANCZOS).save(
        ASSETS / "halloween-pumpkin-thumbnail.webp", format="WEBP", quality=85
    )


if __name__ == "__main__":
    main()
