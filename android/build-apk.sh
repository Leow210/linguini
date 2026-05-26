#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
GRADLE_BIN="${GRADLE_BIN:-/Users/leowoo/.gradle/wrapper/dists/gradle-8.7-bin/bhs2wmbdwecv87pi65oeuq5iu/gradle-8.7/bin/gradle}"

cd "$SCRIPT_DIR"
if [ -x "$GRADLE_BIN" ]; then
  "$GRADLE_BIN" assembleDebug
else
  gradle assembleDebug
fi
