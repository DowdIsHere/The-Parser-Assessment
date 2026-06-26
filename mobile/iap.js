// ParserIAP — Apple In-App Purchase layer for the iOS build.
// ---------------------------------------------------------------------------
// Apple requires digital goods (the paid Parser Profile report) to be sold via
// In-App Purchase, NOT Stripe. This module wraps `cordova-plugin-purchase`
// (StoreKit) and exposes a tiny promise-based API. On web / Android it stays
// inert so the existing Stripe flow is untouched.
//
// Integration (see MOBILE.md for the full hook):
//   if (ParserIAP.isAvailable()) {
//       await ParserIAP.init();
//       // show a native "Unlock — $X" button instead of the Stripe card form
//       await ParserIAP.purchase();   // resolves only after server-verified
//       unlockFullReport();           // the app's existing success callback
//   }
//
// Loaded as: <script src="iap.js"></script> (after the cordova-plugin-purchase
// runtime is present in the Capacitor build).
// ---------------------------------------------------------------------------

(function (global) {
  'use strict';

  // The App Store Connect product. The report is a one-time unlock per
  // assessment, so a CONSUMABLE fits (a user can buy a report for each result).
  var PRODUCT_ID = 'parser_profile_full_report';

  // Your server-side receipt validator (see mobile/server-iap-verify.mjs).
  // Replace with your deployed Railway origin.
  var VALIDATOR_URL =
    'https://REPLACE-WITH-YOUR-RAILWAY-DOMAIN.up.railway.app/api/iap/verify';

  function inCapacitorIOS() {
    return !!(global.Capacitor &&
      typeof global.Capacitor.getPlatform === 'function' &&
      global.Capacitor.getPlatform() === 'ios');
  }

  function store() {
    return global.CdvPurchase ? global.CdvPurchase.store : null;
  }

  var initialized = false;
  var pending = null; // { resolve, reject } for an in-flight purchase

  var ParserIAP = {
    PRODUCT_ID: PRODUCT_ID,

    // True only inside the native iOS app with the plugin loaded.
    isAvailable: function () {
      return inCapacitorIOS() && !!store();
    },

    // Register the product, wire the verification lifecycle, and start StoreKit.
    init: function () {
      if (!this.isAvailable()) return Promise.resolve(false);
      if (initialized) return Promise.resolve(true);

      var CdvPurchase = global.CdvPurchase;
      var s = store();

      s.register([{
        id: PRODUCT_ID,
        type: CdvPurchase.ProductType.CONSUMABLE,
        platform: CdvPurchase.Platform.APPLE_APPSTORE
      }]);

      // Server-side receipt validation (Apple verifyReceipt / App Store Server API).
      s.validator = VALIDATOR_URL;

      s.when()
        .approved(function (transaction) { transaction.verify(); })
        .verified(function (receipt) { receipt.finish(); })
        .finished(function (transaction) {
          if (transaction.products.some(function (p) { return p.id === PRODUCT_ID; })) {
            if (pending) { pending.resolve(transaction); pending = null; }
          }
        });

      s.error(function (err) {
        // 6777003 = purchase cancelled by user; surface as a soft rejection.
        if (pending) { pending.reject(err); pending = null; }
      });

      return s.initialize([CdvPurchase.Platform.APPLE_APPSTORE]).then(function () {
        initialized = true;
        return true;
      });
    },

    // Localized price string for the native unlock button (e.g. "$4.99").
    priceString: function () {
      if (!this.isAvailable()) return null;
      var product = store().get(PRODUCT_ID, global.CdvPurchase.Platform.APPLE_APPSTORE);
      var offer = product && product.getOffer();
      return offer && offer.pricingPhases[0] ? offer.pricingPhases[0].price : null;
    },

    // Order the product. Resolves AFTER the receipt is server-verified and the
    // transaction is finished; rejects on error or user cancellation.
    purchase: function () {
      var self = this;
      if (!this.isAvailable()) {
        return Promise.reject(new Error('IAP unavailable on this platform'));
      }
      return this.init().then(function () {
        return new Promise(function (resolve, reject) {
          pending = { resolve: resolve, reject: reject };
          var product = store().get(PRODUCT_ID, global.CdvPurchase.Platform.APPLE_APPSTORE);
          var offer = product && product.getOffer();
          if (!offer) { pending = null; return reject(new Error('Product not loaded from App Store')); }
          offer.order().then(function (err) {
            if (err) { pending = null; reject(err); }
          });
        });
      });
    },

    // App Store requires a visible "Restore Purchases" affordance.
    restore: function () {
      if (!this.isAvailable()) return Promise.resolve();
      return store().restorePurchases();
    }
  };

  global.ParserIAP = ParserIAP;
})(typeof window !== 'undefined' ? window : this);
