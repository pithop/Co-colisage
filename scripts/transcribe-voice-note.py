"""Generate a bundled Whisper transcript locally, without sending audio to a service.

Requires ffmpeg, numpy and faster-whisper in a separate Python environment.
Example: python scripts/transcribe-voice-note.py public/audio/voice-note-1.ogg
  src/data/voice-note-1.transcript.json --duration 14
"""

import argparse
import hashlib
import json
import subprocess
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--duration", type=float)
    args = parser.parse_args()
    if args.duration is not None and args.duration <= 0:
        parser.error("--duration must be positive")
    command = ["ffmpeg", "-v", "error", "-i", str(args.input)]
    if args.duration is not None:
        command += ["-t", str(args.duration)]
    command += ["-f", "f32le", "-ar", "16000", "-ac", "1", "pipe:1"]
    decoded = subprocess.run(command, check=True, capture_output=True).stdout
    model = WhisperModel("base", device="cpu", compute_type="int8", cpu_threads=2)
    segments, info = model.transcribe(np.frombuffer(decoded, dtype=np.float32), beam_size=5)
    text = " ".join(segment.text.strip() for segment in segments).strip()
    if not text:
        raise ValueError("No speech detected; no transcript was saved")
    transcript = {
        "text": text,
        "engine": "whisper",
        "language": info.language,
        "model": "base",
        "durationSeconds": len(decoded) / (16000 * 4),
        "audioSha256": hashlib.sha256(args.input.read_bytes()).hexdigest(),
    }
    args.output.write_text(json.dumps(transcript, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
