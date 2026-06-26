// Apple IAP receipt verification — mountable Express router.
// ---------------------------------------------------------------------------
// cordova-plugin-purchase POSTs the App Store receipt here; we validate it with
// Apple and answer in the format the plugin expects. This is the trust boundary:
// the client unlock is only honored after THIS endpoint confirms the receipt.
//
// Mount in server.js (additive — one line, after express.json() is set up):
//
//     import iapVerify from './mobile/server-iap-verify.mjs';
//     app.use(iapVerify);
//
// Required env (Railway → Variables):
//     APPLE_IAP_SHARED_SECRET   App Store Connect → App → App-Specific Shared Secret
//
// Note: verifyReceipt is the legacy endpoint (still supported). For new builds
// Apple recommends the App Store Server API + StoreKit 2; this router is the
// fastest path to a working, compliant unlock and can be swapped later.
// ---------------------------------------------------------------------------

import express from 'express';

const router = express.Router();

const PRODUCTION_URL = 'https://buy.itunes.apple.com/verifyReceipt';
const SANDBOX_URL = 'https://sandbox.itunes.apple.com/verifyReceipt';
const VALID_PRODUCT_IDS = new Set(['parser_profile_full_report']);

async function callApple(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

router.post('/api/iap/verify', express.json(), async (req, res) => {
  try {
    // cordova-plugin-purchase sends the transaction; the StoreKit receipt is the
    // base64 app receipt. Accept the common shapes.
    const receiptData =
      req.body?.transaction?.appStoreReceipt ||
      req.body?.transaction?.receipt ||
      req.body?.appStoreReceipt ||
      req.body?.receipt;

    if (!receiptData) {
      return res.status(400).json({ ok: false, error: { message: 'Missing receipt data' } });
    }

    const payload = {
      'receipt-data': receiptData,
      password: process.env.APPLE_IAP_SHARED_SECRET,
      'exclude-old-transactions': true
    };

    // Always hit production first; status 21007 means it's a Sandbox receipt.
    let apple = await callApple(PRODUCTION_URL, payload);
    if (apple.status === 21007) {
      apple = await callApple(SANDBOX_URL, payload);
    }

    if (apple.status !== 0) {
      return res.status(400).json({ ok: false, error: { message: `Apple status ${apple.status}`, code: apple.status } });
    }

    // Confirm our product is actually present in the verified receipt.
    const items = apple.receipt?.in_app || [];
    const purchased = items.filter((i) => VALID_PRODUCT_IDS.has(i.product_id));
    if (purchased.length === 0) {
      return res.status(400).json({ ok: false, error: { message: 'No matching product in receipt' } });
    }

    // Response shape expected by cordova-plugin-purchase's validator.
    return res.json({
      ok: true,
      data: {
        collection: purchased.map((i) => ({
          id: i.product_id,
          type: 'consumable',
          transactionId: i.transaction_id,
          purchaseDate: Number(i.purchase_date_ms) || undefined
        }))
      }
    });
  } catch (err) {
    console.error('[IAP] verify error:', err);
    return res.status(500).json({ ok: false, error: { message: 'Verification failed' } });
  }
});

export default router;
