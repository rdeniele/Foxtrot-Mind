# Foxtrot Mind

Your offline mind companion — a private space to read, think, learn, and talk. Built with Expo / React Native, Android-first.

```
Talk (text) -> Qwen3 0.6B (llama.rn) -> streamed reply
```

Everything runs on the phone. Internet is only needed once, to download the model.

## Run it

The local AI engine (`llama.rn`) is a native module, so **Expo Go cannot run it**.
You need a development build (an APK of this app).

```bash
npm install
npx tsc --noEmit     # typecheck
npx expo lint        # lint
```

**Build locally** (needs Android Studio or the standalone SDK, NDK, CMake, `ANDROID_HOME`):

```bash
npx expo run:android
```

**Or build in the cloud** (no local Android SDK needed):

```bash
npx eas login
npx eas build --profile development --platform android
```

Install the APK on the phone, then:

```bash
npx expo start --dev-client
```

On first launch, go through onboarding (or open Settings) and download the model —
**Qwen3 0.6B** (~380 MB, Q4_K_M quantization). Nothing downloads automatically; you're
always the one who starts it, and you can cancel, delete, or re-download it any time
from Settings → AI and models.

## Layout

```
src/theme            design tokens (color, spacing, type), ThemeProvider (light/dark/system)
src/components/ui     reusable design-system components (Button, ChatBubble, BottomSheet, ...)
src/ai                ModelProvider, modelManager (resumable download), localModel (llama.rn
                       wrapper: load/unload/generate with streaming), per-companion-mode prompts
src/state             onboarding + app-wide preferences (companion mode, response length)
src/app               expo-router screens: onboarding, (tabs) Home/Explore/Talk/Library/Progress,
                       reading, challenge, settings
src/data              realistic sample content (library, challenges, vocabulary, progress)
```

## What's real vs. simulated

- **Real:** the local model download (resumable, size-verified, cancelable), loading it into
  memory with `llama.rn`, and streaming token-by-token replies in Talk, per companion mode.
- **Simulated / not built yet:** voice input and output (shown as correctly "Unavailable" in
  Settings until on-device speech components are wired in), Journal/Brain Dump, Idea Vault,
  Memory management, and Vocabulary/Flashcards screens.

## Design system

Dark-first, OLED-friendly, lime-on-near-black (`#D8F27A` on `#101310`), with a matching light
theme. See `src/theme/tokens.ts` for the full palette, spacing scale, and radii.
