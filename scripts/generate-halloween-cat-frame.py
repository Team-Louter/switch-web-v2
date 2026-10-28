"""Render 15 transparent PNG frames and an APNG cat avatar accessory.

Requires Pillow. The 512px canvas uses the shared ProfileAvatar layout:
the photo is a 400px circle centered at (256, 256).
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw


ASSETS = Path(__file__).resolve().parents[1] / "src/shared/ui/ProfileAvatar/assets"
FRAMES_DIR = ASSETS / "halloween-cat-frames"
FRAME_COUNT = 15
FRAME_DURATION_MS = 80
CANVAS_SIZE = 512
DRAW_SCALE = 3

Point = tuple[float, float]


def cubic(start: Point, control_a: Point, control_b: Point, end: Point) -> list[Point]:
    points = []
    for index in range(17):
        t = index / 16
        inverse = 1 - t
        points.append(
            (
                inverse**3 * start[0]
                + 3 * inverse**2 * t * control_a[0]
                + 3 * inverse * t**2 * control_b[0]
                + t**3 * end[0],
                inverse**3 * start[1]
                + 3 * inverse**2 * t * control_a[1]
                + 3 * inverse * t**2 * control_b[1]
                + t**3 * end[1],
            )
        )
    return points


def scale_points(points: list[Point]) -> list[tuple[int, int]]:
    return [(round(x * DRAW_SCALE), round(y * DRAW_SCALE)) for x, y in points]


def rotate(points: list[Point], angle_degrees: float, pivot: Point) -> list[Point]:
    angle = math.radians(angle_degrees)
    sine, cosine = math.sin(angle), math.cos(angle)
    return [
        (
            pivot[0] + (x - pivot[0]) * cosine - (y - pivot[1]) * sine,
            pivot[1] + (x - pivot[0]) * sine + (y - pivot[1]) * cosine,
        )
        for x, y in points
    ]


def mirror(points: list[Point]) -> list[Point]:
    return [(CANVAS_SIZE - x, y) for x, y in points]


def outer_ear() -> list[Point]:
    # Traced proportions from the reference's left ivory cat ear.
    return (
        cubic((178, 174), (183, 138), (191, 100), (161, 72))
        + cubic((161, 72), (133, 46), (95, 39), (72, 55))[1:]
        + cubic((72, 55), (48, 73), (51, 125), (62, 167))[1:]
        + cubic((62, 167), (79, 194), (139, 199), (178, 174))[1:]
    )


def inner_ear() -> list[Point]:
    return (
        cubic((157, 171), (170, 133), (170, 106), (144, 85))
        + cubic((144, 85), (119, 67), (91, 66), (80, 88))[1:]
        + cubic((80, 88), (69, 108), (81, 143), (99, 176))[1:]
        + cubic((99, 176), (117, 186), (144, 184), (157, 171))[1:]
    )


def draw_ear(layer: Image.Image, angle: float, right: bool) -> None:
    draw = ImageDraw.Draw(layer)
    pivot = (CANVAS_SIZE - 162, 164) if right else (162, 164)
    shapes = (outer_ear(), inner_ear())
    for index, shape in enumerate(shapes):
        if right:
            shape = mirror(shape)
        shape = rotate(shape, -angle if right else angle, pivot)
        draw.polygon(
            scale_points(shape),
            fill=("#F8EDE4" if index == 0 else "#EE8425"),
            outline=("#503744" if index == 0 else "#B25537"),
            width=(3 if index == 0 else 2) * DRAW_SCALE,
        )

    # A small warm highlight changes the original pink interior to Halloween orange.
    highlight = cubic((92, 93), (93, 82), (115, 80), (138, 94))
    if right:
        highlight = mirror(highlight)
    highlight = rotate(highlight, -angle if right else angle, pivot)
    draw.line(scale_points(highlight), fill="#FFBF64", width=3 * DRAW_SCALE, joint="curve")


def draw_whiskers(layer: Image.Image, sway: float) -> None:
    draw = ImageDraw.Draw(layer)
    left_lines = (
        ((95, 258), (28, 252 + sway)),
        ((96, 282), (22, 300 + sway)),
        ((95, 296), (28, 331 + sway)),
    )
    for start, end in left_lines:
        for pair in ((start, end), (mirror([start])[0], mirror([end])[0])):
            draw.line(scale_points(list(pair)), fill="#17151A", width=5 * DRAW_SCALE)
            radius = 2.5 * DRAW_SCALE
            x, y = pair[1][0] * DRAW_SCALE, pair[1][1] * DRAW_SCALE
            draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill="#17151A")


def render_frame(index: int) -> Image.Image:
    progress = index / FRAME_COUNT
    perk = (1 - math.cos(2 * math.pi * progress)) / 2
    whisker_sway = 5 * math.sin(2 * math.pi * progress - 0.35)
    canvas_size = CANVAS_SIZE * DRAW_SCALE
    layer = Image.new("RGBA", (canvas_size, canvas_size))

    # Rotating the same silhouettes keeps the reference ear shape in every frame.
    draw_ear(layer, angle=18 * perk, right=False)
    draw_ear(layer, angle=18 * perk, right=True)

    # Ear bases sit behind the transparent photo opening, as in the reference.
    opening = Image.new("L", (canvas_size, canvas_size))
    ImageDraw.Draw(opening).ellipse(
        (56 * DRAW_SCALE, 56 * DRAW_SCALE, 456 * DRAW_SCALE, 456 * DRAW_SCALE),
        fill=255,
    )
    alpha = layer.getchannel("A")
    layer.putalpha(ImageChops.subtract(alpha, opening))

    draw = ImageDraw.Draw(layer)
    draw.ellipse(
        (55 * DRAW_SCALE, 55 * DRAW_SCALE, 457 * DRAW_SCALE, 457 * DRAW_SCALE),
        outline="#303038",
        width=4 * DRAW_SCALE,
    )
    for right in (False, True):
        side = -1 if right else 1
        x = 49 if not right else 463
        draw.line(
            scale_points([(x, 162), (x - 14 * side, 158)]),
            fill="#F8EDE4",
            width=5 * DRAW_SCALE,
        )
        draw.line(
            scale_points([(x, 176), (x - 12 * side, 176)]),
            fill="#F8EDE4",
            width=4 * DRAW_SCALE,
        )
    draw_whiskers(layer, whisker_sway)
    return layer.resize((CANVAS_SIZE, CANVAS_SIZE), Image.Resampling.LANCZOS)


def export_preview(frames: list[Image.Image]) -> None:
    preview_frames = []
    for frame in frames:
        background = Image.new("RGBA", frame.size, "#202024")
        ImageDraw.Draw(background).ellipse((56, 56, 456, 456), fill="#34343C")
        preview_frames.append(
            Image.alpha_composite(background, frame)
            .resize((256, 256), Image.Resampling.LANCZOS)
            .convert("RGB")
            .quantize(colors=128)
        )
    preview_frames[0].save(
        ASSETS / "halloween-cat-preview.gif",
        save_all=True,
        append_images=preview_frames[1:],
        duration=FRAME_DURATION_MS,
        loop=0,
        disposal=2,
        optimize=True,
    )


def main() -> None:
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)
    for index in range(FRAME_COUNT):
        render_frame(index).save(FRAMES_DIR / f"frame-{index + 1:02}.png")

    # Assemble the APNG from the exact 15 PNG files delivered alongside it.
    frames = []
    for index in range(1, FRAME_COUNT + 1):
        with Image.open(FRAMES_DIR / f"frame-{index:02}.png") as frame:
            frames.append(frame.convert("RGBA"))

    frames[0].save(
        ASSETS / "halloween-cat-frame.png",
        format="PNG",
        save_all=True,
        append_images=frames[1:],
        duration=FRAME_DURATION_MS,
        loop=0,
        disposal=0,
        blend=0,
        compress_level=9,
    )
    frames[7].resize((256, 256), Image.Resampling.LANCZOS).save(
        ASSETS / "halloween-cat-thumbnail.webp", format="WEBP", quality=88
    )
    export_preview(frames)


if __name__ == "__main__":
    main()
