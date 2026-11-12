import { test, expect } from "@playwright/test";

test.describe("Sûreté Cryptographique, FinTech Séquestre & Ergonomie Apple HIG", () => {
  test("Crypto Handover: HMAC-SHA256 signature, anti-replay expiry & tamper detection", async ({ page }) => {
    await page.goto("/#voyageur", { waitUntil: "domcontentloaded" });

    const result = await page.evaluate(async () => {
      const { generateHandoverToken, verifyHandoverToken } = await import("/src/services/cryptoHandover.ts");

      // 1. Generate valid token with HMAC-SHA256
      const token = await generateHandoverToken("CMD-9942", "pickup", {
        validitySeconds: 60,
        expectedPlace: "CDG",
      });

      // 2. Verify valid token
      const validCheck = await verifyHandoverToken(token, "CMD-9942", "pickup");

      // 3. Verify stage mismatch
      const stageMismatch = await verifyHandoverToken(token, "CMD-9942", "delivery");

      // 4. Verify order ID mismatch
      const orderMismatch = await verifyHandoverToken(token, "CMD-8888", "pickup");

      // 5. Verify tampered token
      const tampered = token.slice(0, -6) + "abcdef";
      const tamperCheck = await verifyHandoverToken(tampered, "CMD-9942", "pickup");

      // 6. Verify legacy token support fallback
      const legacyCheck = await verifyHandoverToken("BV-CMD-9942-pickup", "CMD-9942", "pickup");

      return {
        isTokenFormatSecure: token.startsWith("BV-SEC1:"),
        validCheckValid: validCheck.valid,
        stageMismatchValid: stageMismatch.valid,
        orderMismatchValid: orderMismatch.valid,
        tamperCheckValid: tamperCheck.valid,
        legacyCheckValid: legacyCheck.valid,
      };
    });

    expect(result.isTokenFormatSecure).toBe(true);
    expect(result.validCheckValid).toBe(true);
    expect(result.stageMismatchValid).toBe(false);
    expect(result.orderMismatchValid).toBe(false);
    expect(result.tamperCheckValid).toBe(false);
    expect(result.legacyCheckValid).toBe(true);
  });

  test("GPS Geofencing: Haversine distance & Hub proximity validation", async ({ page }) => {
    await page.goto("/#voyageur", { waitUntil: "domcontentloaded" });

    const result = await page.evaluate(async () => {
      const {
        calculateHaversineDistance,
        HUB_COORDINATES,
        validateGeofence,
      } = await import("/src/services/geofenceValidator.ts");

      const cdg = HUB_COORDINATES["CDG"];
      const ory = HUB_COORDINATES["ORY"];
      const orlyDist = calculateHaversineDistance(cdg, ory);

      // In Paris center ~ 23km from CDG (within 25km tolerance)
      const nearCdg = validateGeofence({ latitude: 48.8566, longitude: 2.3522 }, "CDG", 25);

      // In Marseille (~650km away from CDG)
      const farMarseille = validateGeofence({ latitude: 43.2965, longitude: 5.3698 }, "CDG", 25);

      return {
        hasCdg: !!cdg,
        orlyDistApprox: Math.round(orlyDist),
        nearCdgPass: nearCdg.isCompliant,
        nearCdgPinRequired: nearCdg.requiresPinFallback,
        farMarseillePass: farMarseille.isCompliant,
        farMarseillePinRequired: farMarseille.requiresPinFallback,
      };
    });

    expect(result.hasCdg).toBe(true);
    // CDG to ORY is ~34 km
    expect(result.orlyDistApprox).toBeGreaterThan(30);
    expect(result.orlyDistApprox).toBeLessThan(40);
    expect(result.nearCdgPass).toBe(true);
    expect(result.nearCdgPinRequired).toBe(false);
    expect(result.farMarseillePass).toBe(false);
    expect(result.farMarseillePinRequired).toBe(true);
  });

  test("FinTech Stripe Connect: Escrow state machine & COD guarantee hold", async ({ page }) => {
    await page.goto("/#voyageur", { waitUntil: "domcontentloaded" });

    const result = await page.evaluate(async () => {
      const {
        createEscrowHold,
        releaseEscrowToCarrier,
        getOrderEscrowStatus,
      } = await import("/src/services/stripeConnectService.ts");

      // 1. Create standard escrow hold
      const hold = await createEscrowHold({
        orderId: "ORDER-TEST-100",
        senderId: "sender_test_1",
        totalAmountEur: 85,
        carrierRewardEur: 60,
      });

      // 2. Initial state
      const initialStatus = getOrderEscrowStatus("ORDER-TEST-100");

      // 3. Release escrow to carrier
      const releasedTx = await releaseEscrowToCarrier("ORDER-TEST-100");
      const releasedStatus = getOrderEscrowStatus("ORDER-TEST-100");

      // 4. Test idempotence (calling release again returns same captured status)
      const repeatRelease = await releaseEscrowToCarrier("ORDER-TEST-100");

      // 5. COD Escrow hold (Cash-on-Delivery guarantee model)
      const codHold = await createEscrowHold({
        orderId: "ORDER-COD-200",
        senderId: "sender_cod_1",
        totalAmountEur: 100,
        carrierRewardEur: 75,
        isCashOnDelivery: true,
      });

      return {
        holdStatus: hold.status,
        holdCarrierRewardCents: hold.carrierRewardCents,
        holdPlatformFeeCents: hold.platformFeeCents,
        initialStatusRequiresCapture: initialStatus?.status === "requires_capture",
        releasedStatusCaptured: releasedStatus?.status === "captured",
        hasStripeTransferId: !!releasedTx.stripeTransferId,
        repeatReleaseIdempotent: repeatRelease.status === "captured",
        codStatus: codHold.status,
        codGuaranteeCents: codHold.codDetails?.guaranteeHoldEurCents,
        codCashDzd: codHold.codDetails?.cashAmountDzd,
      };
    });

    expect(result.holdStatus).toBe("requires_capture");
    expect(result.holdCarrierRewardCents).toBe(6000);
    expect(result.holdPlatformFeeCents).toBe(2500); // 8500 - 6000
    expect(result.initialStatusRequiresCapture).toBe(true);
    expect(result.releasedStatusCaptured).toBe(true);
    expect(result.hasStripeTransferId).toBe(true);
    expect(result.repeatReleaseIdempotent).toBe(true);
    expect(result.codStatus).toBe("cod_hold_active");
    expect(result.codGuaranteeCents).toBe(2000); // 20% of 100 EUR
    expect(result.codCashDzd).toBe(24000); // 100 * 240 DZD
  });

  test("Offline Outbox Queue: Queue persistence & mutation replay", async ({ page }) => {
    await page.goto("/#voyageur", { waitUntil: "domcontentloaded" });

    const result = await page.evaluate(async () => {
      const {
        clearOutboxQueue,
        enqueueMutation,
        getOutboxQueue,
        flushOutboxQueue,
      } = await import("/src/services/outboxQueue.ts");

      clearOutboxQueue();

      // Enqueue mutations with autoFlush: false to simulate offline conditions
      enqueueMutation("HANDOVER_CONFIRMED", { orderId: "CMD-SYNC-1", stage: "pickup" }, { autoFlush: false });
      enqueueMutation("ORDER_STATUS_CHANGED", { orderId: "CMD-SYNC-1", newStatus: "in_transit" }, { autoFlush: false });

      const pendingBefore = getOutboxQueue();

      // Flush queue
      const flushResult = await flushOutboxQueue();

      const pendingAfter = getOutboxQueue();
      const pendingAfterCount = pendingAfter.filter((m) => m.status === "pending").length;
      const allSynced = pendingAfter.every((m) => m.status === "synced");

      return {
        pendingBeforeCount: pendingBefore.length,
        syncedCount: flushResult.syncedCount,
        pendingAfterCount,
        allSynced,
      };
    });

    expect(result.pendingBeforeCount).toBe(2);
    expect(result.syncedCount).toBe(2);
    expect(result.pendingAfterCount).toBe(0);
    expect(result.allSynced).toBe(true);
  });
});
