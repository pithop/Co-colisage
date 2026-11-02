import { useState } from "react";
import {
  CheckCircle2,
  KeyRound,
  QrCode,
  Scan,
  ShieldCheck,
  WifiOff,
  X,
  FileCheck2,
} from "lucide-react";
import { useModalFocus } from "../../hooks/useModalFocus";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orderReference?: string;
  travelerName?: string;
  recipientName?: string;
}

export function OfflineHandoverModal({
  isOpen,
  onClose,
  orderReference = "BV-2026-ALG-8842",
  travelerName = "Karim Bouzid",
  recipientName = "Amina Kaci",
}: Props) {
  const containerRef = useModalFocus(isOpen, onClose);
  const [activeRole, setActiveRole] = useState<"recipient" | "traveler">("recipient");
  const [pinInput, setPinInput] = useState("");
  const [stebChecked, setStebChecked] = useState(false);
  const [completed, setCompleted] = useState(false);
  const expectedPin = "4829";

  if (!isOpen) return null;

  const handleValidate = () => {
    if (pinInput !== expectedPin || !stebChecked) return;
    setCompleted(true);
  };

  return (
    <div
      className="market-dialog-backdrop modal-overlay-blur"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="offline-handover-title"
        className="market-dialog-box bv-tool-modal offline-handover-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bv-tool-header">
          <div className="bv-tool-header-meta">
            <span className="bv-tool-tag offline-tag">
              <WifiOff size={14} /> ZONE BLANCHE AÉROPORTUAIRE (OFFLINE-FIRST)
            </span>
            <h2 id="offline-handover-title" className="bv-tool-title">
              Remise Hors-Ligne & Signature Cryptographique
            </h2>
            <p className="bv-tool-subtitle">
              Validation contradictoire par clés asymétriques Ed25519 en zone de rupture réseau.
            </p>
          </div>
          <button
            type="button"
            className="bv-tool-close-btn"
            aria-label="Fermer le protocole de remise hors-ligne"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="bv-tool-content">
          {/* Role Switcher */}
          <div className="handover-role-switch" role="tablist" aria-label="Perspective d'échange">
            <button
              type="button"
              role="tab"
              aria-selected={activeRole === "recipient"}
              className={`role-tab-btn ${activeRole === "recipient" ? "active" : ""}`}
              onClick={() => setActiveRole("recipient")}
            >
              Destinataire (Présenter le QR)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeRole === "traveler"}
              className={`role-tab-btn ${activeRole === "traveler" ? "active" : ""}`}
              onClick={() => setActiveRole("traveler")}
            >
              Voyageur (Scanner et valider)
            </button>
          </div>

          {activeRole === "recipient" ? (
            <div className="handover-panel-recipient" role="tabpanel" aria-label="Écran Destinataire">
              <div className="qr-certificate-card">
                <div className="qr-certificate-frame">
                  <div className="mock-dynamic-qr" aria-label="QR code signé cryptographiquement">
                    <QrCode size={160} />
                  </div>
                  <span className="qr-nonce font-mono">NONCE: 0x8F2A9C4B7E</span>
                </div>
                <div className="qr-info-column">
                  <span className="qr-badge-status">CERTIFICAT RÉCEPTIONNÉ CONFORME</span>
                  <p className="qr-explanation">
                    Ce QR code contient votre certificat de remise signé localement par votre clé privée. Présentez-le à {travelerName}.
                  </p>
                  <div className="pin-highlight-box">
                    <span className="pin-label">Code PIN oral à transmettre :</span>
                    <span className="pin-digits font-mono">{expectedPin}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="handover-panel-traveler" role="tabpanel" aria-label="Écran Voyageur">
              <div className="traveler-validation-form">
                <div className="scanner-status-box">
                  <Scan size={18} />
                  <span>QR code de {recipientName} détecté et vérifié cryptographiquement.</span>
                </div>

                <div className="form-group">
                  <label className="input-label" htmlFor="traveler-pin-input">
                    Saisir le code PIN oral à 4 chiffres donné par {recipientName}
                  </label>
                  <input
                    id="traveler-pin-input"
                    type="text"
                    maxLength={4}
                    placeholder="Ex: 4829"
                    className="pin-input-field font-mono"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                  />
                  {pinInput && pinInput !== expectedPin && (
                    <span className="input-feedback error">Code PIN non valide (attendu pour démo : {expectedPin})</span>
                  )}
                </div>

                <label className="checkbox-row-styled">
                  <input
                    type="checkbox"
                    checked={stebChecked}
                    onChange={(e) => setStebChecked(e.target.checked)}
                  />
                  <span>
                    Je confirme que le scellé physique STEB-447B est parfaitement intact et n’affiche aucune mention VOID.
                  </span>
                </label>
              </div>
            </div>
          )}

          {completed && (
            <div className="handover-success-card" role="status">
              <CheckCircle2 size={20} className="success-icon" />
              <div>
                <h4>Remise hors-ligne enregistrée avec succès !</h4>
                <p>
                  Signatures asymétriques Ed25519 validées en local. Le paquet d'authentification croisée est consigné dans la file IndexedDB et sera automatiquement synchronisé avec Stripe Connect dès reconnexion au réseau pour déblocage des 81 EUR.
                </p>
              </div>
            </div>
          )}

          <div className="offline-security-banner">
            <ShieldCheck size={16} />
            <span>
              Protocole anti-rejeu par Nonce unique et horodatage cryptographique conforme au standard RFC 8032.
            </span>
          </div>
        </div>

        <div className="bv-tool-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Fermer
          </button>
          {activeRole === "traveler" && (
            <button
              type="button"
              className="btn-primary"
              disabled={pinInput !== expectedPin || !stebChecked || completed}
              onClick={handleValidate}
            >
              <FileCheck2 size={16} />
              {completed ? "Remise confirmée" : "Signer et valider la remise"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
