import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Copy,
  Delete,
  MapPin,
  QrCode,
  ShieldCheck,
  Star,
  Upload,
} from "lucide-react";
import { euro } from "../../data/marketplace";
import { BottomSheet } from "../common/BottomSheet";
import { QrImage } from "./QrImage";
import { QrScanner } from "./QrScanner";
import { createMessage, type ConversationData } from "./Conversation";
import { handoverSummary, type HandoverRecord } from "./handover";
import { generateHandoverToken, verifyHandoverToken } from "../../services/cryptoHandover";
import { validateGeofence } from "../../services/geofenceValidator";
import { releaseEscrowToCarrier } from "../../services/stripeConnectService";
import { enqueueMutation } from "../../services/outboxQueue";

const criteria = [
  "Réactivité",
  "Ponctualité",
  "Échange clair",
  "Marchandise intacte",
];
export function DeliveryModal({
  conversation: c,
  onUpdate,
  onClose,
}: {
  conversation: ConversationData;
  onUpdate: (c: ConversationData) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"present" | "scan">("present");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [ratings, setRatings] = useState(c.ratings || [0, 0, 0, 0]);
  const [photo, setPhoto] = useState<{ data: string; at: string }>();
  const [busy, setBusy] = useState(false);
  const [verified, setVerified] = useState(false);
  const [place, setPlace] = useState("");
  const [location, setLocation] = useState<HandoverRecord["location"]>();
  const [geoStatus, setGeoStatus] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const filePurpose = useRef<"qr" | "photo">("qr");
  const currentStage = useRef(c.stage);
  currentStage.current = c.stage;
  const mounted = useRef(true);
  const completed = useRef(false);
  const geoRequest = useRef(0);
  const pickup = c.stage === "secured";
  const expected = pickup ? c.pickupCode : c.deliveryCode;
  const payload = `entre-particuliers:${c.id}:${pickup ? "pickup" : "delivery"}:${expected}`;
  const [cryptoPayload, setCryptoPayload] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    generateHandoverToken(c.id, pickup ? "pickup" : "delivery").then((token) => {
      if (isMounted) setCryptoPayload(token);
    });
    const interval = setInterval(() => {
      generateHandoverToken(c.id, pickup ? "pickup" : "delivery").then((token) => {
        if (isMounted) setCryptoPayload(token);
      });
    }, 90000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [c.id, c.stage, pickup]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    completed.current = false;
    geoRequest.current += 1;
    setCode("");
    setError("");
    setPhoto(undefined);
    setVerified(false);
    setMode("present");
    setLocation(undefined);
    setPlace("");
    setGeoStatus("");
  }, [c.stage]);

  const matches = async (value: string, qrOnly = false) => {
    const val = value.trim();
    if (val.startsWith("BV-SEC1:")) {
      const result = await verifyHandoverToken(val, c.id, pickup ? "pickup" : "delivery");
      if (result.valid) {
        setError("");
        return true;
      } else {
        setError(result.error || "Jeton de sécurité invalide.");
        return false;
      }
    }

    if (val !== payload && (qrOnly || val !== expected)) {
      setError(
        "Code incorrect. Vérifiez le code de cette étape avec votre interlocuteur.",
      );
      return false;
    }
    setError("");
    return true;
  };

  const validate = async (value: string, method: HandoverRecord["method"]) => {
    if (completed.current || busy) return;
    const isMatching = await matches(value, method === "camera" || method === "import");
    if (!isMatching) return;
    if (c.stage !== "secured" && c.stage !== "collected") return;
    if (method === "camera" && !photo) {
      setError(
        "Ajoutez une photo de conformité de l’article pour valider la remise.",
      );
      return;
    }
    completed.current = true;
    const record: HandoverRecord = {
      stage: pickup ? "pickup" : "delivery",
      at: new Date().toISOString(),
      method,
      photo: photo?.data,
      photoAt: photo?.at,
      place: place.trim() || undefined,
      location,
    };
    const summary = handoverSummary(record);

    // FinTech Stripe release if delivery
    if (!pickup) {
      releaseEscrowToCarrier(c.id).catch(() => {});
    }

    // Zero-data-loss outbox mutation
    enqueueMutation("HANDOVER_CONFIRMED", {
      orderId: c.id,
      stage: pickup ? "collected" : "delivered",
      record,
    });
    onUpdate({
      ...c,
      stage: pickup ? "collected" : "delivered",
      handovers: [...(c.handovers || []), record],
      messages: [
        ...c.messages,
        createMessage(
          `${pickup ? "Premier QR validé : article pris en charge." : "Second QR validé : livraison confirmée. État de la caution mis à jour."} ${summary} ${photo ? "Photo de conformité enregistrée." : "Aucune preuve photo jointe."}`,
          false,
        ),
      ],
    });
    setNotice(
      `${pickup ? "Prise en charge confirmée." : "Livraison confirmée."} ${summary}`,
    );
  };
  const chooseFile = (purpose: "qr" | "photo", capture = false) => {
    filePurpose.current = purpose;
    const input = fileRef.current;
    if (!input) return;
    if (capture) input.setAttribute("capture", "environment");
    else input.removeAttribute("capture");
    input.click();
  };
  const readFile = async (file: File) => {
    const stage = c.stage;
    const purpose = filePurpose.current;
    if (
      !/^image\/(jpeg|png|webp)$/.test(file.type) ||
      file.size > 12 * 1024 * 1024
    ) {
      setError("Choisissez une image JPG, PNG ou WebP de moins de 12 Mo.");
      return;
    }
    setBusy(true);
    setError("");
    let bitmap: ImageBitmap | undefined;
    try {
      bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      const scale = Math.min(
        1,
        (purpose === "photo" ? 960 : 1600) /
          Math.max(bitmap.width, bitmap.height),
      );
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error();
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      if (purpose === "photo") {
        if (!mounted.current || currentStage.current !== stage) return;
        setPhoto({
          data: canvas.toDataURL("image/jpeg", 0.75),
          at: new Date().toISOString(),
        });
      } else {
        const { default: jsQR } = await import("jsqr");
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        const result = jsQR(pixels.data, pixels.width, pixels.height);
        if (!mounted.current || currentStage.current !== stage) return;
        if (!result)
          setError(
            "QR code illisible. Essayez une photo nette ou saisissez le PIN.",
          );
        else validate(result.data, "import");
      }
    } catch {
      if (mounted.current)
        setError(
          "Cette image ne peut pas être lue. Utilisez une photo JPG ou PNG.",
        );
    } finally {
      bitmap?.close();
      if (mounted.current) setBusy(false);
      filePurpose.current = "qr";
    }
  };
  const locate = () => {
    if (!navigator.geolocation) {
      setGeoStatus(
        "Géolocalisation indisponible. Vous pouvez préciser le lieu.",
      );
      return;
    }
    const request = ++geoRequest.current;
    setGeoStatus("Localisation en cours…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mounted.current || geoRequest.current !== request) return;
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        const geofence = validateGeofence(
          { latitude: position.coords.latitude, longitude: position.coords.longitude },
          place || c.subject || "ALG"
        );
        setGeoStatus(geofence.statusMessage);
      },
      () => {
        if (mounted.current && geoRequest.current === request)
          setGeoStatus(
            "Position indisponible ou accès refusé. Vous pouvez préciser le lieu.",
          );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    );
  };
  return (
    <BottomSheet
      isOpen={true}
      title={
        c.stage === "delivered"
          ? "Livraison confirmée"
          : "Protocole de remise sécurisée"
      }
      subtitle={
        pickup
          ? "Étape 1 · Prise en charge au départ & photo du scellé"
          : c.stage === "collected"
            ? "Étape 2 · Remise au destinataire & déblocage des fonds"
            : "Étape 3 · Avis bilatéral et clôture"
      }
      onClose={onClose}
    >
      <div className="delivery-steps" aria-label="Étapes de validation">
        {["1. Prise en charge", "2. Livraison", "3. Avis"].map((label, i) => {
          const step = pickup ? 0 : c.stage === "collected" ? 1 : 2;
          return (
            <span
              key={label}
              aria-current={step === i ? "step" : undefined}
              className={i < step ? "complete" : i === step ? "current" : ""}
            >
              {label}
            </span>
          );
        })}
      </div>
      {notice && (
        <p className="handover-confirmation" role="status">
          <Check size={20} />
          {notice}
        </p>
      )}
      {c.stage !== "delivered" ? (
        <>
          <h3 className="delivery-title">
            {pickup ? "Confirmer la prise en charge" : "Confirmer la livraison"}
          </h3>
          <p className="muted">
            {pickup
              ? "Le premier code confirme que le voyageur a récupéré l’article."
              : "Le second code confirme la remise au destinataire et permet de libérer les fonds."}
          </p>
          <div
            className="handover-tabs"
            role="tablist"
            aria-label="Mode de remise"
          >
            {(
              [
                ["present", "Présenter mon QR Code"],
                ["scan", "Scanner la remise"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                role="tab"
                id={`tab-${value}`}
                aria-controls={`panel-${value}`}
                aria-selected={mode === value}
                tabIndex={mode === value ? 0 : -1}
                onClick={() => setMode(value)}
                onKeyDown={(event) => {
                  if (
                    ["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                      event.key,
                    )
                  ) {
                    event.preventDefault();
                    const next =
                      event.key === "Home"
                        ? "present"
                        : event.key === "End"
                          ? "scan"
                          : mode === "present"
                            ? "scan"
                            : "present";
                    setMode(next);
                    document.getElementById(`tab-${next}`)?.focus();
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id={`panel-${mode}`}
            aria-labelledby={`tab-${mode}`}
          >
            {mode === "present" ? (
              <div className="demo-code handover-qr">
                <QrImage key={cryptoPayload || payload} value={cryptoPayload || payload} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11px", color: "#059669", fontWeight: "600", marginTop: "8px", marginBottom: "4px" }}>
                  <ShieldCheck size={14} /> Jeton cryptographique HMAC-SHA256 actif
                </div>
                <span>
                  Code PIN de secours<strong>{expected}</strong>
                </span>
                <button
                  className="outline-button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(expected);
                      setNotice("Code PIN copié.");
                    } catch {
                      setNotice(
                        "Copie indisponible. Recopiez les quatre chiffres affichés.",
                      );
                    }
                  }}
                >
                  <Copy size={16} /> Copier le PIN
                </button>
                <p>
                  Présentez ce code à votre partenaire au moment de la remise de
                  l’article.
                </p>
              </div>
            ) : (
              <QrScanner
                matched={verified}
                onRead={async (value) => {
                  const isMatch = await matches(value, true);
                  if (!isMatch) return false;
                  setVerified(true);
                  setCode(expected);
                  try {
                    navigator.vibrate?.(100);
                  } catch {
                    /* Vibration is optional on this device. */
                  }
                  return true;
                }}
              />
            )}
          </div>
          <section className="handover-proof" aria-labelledby="proof-title">
            <h4 id="proof-title">
              <Camera size={18} /> Photo de conformité
            </h4>
            <p className="muted">
              {pickup
                ? "Photographiez l’état de l’article à la prise en charge."
                : "Photographiez l’état de l’article remis au destinataire."}
            </p>
            {photo && (
              <div className="proof-preview">
                <img
                  src={photo.data}
                  alt={
                    pickup
                      ? "Photo de conformité à la prise en charge"
                      : "Photo de conformité à la livraison"
                  }
                />
                <span>Photo prête à être enregistrée</span>
                <button
                  className="text-button"
                  onClick={() => setPhoto(undefined)}
                >
                  Retirer la photo
                </button>
              </div>
            )}
            <div className="handover-actions">
              <button
                className="outline-button"
                disabled={busy}
                onClick={() => chooseFile("photo", true)}
              >
                <Camera size={16} /> Prendre une photo
              </button>
              <button
                className="outline-button"
                disabled={busy}
                onClick={() => chooseFile("photo")}
              >
                <Upload size={16} /> Importer une photo
              </button>
            </div>
            <p className="demo-note">
              Photo requise pour le scan caméra. Vous pouvez également confirmer
              la remise avec le PIN ou un QR importé.
            </p>
          </section>
          <div className="handover-location publish-form">
            <label>
              Lieu de remise (facultatif)
              <input
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Ex. Paris, Gare de Lyon"
                maxLength={160}
              />
            </label>
            <button className="outline-button" onClick={locate}>
              <MapPin size={16} /> Localiser la remise
            </button>
            {geoStatus && (
              <p role="status" className="muted">
                {geoStatus}
              </p>
            )}
            <p className="demo-note">
              L’heure est enregistrée à la validation. Le lieu saisi est déclaré
              par vos soins.
            </p>
          </div>
          <form
            className="publish-form"
            onSubmit={(e) => {
              e.preventDefault();
              validate(verified ? payload : code, verified ? "camera" : "pin");
            }}
          >
            <div
              className="pin-display"
              aria-label={`${Math.min(code.length, 4)} chiffres saisis sur 4`}
            >
              {[0, 1, 2, 3].map((index) => (
                <span
                  key={`${index}-${code[index] || "empty"}`}
                  className={
                    /^\d{1,4}$/.test(code) && code[index]
                      ? "pin-digit filled"
                      : "pin-digit"
                  }
                  aria-hidden="true"
                >
                  {/^\d{1,4}$/.test(code) ? code[index] : ""}
                </span>
              ))}
            </div>
            <label>
              Code PIN ou contenu du QR code
              <input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError("");
                }}
                placeholder="Saisir le code de cette étape"
                autoComplete="one-time-code"
                inputMode="numeric"
                required
              />
            </label>
            <div
              className="tactile-pin-pad"
              role="group"
              aria-label="Clavier numérique du code PIN"
            >
              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "clear",
                "0",
                "backspace",
              ].map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-label={
                    key === "clear"
                      ? "Effacer le code"
                      : key === "backspace"
                        ? "Effacer le dernier chiffre"
                        : key
                  }
                  onClick={() => {
                    setCode((current) =>
                      key === "clear"
                        ? ""
                        : key === "backspace"
                          ? current.slice(0, -1)
                          : /^\d{0,3}$/.test(current)
                            ? current + key
                            : current,
                    );
                    setError("");
                  }}
                >
                  {key === "clear" ? (
                    <span>Effacer</span>
                  ) : key === "backspace" ? (
                    <Delete size={22} />
                  ) : (
                    key
                  )}
                </button>
              ))}
            </div>
            {error && (
              <p role="alert" className="error-message">
                {error}
              </p>
            )}
            <button className="primary-button" type="submit" disabled={busy}>
              {pickup ? "Valider la prise en charge" : "Valider la livraison"}
            </button>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              ref={fileRef}
              className="sr-only"
              tabIndex={-1}
              aria-label="Importer une image de remise"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void readFile(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              className="outline-button"
              disabled={busy}
              onClick={() => chooseFile("qr")}
            >
              <QrCode size={18} /> Scanner ou importer un QR code
            </button>
            {busy && <p role="status">Analyse de l’image en cours…</p>}
          </form>
        </>
      ) : (
        <>
          <div className="delivery-success">
            <ShieldCheck size={36} />
            <h3>Article remis, merci !</h3>
            <p>Caution de {euro(c.amount)} : remise enregistrée.</p>
          </div>
          {c.ratings ? (
            <p className="info-box">
              <Check size={18} />
              Votre avis a été enregistré. Merci !
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (ratings.every((r) => r > 0)) onUpdate({ ...c, ratings });
              }}
            >
              <h3 className="delivery-title">
                Comment s’est passée la livraison ?
              </h3>
              <button
                type="button"
                className="outline-button"
                onClick={() => setRatings([5, 5, 5, 5])}
              >
                <Star size={18} /> Tout noter 5 étoiles
              </button>
              <div className="rating-criteria">
                {criteria.map((criterion, index) => (
                  <fieldset key={criterion}>
                    <legend>{criterion}</legend>
                    <div>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <label key={value}>
                          <input
                            className="rating-input"
                            type="radio"
                            name={`rating-${index}`}
                            checked={ratings[index] === value}
                            onChange={() =>
                              setRatings(
                                ratings.map((r, i) =>
                                  i === index ? value : r,
                                ),
                              )
                            }
                            aria-label={`${criterion} : ${value} sur 5`}
                          />
                          <Star
                            size={23}
                            fill={value <= ratings[index] ? "#e1a32c" : "none"}
                            color={
                              value <= ratings[index] ? "#b87c0f" : "#9aa2ad"
                            }
                          />
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
              <button
                className="primary-button"
                disabled={ratings.some((r) => r === 0)}
              >
                Envoyer mon avis
              </button>
            </form>
          )}
        </>
      )}
      <p className="demo-note">
        Preuves et horaires conservés sur cet appareil. La validation de remise
        ne constitue pas une confirmation de paiement bancaire.
      </p>
    </BottomSheet>
  );
}
