# Matching local API for GoldRock Native

This Node.js 24+ service supplies account, employer-benefit and optional reviewed AI endpoints to `../GoldRockNative/`. It also exposes public configuration and research endpoints. It is separate from the repository's existing server; neither server is overwritten.

For iPhone Simulator development, run `bash ../GoldRockNative/run-simulator.sh` from a Mac. That script starts this service on loopback, builds the native app, and installs it. To start the service alone, run `node server/main.js` here. The app's Debug default is `http://127.0.0.1:4390`. A physical iPhone requires a reachable HTTPS deployment and an address set in **You → Connection**.

No key is committed. Without `OPENAI_API_KEY`, `OPENAI_MODEL` and an explicit `GOLDROCK_ENABLE_CLOUD=1`, the local app still supports case work and deterministic guidance while cloud AI remains disabled. See `.env.example` for configuration names. Original documents are processed on the device and are not accepted as uploads by this service.
