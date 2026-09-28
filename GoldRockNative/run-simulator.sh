#!/usr/bin/env bash
set -euo pipefail

native_root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
service_root="$(cd "$native_root/../GoldRockNativeService" && pwd)"
if [[ "$(uname -s)" != "Darwin" ]]; then echo 'Run this native app on a Mac with Xcode.' >&2; exit 1; fi
for tool in xcodebuild xcrun node python3 curl; do
  if ! command -v "$tool" >/dev/null 2>&1; then echo "Missing $tool." >&2; exit 1; fi
done
if ! node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 24 ? 0 : 1)'; then
  echo 'GoldRockNativeService needs Node.js 24 or newer.' >&2; exit 1
fi

simulator_udid="${GOLDROCK_SIMULATOR_UDID:-}"
if [[ -z "$simulator_udid" ]]; then
  simulator_udid="$(xcrun simctl list devices available -j | python3 -c '
import json, sys
devices = json.load(sys.stdin)["devices"]
iphones = [(runtime, device) for runtime, entries in devices.items() for device in entries if "iPhone" in device.get("name", "") and device.get("isAvailable", True)]
iphones.sort(key=lambda pair: (pair[1].get("state") == "Booted", pair[0]), reverse=True)
print(iphones[0][1]["udid"] if iphones else "")
')"
fi
if [[ -z "$simulator_udid" ]]; then echo 'Install an iPhone simulator runtime in Xcode.' >&2; exit 1; fi

service_pid=""
cleanup() { if [[ -n "$service_pid" ]]; then kill "$service_pid" 2>/dev/null || true; wait "$service_pid" 2>/dev/null || true; fi; }
trap cleanup EXIT INT TERM
if ! curl --fail --silent --max-time 2 http://127.0.0.1:4390/api/config >/dev/null 2>&1; then
  (cd "$service_root" && node server/main.js) &
  service_pid="$!"
  for _ in {1..30}; do
    if curl --fail --silent --max-time 2 http://127.0.0.1:4390/api/config >/dev/null 2>&1; then break; fi
    if ! kill -0 "$service_pid" 2>/dev/null; then echo 'Local service exited.' >&2; exit 1; fi
    sleep 1
  done
  curl --fail --silent --max-time 2 http://127.0.0.1:4390/api/config >/dev/null
fi

xcrun simctl boot "$simulator_udid" >/dev/null 2>&1 || true
xcrun simctl bootstatus "$simulator_udid" -b
open -a Simulator >/dev/null 2>&1 || true
derived_data="${GOLDROCK_DERIVED_DATA:-$native_root/.build/DerivedData}"
mkdir -p "$native_root/.build"
build_args=(-project "$native_root/GoldRock.xcodeproj" -scheme GoldRock -configuration Debug -destination "platform=iOS Simulator,id=$simulator_udid" -derivedDataPath "$derived_data" 'CODE_SIGN_IDENTITY=-')
set -o pipefail
xcodebuild "${build_args[@]}" build 2>&1 | tee "$native_root/.build/build.log"
if [[ "${GOLDROCK_RUN_TESTS:-0}" == "1" ]]; then xcodebuild "${build_args[@]}" test 2>&1 | tee "$native_root/.build/test.log"; fi
app_path="$derived_data/Build/Products/Debug-iphonesimulator/GoldRock.app"
test -d "$app_path" || { echo "Built app missing: $app_path" >&2; exit 1; }
xcrun simctl install "$simulator_udid" "$app_path"
xcrun simctl terminate "$simulator_udid" com.goldrockhealth.app >/dev/null 2>&1 || true
xcrun simctl launch "$simulator_udid" com.goldrockhealth.app
echo 'GoldRock native iPhone app launched. Keep this terminal open if it started the local service.'
if [[ -n "$service_pid" ]]; then wait "$service_pid"; fi
