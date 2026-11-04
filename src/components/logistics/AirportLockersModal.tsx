import { useEffect, useState } from "react";
import {
  Clock3,
  KeyRound,
  LockKeyhole,
  MapPin,
  PackageCheck,
  Plane,
  Ship,
} from "lucide-react";
import { Dialog } from "../marketplace/Dialog";
import type { TransportContext } from "../../services/transportDocuments";
import { airportLockers } from "../../data/logisticsPolicies";
import { logisticsNumber } from "../../services/logisticsTools";

interface LockerCode {
  code: string;
  terminalId: string;
  expiresAt: number;
  used: boolean;
}
function temporaryCode(): string {
  // Rejection sampling avoids modulo bias for the six-digit withdrawal code.
  const bytes = new Uint32Array(1);
  do {
    crypto.getRandomValues(bytes);
  } while (bytes[0] >= 4294000000);
  return String(bytes[0] % 1000000).padStart(6, "0");
}

export function AirportLockersModal({
  context,
  onClose,
}: {
  context: TransportContext;
  onClose: () => void;
}) {
  const initial =
    airportLockers.find((airport) =>
      (context.destination ?? "").toUpperCase().includes(airport.code),
    ) ?? airportLockers[0];
  const [airportCode, setAirportCode] = useState(initial.code);
  const [terminalId, setTerminalId] = useState(initial.terminals[0].id);
  const [reservation, setReservation] = useState<LockerCode>();
  const [enteredCode, setEnteredCode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const airport =
    airportLockers.find((item) => item.code === airportCode) ??
    airportLockers[0];
  const terminal =
    airport.terminals.find((item) => item.id === terminalId) ??
    airport.terminals[0];
  const remaining = reservation
    ? Math.max(0, Math.ceil((reservation.expiresAt - now) / 1000))
    : 0;
  const expired = Boolean(reservation && remaining === 0);
  const locked = attempts >= 5;
  useEffect(() => {
    if (!reservation || reservation.used) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [reservation]);
  const clearCode = () => {
    setReservation(undefined);
    setEnteredCode("");
    setAttempts(0);
    setError("");
  };
  const generateCode = () => {
    const issuedAt = Date.now();
    setNow(issuedAt);
    setReservation({
      code: temporaryCode(),
      terminalId: terminal.id,
      expiresAt: issuedAt + 10 * 60 * 1000,
      used: false,
    });
    setEnteredCode("");
    setAttempts(0);
    setError("");
  };
  return (
    <Dialog title="Consignes aéroport" onClose={onClose} wide>
      <div className="bv-logistics-tool">
        <div className="bv-tool-intro">
          <span className="bv-tool-badge">
            <MapPin size={15} /> REMISE ASYNCHRONE
          </span>
          <p>Un point de rendez-vous, même à des heures différentes.</p>
          <small>{context.subject}</small>
        </div>
        <p className="bv-tool-notice">
          <LockKeyhole size={18} />
          <span>
            Consignes sécurisées 24/7 en aéroports partenaires (Paris CDG, Orly, Lyon, Marseille, Alger Houari Boumediene, Oran Ahmed Ben Bella). <span className="sr-only">Annuaire de démonstration.</span>
          </span>
        </p>
        <div className="bv-tool-grid bv-tool-form">
          <label>
            Aéroport ou port
            <select
              value={airportCode}
              onChange={(event) => {
                const next = airportLockers.find(
                  (item) => item.code === event.target.value,
                );
                if (!next) return;
                clearCode();
                setAirportCode(next.code);
                setTerminalId(next.terminals[0].id);
              }}
            >
              {airportLockers.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name} ({item.code})
                </option>
              ))}
            </select>
          </label>
          <label>
            Terminal ou point relais
            <select
              value={terminal.id}
              onChange={(event) => {
                clearCode();
                setTerminalId(event.target.value);
              }}
            >
              {airport.terminals.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <section className="bv-locker-card">
          <div className="bv-locker-location">
            <span className="bv-locker-icon">
              {terminal.kind === "port" ? (
                <Ship size={28} />
              ) : (
                <Plane size={28} />
              )}
            </span>
            <div>
              <small>
                {airport.name} · {airport.code}
              </small>
              <h3>{terminal.name}</h3>
              <p>Accès public à confirmer avant le déplacement</p>
            </div>
          </div>
          <dl className="bv-tool-facts">
            <div>
              <dt>
                <Clock3 size={16} /> Horaires du scénario
              </dt>
              <dd>24/7</dd>
            </div>
            <div>
              <dt>Casiers disponibles</dt>
              <dd>
                {terminal.available} <small>casiers</small>
              </dd>
            </div>
            <div>
              <dt>Tarif négocié cible · indicatif</dt>
              <dd>
                {logisticsNumber(terminal.dailyRate)} {terminal.currency}
                <small> / 24 h</small>
              </dd>
            </div>
          </dl>
          <div className="bv-locker-steps">
            <span>
              <PackageCheck size={18} /> Dépôt du colis scellé
            </span>
            <span>
              <KeyRound size={18} /> Code temporaire
            </span>
            <span>
              <LockKeyhole size={18} /> Retrait unique
            </span>
          </div>
        </section>
        <section className="bv-locker-access">
          <h3>
            <KeyRound size={20} /> Consignation par OTP
          </h3>
          <p>
            Générez un code à 6 chiffres valable 10 minutes et utilisable une
            seule fois pour sécuriser votre retrait.
          </p>
          {!reservation ? (
            <button
              type="button"
              className="primary-button"
              onClick={generateCode}
            >
              Simuler une consignation
            </button>
          ) : (
            <>
              <div className="bv-otp-card">
                <small>CODE DE RETRAIT SÉCURISÉ (OTP)</small>
                <output
                  aria-label="Code OTP temporaire"
                  className="bv-otp-value"
                >
                  {reservation.used || expired || locked
                    ? "------"
                    : reservation.code}
                </output>
                <p role="status" aria-label="État du code de retrait">
                  {reservation.used
                    ? "Retrait confirmé. Ce code a été consommé."
                    : locked
                      ? "Code bloqué après 5 tentatives."
                      : expired
                        ? "Code expiré. Générez un nouveau code."
                        : `Valable encore ${Math.floor(remaining / 60)} min ${String(remaining % 60).padStart(2, "0")} s · ${terminal.name}`}
                </p>
              </div>
              {!reservation.used && !expired && !locked && (
                <form
                  className="bv-tool-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (Date.now() >= reservation.expiresAt) {
                      setNow(Date.now());
                      setError("Ce code a expiré.");
                      return;
                    }
                    if (
                      reservation.terminalId !== terminal.id ||
                      enteredCode !== reservation.code
                    ) {
                      setAttempts((current) => current + 1);
                      setError("Code incorrect. Vérifiez les 6 chiffres.");
                      return;
                    }
                    setReservation((current) =>
                      current ? { ...current, used: true } : undefined,
                    );
                    setEnteredCode("");
                    setError("");
                  }}
                >
                  <label>
                    Code de retrait à vérifier
                    <input
                      required
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      autoComplete="one-time-code"
                      value={enteredCode}
                      onChange={(event) =>
                        setEnteredCode(
                          event.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                    />
                  </label>
                  <button
                    className="primary-button"
                    aria-label="Vérifier le code et simuler le retrait"
                    disabled={enteredCode.length !== 6}
                  >
                    Vérifier le code et confirmer le retrait
                  </button>
                </form>
              )}
              {(expired || locked || reservation.used) && (
                <button
                  type="button"
                  className="bv-tool-secondary"
                  onClick={generateCode}
                >
                  Générer un nouveau code
                </button>
              )}
            </>
          )}
          {error && (
            <p className="bv-tool-alert" role="alert">
              {error}
            </p>
          )}
          <p className="bv-tool-note">
            Le code reste sur cette page et disparaît à sa fermeture. Conservez-le jusqu’au retrait et communiquez-le uniquement au destinataire.
          </p>
        </section>
      </div>
    </Dialog>
  );
}
