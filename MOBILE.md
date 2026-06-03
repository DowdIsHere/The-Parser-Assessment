# Parser Profile™ — iOS / App Store Guide

This turns the existing web app into a native iOS app with **Capacitor**, selling
the paid report through **Apple In-App Purchase (IAP)** while keeping **Stripe on
the web**. Everything native lives in [`mobile/`](./mobile) and is **self-contained
— it does not touch the Express/Railway backend or its deploy.**

> **What needs your machine:** building, signing, and submitting an iOS app
> requires a **Mac with Xcode** and an **Apple Developer account ($99/yr)**.
> Steps below get you to "open Xcode and press Run/Archive."

---

## Architecture at a glance

| Concern | Web (today) | iOS app (this guide) |
|---|---|---|
| Frontend | `assessment.html` + 27 profile modules, served by Express | Same files, loaded in a Capacitor WebView |
| Backend / API | Express on Railway | **Same Railway backend** (unchanged) |
| Payments | Stripe | **Apple IAP** (StoreKit) — Stripe stays web-only |
| Profiles content | `index.js` → 27 profiles | Same data, no changes |

The app loads your **live Railway site** (`server.url` in `capacitor.config.json`),
so all existing `/api/...` calls keep working with zero frontend refactor. IAP is
layered on through the Capacitor bridge.

---

## 1. One-time setup (Mac)

```bash
cd mobile
npm install
# point the app at your real backend:
#   - capacitor.config.json  → server.url + allowNavigation
#   - iap.js                 → VALIDATOR_URL
npm run add:ios            # builds www/ and creates the native iOS project
npm run open:ios           # opens Xcode
```

In Xcode: set your **Team** (Signing & Capabilities), add the **In-App Purchase**
capability, then Run on a device/simulator.

> Android is ready too (`npm run add:android`) but Google Play has its own billing
> rules — out of scope here.

---

## 2. Configure the App Store IAP product

In **App Store Connect → your app → Monetization → In-App Purchases**:

1. Create a **Consumable** (the report is a one-time unlock per assessment).
2. **Product ID:** `parser_profile_full_report` (must match `iap.js`).
3. Set price tier, localized name/description, and a review screenshot.
4. **App Information → App-Specific Shared Secret** → copy it.

On Railway, add the env var:

```
APPLE_IAP_SHARED_SECRET=<the shared secret>
```

---

## 3. Wire receipt verification (backend — additive, 2 lines)

The unlock is only trusted after the server confirms the receipt with Apple. The
router is already written: [`mobile/server-iap-verify.mjs`](./mobile/server-iap-verify.mjs).
Mount it in `server.js`:

```js
import iapVerify from './mobile/server-iap-verify.mjs';
app.use(iapVerify);                       // adds POST /api/iap/verify
```

This adds an endpoint only; it changes nothing existing. (If `server.js` is
CommonJS, use `const iapVerify = (await import('./mobile/server-iap-verify.mjs')).default;`
or convert the router to `require`.)

---

## 4. Wire the purchase button (frontend — the only client hook)

`assessment.html`'s Stripe success path already ends in **`unlockFullReport()`**.
On iOS we just call the same function after a verified IAP purchase. Add `iap.js`
and branch the buy UI:

```html
<!-- near the other <script> tags -->
<script src="iap.js"></script>
```

```js
// where the paywall / unlock UI is initialized:
if (window.ParserIAP && ParserIAP.isAvailable()) {
    await ParserIAP.init();

    // Hide the Stripe card form; show a native unlock button.
    document.getElementById('card-element')?.closest('.payment-section')?.classList.add('hidden');
    const price = ParserIAP.priceString() || 'Unlock';
    const btn = document.getElementById('iosUnlockBtn'); // a button you add
    btn.textContent = `Unlock Full Report — ${price}`;
    btn.onclick = async () => {
        try {
            await ParserIAP.purchase();   // resolves only after server verification
            unlockFullReport();           // existing success callback — reused as-is
        } catch (e) { /* show "purchase cancelled / failed" */ }
    };

    // App Store requires a visible Restore Purchases control:
    document.getElementById('iosRestoreBtn').onclick = () => ParserIAP.restore();
}
```

Because this is gated on `ParserIAP.isAvailable()` (true only inside the iOS app),
the **web build is completely unaffected** — Stripe runs exactly as before.

---

## 5. App Store review notes (avoid common rejections)

- **Guideline 3.1.1 — Payments:** digital goods *must* use IAP. ✅ handled (Stripe
  is never invoked on iOS). Do not show external "buy on our website" links for the
  report inside the app.
- **Guideline 4.2 — Minimum functionality:** a pure webview can be rejected. This
  app is defensible (assessment engine, 27 profiles, native IAP, results), but to
  strengthen it you can switch to **Bundled mode** (below) so content ships in the
  binary rather than loading a website.
- Provide a **Restore Purchases** button (wired above) and a **Sandbox** test
  account for the reviewer.
- Add **Privacy Policy** and **Terms** links (Apple requires them for IAP).

---

## 6. Run modes

**LIVE (default, recommended to start):** `capacitor.config.json` has `server.url`
set to Railway. The WebView loads your deployed site; nothing to bundle. Fastest to
ship; relies on connectivity.

**BUNDLED (advanced, stronger for 4.2):** remove `server.url`, ship `mobile/www/`
(produced by `npm run build:www`) inside the app, and point the frontend at the
remote API:
- set `window.PARSER_API_BASE` (see generated `www/app-config.js`), and
- prefix the frontend `fetch('/api/...')` calls with `window.PARSER_API_BASE`.

Start with LIVE; move to BUNDLED if review pushes back.

---

## 7. Submission checklist

- [ ] `mobile/npm install` succeeds on your Mac
- [ ] `server.url` + `allowNavigation` + `iap.js` VALIDATOR_URL point at Railway
- [ ] IAP product `parser_profile_full_report` created & "Ready to Submit"
- [ ] `APPLE_IAP_SHARED_SECRET` set on Railway; `/api/iap/verify` mounted & deployed
- [ ] Purchase + Restore tested with a Sandbox account on a real device
- [ ] App icon (1024px) + splash set; bundle ID `com.cognitionblocks.parserprofile`
- [ ] Privacy Policy / Terms URLs in App Store Connect
- [ ] Archive in Xcode → upload → submit for review

---

## Files in `mobile/`

| File | Purpose |
|---|---|
| `package.json` | Self-contained Capacitor tooling (separate from the server) |
| `capacitor.config.json` | App ID, name, `server.url`, splash/status bar |
| `scripts/build-www.mjs` | Copies the client assets into `www/` (the webDir) |
| `iap.js` | StoreKit purchase layer; inert off-iOS (Stripe untouched) |
| `server-iap-verify.mjs` | Apple receipt validation endpoint (mount in `server.js`) |

`www/`, `ios/`, `android/`, and `node_modules/` are generated locally and
git-ignored.
