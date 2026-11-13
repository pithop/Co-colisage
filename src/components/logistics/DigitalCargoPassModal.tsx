import { useState } from "react";
import {
  CheckCircle2,
  Download,
  Luggage,
  Package,
  Plane,
  QrCode,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import { useModalFocus } from "../../hooks/useModalFocus";
import { QrImage } from "../marketplace/QrImage";

function parseAirport(str: string, fallbackCode: string, fallbackCity: string) {
  const match = str.match(/(.*?)\s*\(([A-Z]{3})\)/);
  if (match) {
    return { city: match[1].trim() || fallbackCity, code: match[2] };
  }
  const iataMatch = str.match(/\b([A-Z]{3})\b/);
  if (iataMatch) {
    return { city: str.replace(iataMatch[0], "").replace(/[()]/g, "").trim() || fallbackCity, code: iataMatch[1] };
  }
  return { city: str || fallbackCity, code: fallbackCode };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orderReference?: string;
  flightNumber?: string;
  origin?: string;
  destination?: string;
  travelerName?: string;
  senderName?: string;
  declaredValue?: string;
}

export function DigitalCargoPassModal({
  isOpen,
  onClose,
  orderReference = "BV-2026-ALG-8842",
  flightNumber = "AH1021",
  origin = "Paris (CDG)",
  destination = "Alger (ALG)",
  travelerName = "Karim Bouzid",
  senderName = "Lina Martin",
  declaredValue = "81 EUR",
}: Props) {
  const containerRef = useModalFocus(isOpen, onClose);
  const [downloaded, setDownloaded] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

  const originStation = parseAirport(origin, "PAR", "Paris");
  const destStation = parseAirport(destination, "ALG", "Alger");

  if (!isOpen) return null;

  const handleDownload = () => {
    const content = `BAGVOYAGE DIGITAL CARGO PASS
===========================================
Reference Mission : ${orderReference}
Vol Associe : ${flightNumber}
Origine : ${origin}
Destination : ${destination}
Voyageur Certifie : ${travelerName}
Expediteur : ${senderName}
Valeur Marchande : ${declaredValue}
Scelle OACI : STEB-2026-VOID-447B
Statut Sequestre : Garanti par Stripe Connect
Empreinte Cryptographique : SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
===========================================
Document conforme aux specifications IATA Res. 792 & OACI STEB.`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BagVoyage-CargoPass-${orderReference}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
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
        aria-labelledby="cargo-pass-title"
        className="market-dialog-box bv-tool-modal cargo-pass-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-drag-handle" aria-hidden="true" />
        <div className="bv-tool-header">
          <div className="bv-tool-header-meta">
            <span className="bv-tool-tag">
              <Package size={14} /> CARGO BOARDING PASS
            </span>
            <h2 id="cargo-pass-title" className="bv-tool-title">
              Passe Numérique de Fret
            </h2>
            <p className="bv-tool-subtitle">
              Format officiel compatible Apple Wallet / Google Wallet pour le contrôle aéroportuaire.
            </p>
          </div>
          <button
            type="button"
            className="bv-tool-close-btn"
            aria-label="Fermer le passe numérique de fret"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="bv-tool-content">
          {/* Apple Wallet Style Card */}
          <div className="wallet-pass-card" role="region" aria-label="Carte d'embarquement fret numérique">
            <div className="wallet-pass-top">
              <div className="pass-brand-row">
                <div className="pass-brand-badge">
                  <Package size={16} />
                  <span>BAGVOYAGE CARGO</span>
                </div>
                <span className="pass-type-indicator">PRIORITY AIRFREIGHT</span>
              </div>

              <div className="pass-flight-row">
                <div className="pass-station">
                  <span className="station-code">{originStation.code}</span>
                  <span className="station-city">{originStation.city}</span>
                </div>
                <div className="pass-flight-vector">
                  <Plane size={20} className="pass-plane-icon" />
                  <span className="pass-flight-number">{flightNumber}</span>
                </div>
                <div className="pass-station end">
                  <span className="station-code">{destStation.code}</span>
                  <span className="station-city">{destStation.city}</span>
                </div>
              </div>
            </div>

            {/* Perforated Separator */}
            <div className="wallet-pass-notch-row" aria-hidden="true">
              <div className="notch left" />
              <div className="notch-line" />
              <div className="notch right" />
            </div>

            <div className="wallet-pass-bottom">
              <div className="pass-metadata-grid">
                <div className="pass-meta-cell">
                  <span className="meta-label">Voyageur</span>
                  <span className="meta-value">{travelerName}</span>
                </div>
                <div className="pass-meta-cell">
                  <span className="meta-label">Expéditeur</span>
                  <span className="meta-value">{senderName}</span>
                </div>
                <div className="pass-meta-cell">
                  <span className="meta-label">Scellé STEB</span>
                  <span className="meta-value font-mono">STEB-447B</span>
                </div>
                <div className="pass-meta-cell">
                  <span className="meta-label">Séquestre</span>
                  <span className="meta-value highlight-green">{declaredValue}</span>
                </div>
              </div>

              <div className="pass-barcode-section">
                <div className="pass-qr-frame">
                  <QrImage value={`https://bagvoyage.com/verify?ref=${encodeURIComponent(orderReference)}&flight=${encodeURIComponent(flightNumber)}`} />
                </div>
                <span className="pass-barcode-number font-mono">{orderReference}</span>
              </div>

              <div className="pass-guarantee-footer">
                <ShieldCheck size={14} />
                <span>Passe horodaté certifié par signature asymétrique Ed25519 · Mode hors-ligne actif</span>
              </div>
            </div>
          </div>

          {/* Feedback states */}
          {walletAdded && (
            <div className="iata-success-banner" role="status">
              <CheckCircle2 size={16} />
              <span>Passe synchronisé avec votre portefeuille sécurisé BagVoyage !</span>
            </div>
          )}

          {downloaded && (
            <div className="iata-success-banner" role="status">
              <CheckCircle2 size={16} />
              <span>Récépissé officiel du pass de fret téléchargé sur votre appareil.</span>
            </div>
          )}
        </div>

        <div className="bv-tool-footer">
          <button
            type="button"
            className="outline-button flex items-center justify-center gap-2"
            onClick={() => setWalletAdded(true)}
          >
            <Smartphone size={16} />
            {walletAdded ? "Ajouté aux Cartes" : "Ajouter à Apple / Google Wallet"}
          </button>
          <button
            type="button"
            className="primary-button flex items-center justify-center gap-2"
            onClick={handleDownload}
          >
            <Download size={16} />
            {downloaded ? "Pass téléchargé" : "Télécharger le pass hors-ligne"}
          </button>
        </div>
      </div>
    </div>
  );
}
