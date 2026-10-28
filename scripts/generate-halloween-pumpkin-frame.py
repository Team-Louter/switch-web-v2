"""Render a single pumpkin accessory with smoothly perking ears.

Requires Pillow. The accessory uses the ProfileAvatar 512px canvas with a
400px photo circle centered at (256, 256); the rest remains transparent.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw


ASSETS = Path(__file__).resolve().parents[1] / "src/shared/ui/ProfileAvatar/assets"
FRAME_COUNT = 48
FRAME_DURATION_MS = 50
CANVAS_SIZE = 512
DRAW_SCALE = 2


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3 - 2 * value)


def ear_perk(progress: float, delay: float) -> float:
    """Rise, overshoot, settle, hold, then relax without a loop seam."""
    time = progress - delay
    if time < 0.10:
        return 0.0
    if time < 0.32:
        return 1.10 * smoothstep((time - 0.10) / 0.22)
    if time < 0.43:
        return 1.10 - 0.10 * smoothstep((time - 0.32) / 0.11)
    if time < 0.68:
        return 1.0
    if time < 0.94:
        return 1 - smoothstep((time - 0.68) / 0.26)
    return 0.0


def scaled_points(points: list[tuple[float, float]]) -> list[tuple[int, int]]:
    return [(round(x * DRAW_SCALE), round(y * DRAW_SCALE)) for x, y in points]


def draw_ear(
    draw: ImageDraw.ImageDraw,
    base_x: float,
    base_y: float,
    angle_degrees: float,
) -> None:
    angle = math.radians(angle_degrees)
    axis_x, axis_y = math.sin(angle), -math.cos(angle)
    side_x, side_y = math.cos(angle), math.sin(angle)

    def contour(width_offset: float, start: float, end: float) -> list[tuple[int, int]]:
        left = []
        right = []
        for index in range(25):
            t = start + (end - start) * index / 24
            width = max(0.0, 9 * (1 - t) + 11 * math.sin(math.pi * t) - width_offset)
            center_x = base_x + 88 * t * axis_x
            center_y = base_y + 88 * t * axis_y
            left.append((center_x - width * side_x, center_y - width * side_y))
            right.append((center_x + width * side_x, center_y + width * side_y))
        return scaled_points(left + list(reversed(right)))

    draw.polygon(contour(0, 0, 1), fill="#35182F")
    draw.polygon(contour(3.2, 0.04, 0.94), fill="#F36B18")
    draw.polygon(contour(9, 0.18, 0.83), fill="#FFBF62")


def draw_pumpkin(draw: ImageDraw.ImageDraw, lift: float) -> None:
    def box(left: float, top: float, right: float, bottom: float) -> tuple[int, ...]:
        return tuple(round(value * DRAW_SCALE) for value in (left, top + lift, right, bottom + lift))

    def polygon(points: list[tuple[float, float]]) -> list[tuple[int, int]]:
        return scaled_points([(x, y + lift) for x, y in points])

    # Stem and lobes form one pumpkin; the ear bases disappear behind its top.
    draw.rounded_rectangle(box(248, 64, 266, 91), radius=7 * DRAW_SCALE, fill="#35182F")
    draw.rounded_rectangle(box(251, 67, 263, 88), radius=5 * DRAW_SCALE, fill="#4D8A34")
    draw.ellipse(box(184, 76, 328, 160), fill="#35182F")
    draw.ellipse(box(189, 81, 239, 155), fill="#D75112")
    draw.ellipse(box(273, 81, 323, 155), fill="#D75112")
    draw.ellipse(box(206, 78, 275, 157), fill="#F87817")
    draw.ellipse(box(237, 78, 306, 157), fill="#F87817")
    draw.ellipse(box(221, 77, 291, 158), fill="#FF9827")
    draw.arc(box(199, 82, 260, 153), 75, 275, fill="#D65D14", width=3 * DRAW_SCALE)
    draw.arc(box(252, 82, 313, 153), -95, 105, fill="#D65D14", width=3 * DRAW_SCALE)
    draw.arc(box(220, 81, 286, 154), 185, 345, fill="#FFC064", width=3 * DRAW_SCALE)

    # The jack-o'-lantern expression stays crisp at 50px avatar size.
    draw.polygon(polygon([(218, 113), (229, 99), (241, 114)]), fill="#35182F")
    draw.polygon(polygon([(271, 114), (283, 99), (294, 113)]), fill="#35182F")
    draw.polygon(polygon([(224, 110), (229, 104), (235, 110)]), fill="#FFD273")
    draw.polygon(polygon([(277, 110), (283, 104), (288, 110)]), fill="#FFD273")
    draw.polygon(polygon([(250, 120), (256, 111), (262, 120)]), fill="#9F3C12")
    draw.arc(box(221, 99, 291, 143), 18, 162, fill="#35182F", width=7 * DRAW_SCALE)
    draw.ellipse(box(203, 120, 215, 128), fill="#FFBB58")
    draw.ellipse(box(297, 120, 309, 128), fill="#FFBB58")


def render_frame(progress: float) -> Image.Image:
    canvas = Image.new("RGBA", (CANVAS_SIZE * DRAW_SCALE,) * 2)
    draw = ImageDraw.Draw(canvas)
    left_perk = ear_perk(progress, 0.0)
    right_perk = ear_perk(progress, 0.035)
    lift = -4 * (left_perk + right_perk) / 2

    draw_ear(draw, 221, 96 + lift, -32 + 28 * left_perk)
    draw_ear(draw, 291, 96 + lift, 32 - 28 * right_perk)
    draw_pumpkin(draw, lift)
    return canvas.resize((CANVAS_SIZE, CANVAS_SIZE), Image.Resampling.LANCZOS)


def export_apng(frames: list[Image.Image], filename: str) -> None:
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


def export_preview(frames: list[Image.Image]) -> None:
    preview_frames = []
    for frame in frames:
        background = Image.new("RGBA", frame.size, "#F2F0F6")
        photo = Image.new("RGBA", frame.size)
        inset = round(frame.width * (1 - 400 / 512) / 2)
        ImageDraw.Draw(photo).ellipse(
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
    frames = [render_frame(index / FRAME_COUNT) for index in range(FRAME_COUNT)]
    export_apng(frames, "halloween-pumpkin-frame.png")
    small_frames = [
        frame.resize((256, 256), Image.Resampling.LANCZOS) for frame in frames
    ]
    export_apng(small_frames, "halloween-pumpkin-frame-small.png")
    export_preview(small_frames)

    upright = render_frame(0.48)
    upright.save(ASSETS / "halloween-pumpkin-source.png")
    upright.resize((256, 256), Image.Resampling.LANCZOS).save(
        ASSETS / "halloween-pumpkin-thumbnail.webp", format="WEBP", quality=88
    )


if __name__ == "__main__":
    main()
