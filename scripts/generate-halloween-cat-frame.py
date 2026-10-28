"""Render 25 transparent PNG frames and an APNG cat avatar accessory.

Requires Pillow. The 512px canvas uses the shared ProfileAvatar layout:
the photo is a 400px circle centered at (256, 256).
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ASSETS = Path(__file__).resolve().parents[1] / "src/shared/ui/ProfileAvatar/assets"
FRAMES_DIR = ASSETS / "halloween-cat-frames"
FRAME_COUNT = 25
FRAME_DURATION_MS = 60
CANVAS_SIZE = 512
DRAW_SCALE = 3

Point = tuple[float, float]


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3 - 2 * value)


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
        ((111, 258), (28, 252 + sway)),
        ((112, 282), (22, 300 + sway)),
        ((111, 296), (28, 331 + sway)),
    )
    for start, end in left_lines:
        for pair in ((start, end), (mirror([start])[0], mirror([end])[0])):
            root, tip = pair
            delta_x, delta_y = tip[0] - root[0], tip[1] - root[1]
            length = math.hypot(delta_x, delta_y)
            normal_x, normal_y = -delta_y / length, delta_x / length
            draw.polygon(
                scale_points(
                    [
                        (root[0] + 5 * normal_x, root[1] + 5 * normal_y),
                        (tip[0] + 1.5 * normal_x, tip[1] + 1.5 * normal_y),
                        (tip[0] - 1.5 * normal_x, tip[1] - 1.5 * normal_y),
                        (root[0] - 5 * normal_x, root[1] - 5 * normal_y),
                    ]
                ),
                fill="#211B24",
            )
            draw.ellipse(
                (
                    round((root[0] - 5) * DRAW_SCALE),
                    round((root[1] - 5) * DRAW_SCALE),
                    round((root[0] + 5) * DRAW_SCALE),
                    round((root[1] + 5) * DRAW_SCALE),
                ),
                fill="#211B24",
            )


def draw_blush(layer: Image.Image, progress: float) -> None:
    # The reference alternates between visible cheeks and a bare avatar.
    opacity = smoothstep((math.cos(2 * math.pi * (progress - 0.10)) + 0.10) / 0.80)
    if opacity <= 0:
        return

    size = layer.size
    glow = Image.new("RGBA", size)
    glow_draw = ImageDraw.Draw(glow)
    details = Image.new("RGBA", size)
    detail_draw = ImageDraw.Draw(details)

    for center_x in (120, 392):
        center_y = 282
        glow_draw.ellipse(
            (
                round((center_x - 52) * DRAW_SCALE),
                round((center_y - 38) * DRAW_SCALE),
                round((center_x + 52) * DRAW_SCALE),
                round((center_y + 38) * DRAW_SCALE),
            ),
            fill=(244, 82, 169, round(85 * opacity)),
        )
        detail_draw.ellipse(
            (
                round((center_x - 37) * DRAW_SCALE),
                round((center_y - 25) * DRAW_SCALE),
                round((center_x + 37) * DRAW_SCALE),
                round((center_y + 25) * DRAW_SCALE),
            ),
            fill=(255, 114, 190, round(55 * opacity)),
        )
        for offset in (-12, 0, 12):
            detail_draw.line(
                scale_points(
                    [
                        (center_x + offset - 5, center_y + 9),
                        (center_x + offset + 4, center_y - 11),
                    ]
                ),
                fill=(172, 46, 135, round(110 * opacity)),
                width=3 * DRAW_SCALE,
            )

    softened = glow.filter(ImageFilter.GaussianBlur(12 * DRAW_SCALE))
    layer.alpha_composite(softened)
    layer.alpha_composite(details.filter(ImageFilter.GaussianBlur(2 * DRAW_SCALE)))


def draw_pumpkin(layer: Image.Image, progress: float) -> None:
    """Place one small jack-o'-lantern between the ears, above the photo."""
    bob = -4 * (1 - math.cos(2 * math.pi * progress)) / 2

    def box(left: float, top: float, right: float, bottom: float) -> tuple[int, ...]:
        return tuple(
            round(value * DRAW_SCALE)
            for value in (left, top + bob, right, bottom + bob)
        )

    def points(vertices: list[Point]) -> list[tuple[int, int]]:
        return scale_points([(x, y + bob) for x, y in vertices])

    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle(
        box(249, 24, 265, 55), radius=6 * DRAW_SCALE, fill="#3F263B"
    )
    draw.rounded_rectangle(
        box(252, 27, 262, 51), radius=4 * DRAW_SCALE, fill="#548D3E"
    )
    draw.ellipse(box(207, 43, 305, 121), fill="#45253C")
    draw.ellipse(box(212, 48, 249, 116), fill="#DB5A16")
    draw.ellipse(box(263, 48, 300, 116), fill="#DB5A16")
    draw.ellipse(box(230, 46, 282, 118), fill="#FF9229")
    draw.arc(
        box(229, 51, 282, 115), 195, 345, fill="#FFC367", width=2 * DRAW_SCALE
    )
    draw.polygon(points([(229, 82), (239, 69), (248, 83)]), fill="#45253C")
    draw.polygon(points([(264, 83), (273, 69), (283, 82)]), fill="#45253C")
    draw.polygon(points([(251, 91), (256, 83), (261, 91)]), fill="#A44517")
    draw.arc(
        box(227, 71, 285, 106), 20, 160, fill="#45253C", width=5 * DRAW_SCALE
    )
    draw.ellipse(box(217, 88, 225, 94), fill="#FFBD62")
    draw.ellipse(box(287, 88, 295, 94), fill="#FFBD62")


def draw_sparkles(layer: Image.Image, progress: float) -> None:
    glow = Image.new("RGBA", layer.size)
    glow_draw = ImageDraw.Draw(glow)
    sharp = Image.new("RGBA", layer.size)
    sharp_draw = ImageDraw.Draw(sharp)
    anchors = (
        (454, 258, 0.25),
        (256, 459, 0.50),
        (57, 308, 0.75),
    )
    for x, y, phase in anchors:
        pulse = (1 + math.cos(2 * math.pi * (progress - phase))) / 2
        if pulse < 0.08:
            continue
        radius = 6 + 12 * pulse
        xh, yh = round(x * DRAW_SCALE), round(y * DRAW_SCALE)
        glow_draw.ellipse(
            (
                xh - 17 * DRAW_SCALE,
                yh - 17 * DRAW_SCALE,
                xh + 17 * DRAW_SCALE,
                yh + 17 * DRAW_SCALE,
            ),
            fill=(255, 197, 74, round(130 * pulse)),
        )
        sharp_draw.polygon(
            scale_points(
                [
                    (x, y - radius),
                    (x + radius * 0.22, y - radius * 0.22),
                    (x + radius, y),
                    (x + radius * 0.22, y + radius * 0.22),
                    (x, y + radius),
                    (x - radius * 0.22, y + radius * 0.22),
                    (x - radius, y),
                    (x - radius * 0.22, y - radius * 0.22),
                ]
            ),
            fill=(255, 240, 159, round(230 * pulse)),
        )

    layer.alpha_composite(glow.filter(ImageFilter.GaussianBlur(7 * DRAW_SCALE)))
    layer.alpha_composite(sharp)


def render_frame(index: int) -> Image.Image:
    progress = index / FRAME_COUNT
    perk = (1 - math.cos(2 * math.pi * progress)) / 2
    whisker_sway = 2.5 * math.sin(2 * math.pi * progress - 0.35)
    canvas_size = CANVAS_SIZE * DRAW_SCALE
    layer = Image.new("RGBA", (canvas_size, canvas_size))

    # The reference ears mostly hold their shape while the face effects animate.
    draw_ear(layer, angle=8 * perk, right=False)
    draw_ear(layer, angle=8 * perk, right=True)

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
            scale_points([(x, 162), (x - 18 * side, 158)]),
            fill="#F8EDE4",
            width=7 * DRAW_SCALE,
        )
        draw.line(
            scale_points([(x, 176), (x - 16 * side, 176)]),
            fill="#F8EDE4",
            width=6 * DRAW_SCALE,
        )
    draw_pumpkin(layer, progress)
    draw_whiskers(layer, whisker_sway)
    draw_blush(layer, progress)
    draw_sparkles(layer, progress)
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

    # Assemble the APNG from the exact 25 PNG files delivered alongside it.
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
    frames[0].resize((256, 256), Image.Resampling.LANCZOS).save(
        ASSETS / "halloween-cat-thumbnail.webp", format="WEBP", quality=88
    )
    export_preview(frames)


if __name__ == "__main__":
    main()
