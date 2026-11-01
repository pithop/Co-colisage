import { useEffect, useState } from "react";
import {
  Check,
  Download,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { Dialog } from "../marketplace/Dialog";
import { useAuth } from "../../context/AuthContext";
import type { TransportContext } from "../../services/transportDocuments";
import {
  contentDigest,
  downloadLogisticsText,
  loadSeal,
  saveSeal,
  type SealReceipt,
} from "../../services/logisticsTools";
import { logisticsSources } from "../../data/logisticsPolicies";
import { DocumentQr } from "./DocumentCode";

const inspectionChecks = [
  "J’ai inspecté visuellement chaque objet à l’état nu avant emballage.",
  "Les batteries lithium sont de 100 Wh maximum, protégées ; les batteries de réserve et batteries externes restent en cabine.",
  "Aucune substance prohibée ni marchandise dangereuse non autorisée n’est présente.",
] as const;

export function SecurityStebSealModal({
  context,
  onClose,
}: {
  context: TransportContext;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const scope = user?.id ?? "demo";
  const [sealId] = useState(
    () =>
      `STEB-${new Date().getFullYear()}-VOID-${crypto.randomUUID().toUpperCase()}`,
  );
  const [voidVisible, setVoidVisible] = useState(false);
  const [checks, setChecks] = useState<boolean[]>(
    inspectionChecks.map(() => false),
  );
  const [sender, setSender] = useState(context.sender ?? "");
  const [carrier, setCarrier] = useState(context.carrier ?? "");
  const [senderSigned, setSenderSigned] = useState(false);
  const [carrierSigned, setCarrierSigned] = useState(false);
  const [receipt, setReceipt] = useState<SealReceipt>();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setReceipt(undefined);
    setLoading(true);
    setError("");
    loadSeal(scope, context.id)
      .then((saved) => {
        if (active) setReceipt(saved);
      })
      .catch(() => {
        if (active)
          setError(
            "Le registre de scellage est indisponible. Rouvrez cet outil pour réessayer.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [scope, context.id]);

  const ready =
    checks.every(Boolean) &&
    sender.trim().length >= 2 &&
    carrier.trim().length >= 2 &&
    senderSigned &&
    carrierSigned &&
    !voidVisible;
  const id = receipt?.id ?? sealId;
  const download = () => {
    if (!receipt) return;
    downloadLogisticsText(
      `${receipt.id}.txt`,
      [
        "BAGVOYAGE / RÉCÉPISSÉ D’INSPECTION ET DE SCELLAGE",
        `Scellé : ${receipt.id}`,
        `Commande : ${receipt.orderId}`,
        `Contenu : ${receipt.subject}`,
        `Signé le : ${receipt.signedAt}`,
        "Intégrité déclarée lors du scellage : intacte.",
        ...receipt.attestations,
        `Signature électronique simple de l’expéditeur : ${receipt.sender}`,
        `Signature électronique simple du voyageur : ${receipt.carrier}`,
        `SHA-256 du contenu : ${receipt.digest}`,
        "Les parties ont accepté les attestations dans ce navigateur. Identités et horodatage non certifiés par un tiers.",
        "Ce récépissé ne certifie pas le sac physique OACI et ne dispense pas des contrôles de sûreté.",
        `Référence OACI : ${logisticsSources.steb}`,
        `Batteries : ${logisticsSources.batteries}`,
      ].join("\n\n"),
    );
  };

  return (
    <Dialog title="Scellé OACI STEB" onClose={onClose} wide>
      <div className="bv-logistics-tool">
        <div className="bv-tool-intro">
          <span className="bv-tool-badge">
            <ShieldCheck size={15} /> INTÉGRITÉ DU COLIS
          </span>
          <p>Inspecter ensemble. Sceller. Conserver la preuve.</p>
          <small>{context.subject}</small>
        </div>
        <section
          className={`bv-seal-preview ${voidVisible ? "is-void" : ""}`}
          aria-label="Simulation de l’intégrité du scellé"
        >
          <div className="bv-seal-top">
            <span>SIMULATION DU RUBAN NUMÉROTÉ</span>
            {voidVisible ? <ShieldX size={24} /> : <LockKeyhole size={24} />}
          </div>
          <div className="bv-seal-tape" aria-hidden="true">
            {voidVisible ? "VOID / VOID / VOID" : "BAGVOYAGE / SECURITY SEAL"}
          </div>
          <div className="bv-seal-identity">
            <div>
              <small>Identifiant à reporter sur le scellé physique</small>
              <strong data-testid="seal-id">{id}</strong>
              <p role="status">
                {voidVisible
                  ? "Effraction simulée : transfert d’encre visible, scellé à remplacer."
                  : "Scellé intact : aucune trace d’ouverture visible."}
              </p>
            </div>
            <DocumentQr id={id} digest={receipt?.digest ?? ""} />
          </div>
          <button
            type="button"
            className="bv-tool-secondary"
            aria-pressed={voidVisible}
            onClick={() => setVoidVisible((current) => !current)}
          >
            {voidVisible
              ? "Revenir à la vue intacte"
              : "Simuler une effraction VOID"}
          </button>
          <small>
            La simulation illustre le ruban à transfert d’encre. Une effraction
            réelle nécessite un nouveau scellé et une nouvelle inspection.
          </small>
        </section>
        <p className="bv-tool-note">
          Les STEB OACI concernent les liquides achetés en zone réservée ou à
          bord. Utilisez un sac physique conforme et sa preuve d’achat ; cette
          attestation ne vaut pas certification OACI du colis.{" "}
          <a href={logisticsSources.steb} target="_blank" rel="noreferrer">
            Spécifications OACI
          </a>
        </p>
        {loading ? (
          <p role="status">Chargement du récépissé…</p>
        ) : receipt ? (
          <section
            className="bv-tool-success"
            aria-label="Récépissé de scellage"
          >
            <h3>
              <Check size={20} /> Scellage confirmé
            </h3>
            <p>Attestation conservée sur cet appareil pour cette commande.</p>
            <dl className="bv-tool-facts">
              <div>
                <dt>Expéditeur</dt>
                <dd>{receipt.sender}</dd>
              </div>
              <div>
                <dt>Voyageur</dt>
                <dd>{receipt.carrier}</dd>
              </div>
              <div>
                <dt>Signatures recueillies</dt>
                <dd>{new Date(receipt.signedAt).toLocaleString("fr-FR")}</dd>
              </div>
            </dl>
            <p className="bv-tool-hash">SHA-256 · {receipt.digest}</p>
            <button type="button" className="primary-button" onClick={download}>
              <Download size={18} /> Télécharger le récépissé d’intégrité
            </button>
          </section>
        ) : (
          <form
            className="bv-tool-form"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!ready || busy || error) return;
              setBusy(true);
              try {
                const payload = {
                  id,
                  orderId: context.id,
                  subject: context.subject,
                  sender: sender.trim(),
                  carrier: carrier.trim(),
                  signedAt: new Date().toISOString(),
                  attestations: [...inspectionChecks],
                };
                const signed = {
                  ...payload,
                  digest: await contentDigest(payload),
                };
                await saveSeal(scope, signed);
                setReceipt(signed);
              } catch {
                setError(
                  "L’attestation n’a pas été enregistrée. Rouvrez cet outil pour vérifier le registre et réessayer.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            <fieldset disabled={busy || Boolean(error)}>
              <legend>01 / Inspection avant vol</legend>
              {inspectionChecks.map((label, index) => (
                <label className="bv-tool-check" key={label}>
                  <input
                    type="checkbox"
                    required
                    checked={checks[index]}
                    onChange={(event) =>
                      setChecks((current) =>
                        current.map((value, i) =>
                          i === index ? event.target.checked : value,
                        ),
                      )
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}
              <p className="bv-tool-note">
                <a
                  href={logisticsSources.batteries}
                  target="_blank"
                  rel="noreferrer"
                >
                  Règles IATA sur les batteries
                </a>{" "}
                · Les restrictions de la compagnie restent applicables.
              </p>
            </fieldset>
            <fieldset disabled={busy || Boolean(error)}>
              <legend>02 / Signatures électroniques simples</legend>
              <div className="bv-tool-grid">
                <label>
                  Nom de l’expéditeur
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    autoComplete="off"
                    value={sender}
                    onChange={(event) => {
                      setSender(event.target.value);
                      setSenderSigned(false);
                    }}
                  />
                </label>
                <label>
                  Nom du voyageur
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    autoComplete="off"
                    value={carrier}
                    onChange={(event) => {
                      setCarrier(event.target.value);
                      setCarrierSigned(false);
                    }}
                  />
                </label>
              </div>
              <label className="bv-tool-check">
                <input
                  type="checkbox"
                  required
                  checked={senderSigned}
                  onChange={(event) => setSenderSigned(event.target.checked)}
                />
                <span>
                  Signature de l’expéditeur : j’atteste l’inspection et le
                  scellage en présence du voyageur.
                </span>
              </label>
              <label className="bv-tool-check">
                <input
                  type="checkbox"
                  required
                  checked={carrierSigned}
                  onChange={(event) => setCarrierSigned(event.target.checked)}
                />
                <span>
                  Signature du voyageur : j’accepte les attestations et la prise
                  en charge du colis scellé.
                </span>
              </label>
              <p className="bv-tool-note">
                <Fingerprint size={16} /> Noms, consentements et date sont
                inscrits au récépissé. L’empreinte SHA-256 identifie le contenu
                ; elle ne vérifie pas les identités.
              </p>
            </fieldset>
            <button
              className="primary-button"
              disabled={!ready || busy || Boolean(error)}
            >
              <ShieldCheck size={18} />
              {busy ? "Enregistrement…" : "Confirmer le scellage"}
            </button>
          </form>
        )}
        {error && (
          <p className="bv-tool-alert" role="alert">
            {error}
          </p>
        )}
      </div>
    </Dialog>
  );
}
