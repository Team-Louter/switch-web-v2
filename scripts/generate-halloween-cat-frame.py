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


def bend_ear(points: list[Point], angle_degrees: float, pivot: Point) -> list[Point]:
    bent = []
    for x, y in points:
        # Keep the base fixed against the avatar rim while the ear tip perks up.
        tip_weight = smoothstep((176 - y) / 100)
        angle = math.radians(angle_degrees * tip_weight)
        sine, cosine = math.sin(angle), math.cos(angle)
        bent.append(
            (
                pivot[0] + (x - pivot[0]) * cosine - (y - pivot[1]) * sine,
                pivot[1] + (x - pivot[0]) * sine + (y - pivot[1]) * cosine,
            )
        )
    return bent


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
        + cubic((80, 88), (74, 96), (77, 105), (82, 109))[1:]
        + cubic((82, 109), (72, 110), (75, 120), (85, 125))[1:]
        + cubic((85, 125), (78, 130), (86, 150), (99, 176))[1:]
        + cubic((99, 176), (117, 186), (144, 184), (157, 171))[1:]
    )


def draw_ear(layer: Image.Image, angle: float, right: bool) -> None:
    draw = ImageDraw.Draw(layer)
    pivot = (CANVAS_SIZE - 162, 164) if right else (162, 164)
    shapes = (outer_ear(), inner_ear())
    for index, shape in enumerate(shapes):
        if right:
            shape = mirror(shape)
        shape = bend_ear(shape, -angle if right else angle, pivot)
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
    highlight = bend_ear(highlight, -angle if right else angle, pivot)
    draw.line(scale_points(highlight), fill="#FFBF64", width=3 * DRAW_SCALE, joint="curve")


def draw_whiskers(layer: Image.Image, progress: float) -> None:
    draw = ImageDraw.Draw(layer)
    # The reference lifts each entire whisker, then briefly dips it below rest.
    # Its tips travel farther than its roots, and the top whisker pulls inward.
    poses = (
        (0.00, 0.00),
        (0.10, 0.52),
        (0.34, 0.52),
        (0.56, 1.00),
        (0.66, 0.88),
        (0.78, 0.42),
        (0.89, -0.45),
        (1.00, 0.00),
    )
    lift = 0.0
    for (start_time, start_lift), (end_time, end_lift) in zip(poses, poses[1:]):
        if progress <= end_time:
            blend = smoothstep((progress - start_time) / (end_time - start_time))
            lift = start_lift + (end_lift - start_lift) * blend
            break

    left_lines = (
        ((116, 258), (42, 250), -20, -29, 25),
        ((112, 282), (35, 292), -15, -39, 7),
        ((111, 296), (36, 320), -12, -43, -7),
    )
    for start, end, root_rise, tip_rise, tip_pull in left_lines:
        root = (start[0], start[1] + root_rise * lift)
        tip = (end[0] + tip_pull * lift, end[1] + tip_rise * lift)
        for right in (False, True):
            whisker_root, whisker_tip = mirror([root, tip]) if right else (root, tip)
            dx, dy = whisker_tip[0] - whisker_root[0], whisker_tip[1] - whisker_root[1]
            length = math.hypot(dx, dy)
            normal_x, normal_y = -dy / length, dx / length
            draw.polygon(
                scale_points(
                    [
                        (whisker_root[0] + 5 * normal_x, whisker_root[1] + 5 * normal_y),
                        (whisker_tip[0] + 1.5 * normal_x, whisker_tip[1] + 1.5 * normal_y),
                        (whisker_tip[0] - 1.5 * normal_x, whisker_tip[1] - 1.5 * normal_y),
                        (whisker_root[0] - 5 * normal_x, whisker_root[1] - 5 * normal_y),
                    ]
                ),
                fill="#08080B",
            )
            draw.ellipse(
                (
                    round((whisker_root[0] - 5) * DRAW_SCALE),
                    round((whisker_root[1] - 5) * DRAW_SCALE),
                    round((whisker_root[0] + 5) * DRAW_SCALE),
                    round((whisker_root[1] + 5) * DRAW_SCALE),
                ),
                fill="#08080B",
            )


def draw_blush(layer: Image.Image, progress: float) -> None:
    # Preserve the original cheek artwork and spread its fade across more frames.
    wave = (1 + math.cos(2 * math.pi * (progress - 0.10))) / 2
    opacity = smoothstep((wave - 0.10) / 0.75)
    if opacity <= 0:
        return

    size = layer.size
    glow_mask = Image.new("L", size)
    glow_draw = ImageDraw.Draw(glow_mask)
    details = Image.new("RGBA", size)
    detail_draw = ImageDraw.Draw(details)

    for center_x in (132, 380):
        center_y = 286
        glow_draw.ellipse(
            (
                round((center_x - 52) * DRAW_SCALE),
                round((center_y - 38) * DRAW_SCALE),
                round((center_x + 52) * DRAW_SCALE),
                round((center_y + 38) * DRAW_SCALE),
            ),
            fill=round(115 * opacity),
        )
        detail_draw.ellipse(
            (
                round((center_x - 37) * DRAW_SCALE),
                round((center_y - 25) * DRAW_SCALE),
                round((center_x + 37) * DRAW_SCALE),
                round((center_y + 25) * DRAW_SCALE),
            ),
            fill=(255, 114, 190, round(95 * opacity)),
        )
        for offset in (-17, -7, 3, 13):
            detail_draw.line(
                scale_points(
                    [
                        (center_x + offset - 5, center_y + 9),
                        (center_x + offset + 4, center_y - 11),
                    ]
                ),
                fill=(172, 46, 135, round(185 * opacity)),
                width=3 * DRAW_SCALE,
            )

    # Blur only alpha: blurring transparent black RGB produced a gray fringe.
    softened = Image.new("RGBA", size, (244, 82, 169))
    softened.putalpha(glow_mask.filter(ImageFilter.GaussianBlur(9 * DRAW_SCALE)))
    layer.alpha_composite(softened)
    layer.alpha_composite(details)


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
    flop = smoothstep((progress - 0.12) / 0.38) * (
        1 - smoothstep((progress - 0.62) / 0.25)
    )
    canvas_size = CANVAS_SIZE * DRAW_SCALE
    layer = Image.new("RGBA", (canvas_size, canvas_size))

    # The ears fold outward, then perk up; their bases stay fixed to the avatar.
    draw_ear(layer, angle=-16 * flop, right=False)
    draw_ear(layer, angle=-16 * flop, right=True)

    draw = ImageDraw.Draw(layer)
    for right in (False, True):
        left_tufts = (((75, 162), (36, 158), 7), ((77, 176), (45, 176), 6))
        for start, end, width in left_tufts:
            if right:
                start, end = mirror([start, end])
            draw.line(scale_points([start, end]), fill="#F8EDE4", width=width * DRAW_SCALE)

    # Ear bases sit behind the transparent photo opening, as in the reference.
    opening = Image.new("L", (canvas_size, canvas_size))
    ImageDraw.Draw(opening).ellipse(
        (56 * DRAW_SCALE, 56 * DRAW_SCALE, 456 * DRAW_SCALE, 456 * DRAW_SCALE),
        fill=255,
    )
    alpha = layer.getchannel("A")
    layer.putalpha(ImageChops.subtract(alpha, opening))

    draw_pumpkin(layer, progress)
    draw_blush(layer, progress)
    draw_whiskers(layer, progress)
    draw_sparkles(layer, progress)
    return layer.resize((CANVAS_SIZE, CANVAS_SIZE), Image.Resampling.LANCZOS)


def export_preview(frames: list[Image.Image]) -> None:
    rgb_frames = []
    for frame in frames:
        background = Image.new("RGBA", frame.size, "#202024")
        ImageDraw.Draw(background).ellipse((56, 56, 456, 456), fill="#34343C")
        rgb_frames.append(
            Image.alpha_composite(background, frame)
            .resize((256, 256), Image.Resampling.LANCZOS)
            .convert("RGB")
        )

    # A shared palette prevents the tiny green stem from turning brown as each
    # GIF frame is quantized. Reserve its exact color before filling the rest.
    palette_source = Image.new("RGB", (256, 256 * len(rgb_frames)))
    for index, frame in enumerate(rgb_frames):
        palette_source.paste(frame, (0, 256 * index))
    generated_palette = palette_source.quantize(
        colors=252, method=Image.Quantize.MEDIANCUT
    ).getpalette()
    reserved_colors = (
        (84, 141, 62),  # pumpkin stem
        (63, 38, 59),   # stem outline
        (255, 146, 41), # pumpkin body
        (52, 52, 60),   # preview photo
    )
    palette_values = [channel for color in reserved_colors for channel in color]
    palette_values.extend(generated_palette[: 252 * 3])
    shared_palette = Image.new("P", (1, 1))
    shared_palette.putpalette(palette_values)
    preview_frames = [
        frame.quantize(palette=shared_palette, dither=Image.Dither.NONE)
        for frame in rgb_frames
    ]
    preview_frames[0].save(
        ASSETS / "halloween-cat-preview.gif",
        save_all=True,
        append_images=preview_frames[1:],
        duration=FRAME_DURATION_MS,
        loop=0,
        disposal=2,
        optimize=False,
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
