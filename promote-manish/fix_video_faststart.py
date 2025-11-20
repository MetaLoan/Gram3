#!/usr/bin/env python3
"""
Ensure all MP4/MOV assets place their `moov` atom before `mdat` so that
mobile browsers can start playback immediately (a.k.a. Fast Start).
"""
from __future__ import annotations

import subprocess
from pathlib import Path

VIDEO_EXTS = {".mp4", ".MP4", ".mov", ".MOV"}
ROOT = Path(__file__).resolve().parent


def needs_faststart(path: Path) -> bool:
    data = path.read_bytes()
    moov_idx = data.find(b"moov")
    mdat_idx = data.find(b"mdat")
    return (
        moov_idx == -1
        or mdat_idx == -1
        or moov_idx > mdat_idx
    )


def convert(path: Path) -> None:
    temp_path = path.with_name(f"{path.stem}.tmp{path.suffix}")
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(path),
        "-movflags",
        "faststart",
        "-c",
        "copy",
        str(temp_path),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(
            f"ffmpeg failed for {path}:\n{result.stderr or result.stdout}"
        )
    temp_path.replace(path)


def main() -> None:
    changed = []
    skipped = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix not in VIDEO_EXTS:
            continue
        if needs_faststart(path):
            convert(path)
            changed.append(path.relative_to(ROOT))
        else:
            skipped.append(path.relative_to(ROOT))

    print(f"Converted {len(changed)} file(s).")
    if changed:
        print("\n".join(f"  {p}" for p in changed))
    print(f"Skipped {len(skipped)} file(s) already fast-start ready.")


if __name__ == "__main__":
    main()
