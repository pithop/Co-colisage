import { useState } from "react";
import {
  Camera,
  CheckCircle2,
  FileText,
  Luggage,
  Plane,
  QrCode,
  Scan,
  ShieldCheck,
  Sparkles,
  Ticket,
  X,
} from "lucide-react";
import { useModalFocus } from "../../hooks/useModalFocus";
import {
  parseIataBcbp,
  SAMPLE_BOARDING_PASSES,
  type ParsedBoardingPass,
} from "../../services/iataBcbpParser";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onFlightImported?: (flight: ParsedBoardingPass) => void;
}

export function BoardingPassScannerModal({
  isOpen,
  onClose,
  onFlightImported,
}: Props) {
  const containerRef = useModalFocus(isOpen, onClose);
  const [barcodeInput, setBarcodeInput] = useState(SAMPLE_BOARDING_PASSES[0].raw);
  const [parsed, setParsed] = useState<ParsedBoardingPass | null>(() =>
    parseIataBcbp(SAMPLE_BOARDING_PASSES[0].raw)
  );
  const [cameraActive, setCameraActive] = useState(false);
  const [imported, setImported] = useState(false);

  if (!isOpen) return null;

  const handleParse = (raw: string) => {
    setBarcodeInput(raw);
    const result = parseIataBcbp(raw);
    setParsed(result);
    setImported(false);
  };

  const handleImport = () => {
    if (!parsed || !parsed.isValid) return;
    setImported(true);
    if (onFlightImported) {
      onFlightImported(parsed);
    }
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
        aria-labelledby="iata-scanner-title"
        className="market-dialog-box bv-tool-modal iata-scanner-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bv-tool-header">
          <div className="bv-tool-header-meta">
            <span className="bv-tool-tag">
              <Scan size={14} /> IATA RESOLUTION 792 (BCBP)
            </span>
            <h2 id="iata-scanner-title" className="bv-tool-title">
              Scanner de Carte d’Embarquement
            </h2>
            <p className="bv-tool-subtitle">
              Validation automatique de vol, franchise bagage et PNR voyageur par code-barres 2D.
            </p>
          </div>
          <button
            type="button"
            className="bv-tool-close-btn"
            aria-label="Fermer le scanner de carte d’embarquement"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="bv-tool-content">
          {/* Mode Caméra / Simulation */}
          <div className="iata-scanner-viewfinder-card">
            <div className="iata-viewfinder-header">
              <span className="iata-viewfinder-status">
                <span className={`status-dot ${cameraActive ? "dot-active" : "dot-idle"}`} />
                {cameraActive ? "Capteur vidéo actif (Recherche de code PDF417 / Aztec)" : "Viseur de numérisation"}
              </span>
              <button
                type="button"
                className="btn-text-action"
                onClick={() => setCameraActive(!cameraActive)}
              >
                <Camera size={15} />
                {cameraActive ? "Désactiver la caméra" : "Activer la caméra"}
              </button>
            </div>

            <div className={`iata-viewfinder-screen ${cameraActive ? "camera-live" : ""}`}>
              <div className="viewfinder-frame">
                <div className="viewfinder-corner top-left" />
                <div className="viewfinder-corner top-right" />
                <div className="viewfinder-corner bottom-left" />
                <div className="viewfinder-corner bottom-right" />
                <div className="viewfinder-laser-line" />
                <div className="viewfinder-instruction">
                  <QrCode size={28} className="viewfinder-instruction-icon" />
                  <p>Alignez le code-barres PDF417 de votre carte papier ou écran mobile</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sélecteur de billets prédéfinis certifiés */}
          <div className="iata-presets-section">
            <label className="input-label" htmlFor="iata-preset-select">
              Ou charger un vol international certifié (démonstrateur)
            </label>
            <div className="iata-preset-buttons">
              {SAMPLE_BOARDING_PASSES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`preset-flight-pill ${barcodeInput === sample.raw ? "active" : ""}`}
                  onClick={() => handleParse(sample.raw)}
                >
                  <Plane size={13} />
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Saisie manuelle de chaîne brute IATA */}
          <div className="form-group">
            <label className="input-label" htmlFor="iata-raw-input">
              Données brutes de la carte (format standardisé IATA BCBP)
            </label>
            <textarea
              id="iata-raw-input"
              rows={2}
              className="iata-raw-textarea"
              value={barcodeInput}
              onChange={(e) => handleParse(e.target.value)}
              placeholder="Collez ici la chaîne brute encodée (commençant par M1 ou S1)..."
            />
          </div>

          {/* Résultat du parsing */}
          {parsed && parsed.isValid && (
            <div className="iata-result-card" role="region" aria-label="Détails du vol analysé">
              <div className="iata-result-header">
                <div className="iata-flight-badge">
                  <Plane size={18} />
                  <span className="iata-flight-number">{parsed.flightNumber}</span>
                  <span className="iata-carrier-name">{parsed.carrier}</span>
                </div>
                <span className="iata-pnr-badge">
                  PNR : <strong>{parsed.pnr}</strong>
                </span>
              </div>

              <div className="iata-route-banner">
                <div className="route-node">
                  <span className="airport-code">{parsed.fromAirport}</span>
                  <span className="airport-tag">Départ</span>
                </div>
                <div className="route-separator-line">
                  <span className="flight-dot" />
                </div>
                <div className="route-node">
                  <span className="airport-code">{parsed.toAirport}</span>
                  <span className="airport-tag">Arrivée</span>
                </div>
              </div>

              <div className="iata-details-grid">
                <div className="iata-detail-item">
                  <span className="detail-label">Passager vérifié</span>
                  <span className="detail-value">{parsed.passengerName}</span>
                </div>
                <div className="iata-detail-item">
                  <span className="detail-label">Siège cabine</span>
                  <span className="detail-value font-mono">{parsed.seat}</span>
                </div>
                <div className="iata-detail-item">
                  <span className="detail-label">Classe de voyage</span>
                  <span className="detail-value">{parsed.cabinClass}</span>
                </div>
                <div className="iata-detail-item">
                  <span className="detail-label">Franchise bagage officielle</span>
                  <span className="detail-value highlight">
                    <Luggage size={14} /> {parsed.baggageAllowance}
                  </span>
                </div>
              </div>

              <div className="iata-compliance-note">
                <ShieldCheck size={16} />
                <span>
                  Vol vérifié conforme à la Résolution 792 de l’IATA. Détection automatique du billet électronique et éligibilité à l’arbitrage de colis immédiat.
                </span>
              </div>
            </div>
          )}

          {parsed && !parsed.isValid && (
            <div className="iata-error-banner" role="alert">
              <FileText size={16} />
              <span>{parsed.error || "Format de carte d’embarquement invalide."}</span>
            </div>
          )}

          {imported && (
            <div className="iata-success-banner" role="status">
              <CheckCircle2 size={16} />
              <span>
                Vol importé avec succès ! Les capacités de bagage ({parsed?.flightNumber}) sont enregistrées sur votre compte voyageur.
              </span>
            </div>
          )}
        </div>

        <div className="bv-tool-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Fermer
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!parsed || !parsed.isValid}
            onClick={handleImport}
          >
            <Sparkles size={16} />
            {imported ? "Vol validé et importé" : "Valider et importer le vol"}
          </button>
        </div>
      </div>
    </div>
  );
}
