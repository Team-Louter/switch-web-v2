"""Convert downloaded store decoration originals to WebP (requires Pillow).

Usage: python scripts/optimize-profile-decoration-images.py SOURCE_DIRECTORY
Keep the uploaded filenames below when downloading replacement originals.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


ASSETS = Path(__file__).resolve().parents[1] / "src/shared/ui/ProfileAvatar/assets"
SOURCES = {
    "0aa8639a-c611-4a9f-b171-48494d7efcd4.png": "cookie-frame",
    "598b5cf0-38ef-446b-9d88-225704a7adde.png": "halloween-cat-frame",
    "3cd2bfc3-2ea5-474e-85fc-cdeb85959a7d.png": "halloween-frame",
    "4169d6c8-bc96-4b93-b7bc-3f463c8626fc.png": "papaya-frame",
}


def convert(source: Path, name: str) -> None:
    with Image.open(source) as image:
        frames = []
        durations = []
        loop = image.info.get("loop", 0)
        for index in range(image.n_frames):
            image.seek(index)
            frames.append(image.convert("RGBA"))
            durations.append(round(image.info.get("duration", 0)))

    for size, suffix in ((512, ""), (128, "-small")):
        resized = [
            frame.resize((size, size), Image.Resampling.LANCZOS)
            for frame in frames
        ]
        target = ASSETS / f"{name}{suffix}.webp"
        # Small static frames use lossless color to retain sharp, saturated edges.
        options = {
            "quality": 85,
            "method": 4,
            "exact": True,
            "lossless": len(frames) == 1 and size == 128,
        }
        if len(resized) > 1:
            options.update(
                save_all=True,
                append_images=resized[1:],
                duration=durations,
                loop=loop,
                allow_mixed=False,
            )
        temporary = target.with_suffix(".tmp.webp")
        resized[0].save(temporary, format="WEBP", **options)
        temporary.replace(target)
        reduction = 100 * (1 - target.stat().st_size / source.stat().st_size)
        print(f"{target.name}: {target.stat().st_size:,} bytes ({reduction:.1f}% smaller)", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source_directory", type=Path)
    args = parser.parse_args()
    for filename, name in SOURCES.items():
        convert(args.source_directory / filename, name)
