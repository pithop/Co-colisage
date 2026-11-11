import { useState } from "react";
import {
  ClipboardList,
  Download,
  FileCheck2,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Dialog } from "../marketplace/Dialog";
import type { TransportContext } from "../../services/transportDocuments";
import {
  downloadLogisticsText,
  logisticsNumber,
} from "../../services/logisticsTools";
import { logisticsSources } from "../../data/logisticsPolicies";

type Incident = "delay" | "loss" | "damage";
interface PirFields {
  company: string;
  passenger: string;
  contact: string;
  flight: string;
  date: string;
  bagTag: string;
  reference: string;
  value: string;
  claim: string;
  currency: string;
  incident: Incident;
  details: string;
  insuranceReference: string;
}
interface PirKit {
  id: string;
  letter: string;
  accelerated: boolean;
}
const incidentLabels: Record<Incident, string> = {
  delay: "Bagage retardé",
  loss: "Bagage perdu",
  damage: "Bagage avarié",
};

function generateLetter(
  fields: PirFields,
  context: TransportContext,
  accelerated: boolean,
  issuedAt: string,
) {
  const amount = `${logisticsNumber(Number(fields.claim))} ${fields.currency}`;
  const damage =
    fields.incident === "delay"
      ? "Je sollicite le remboursement de mes frais nécessaires et raisonnables justifiés, exposés du fait du retard. La valeur de l’inventaire ne constitue pas le montant de cette demande."
      : "Je sollicite la réparation du préjudice matériel documenté, en tenant compte de l’état et de la valeur des biens, sur présentation des justificatifs.";
  return [
    "BAGVOYAGE / DOSSIER CONTENTIEUX PIR",
    `${fields.passenger.trim()}\n${fields.contact.trim()}`,
    `À l’attention du service réclamations de ${fields.company.trim()}`,
    `Date : ${new Date(issuedAt).toLocaleDateString("fr-FR")}`,
    `Objet : Mise en demeure de traiter ma réclamation – ${incidentLabels[fields.incident].toLowerCase()}`,
    `Vol : ${fields.flight.trim().toUpperCase()} du ${fields.date}\nÉtiquette bagage : ${fields.bagTag.trim()}\nRéférence PIR émise à l’aéroport : ${fields.reference.trim().toUpperCase()}\nRéférence BagVoyage : ${context.id}`,
    "Madame, Monsieur,",
    `Je vous adresse cette réclamation écrite concernant mon bagage enregistré. ${fields.details.trim()}`,
    "Sous réserve que mon transport relève de la Convention de Montréal du 28 mai 1999, les articles 17 et 22, paragraphe 2, encadrent votre responsabilité pour les bagages enregistrés et la limite de réparation. En cas de retard, l’article 19 est également applicable, sous réserve des moyens d’exonération prévus par la Convention.",
    "Le plafond de responsabilité applicable aux bagages est de 1 519 DTS par passager depuis le 28 décembre 2024, pour l’ensemble des bagages, sauf régime dérogatoire applicable, notamment déclaration spéciale d’intérêt. Ce plafond ne constitue pas une indemnité forfaitaire automatique. La conversion des DTS s’apprécie selon l’article 23.",
    `Valeur déclarée des biens confiés : ${logisticsNumber(Number(fields.value))} ${fields.currency}.\nMontant du préjudice dont je demande réparation : ${amount}.\n${damage}`,
    fields.incident === "loss"
      ? "La compagnie a reconnu la perte ou le bagage n’a pas été livré à l’expiration de 21 jours après la date prévue, conformément à l’article 17, paragraphe 3."
      : fields.incident === "damage"
        ? "Cette protestation écrite doit être adressée au plus tard dans les 7 jours suivant la réception du bagage (article 31)."
        : "Cette protestation écrite doit être adressée au plus tard dans les 21 jours suivant la mise à disposition du bagage (article 31).",
    `Je vous mets en demeure d’examiner ma demande et de me proposer une réparation du préjudice prouvé, dans la limite applicable, dans les 15 jours suivant réception de ce courrier. Ce délai de réponse demandé ne prolonge aucun délai légal de réclamation ou d’action.`,
    "Je conserve mes droits au titre de l’article 35, qui prévoit un délai de deux ans pour l’action en responsabilité, calculé selon les conditions de la Convention.",
    "Pièces à joindre : copie du PIR de l’aéroport, billet et carte d’embarquement, étiquette bagage, inventaire et factures des biens, justificatifs de frais ou réparations, photos et récépissé de scellage si disponible. Le présent kit ne remplace pas le PIR émis par la compagnie.",
    accelerated
      ? `Demande d’étude ad valorem BagVoyage : contrat déclaré ${fields.insuranceReference.trim()}. Je demande l’examen d’une prise en charge accélérée, avec un objectif de 72 h après validation d’un dossier complet, exclusivement si mon contrat le prévoit. Toute subrogation dépend du contrat et de l’indemnisation effective. Cette demande n’active aucune assurance et ne garantit aucun versement.`
      : "Aucune demande de prise en charge accélérée jointe.",
    `Veuillez agréer, Madame, Monsieur, mes salutations distinguées.\n${fields.passenger.trim()}\nSignature à apposer avant envoi.`,
    `Références :\n${logisticsSources.montreal}\n${logisticsSources.claims}`,
    "Modèle à relire et à transmettre au transporteur avec les justificatifs. Aucun envoi ni dépôt de réclamation n’a été effectué par BagVoyage.",
  ].join("\n\n");
}

export function PirLitigationKitModal({
  context,
  onClose,
}: {
  context: TransportContext;
  onClose: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const flightMatch = context.reference?.match(/\b[A-Z0-9]{2}\s?\d{2,4}\b/i);
  const [fields, setFields] = useState<PirFields>({
    company:
      context.reference?.replace(/\b[A-Z0-9]{2}\s?\d{2,4}\b/i, "").trim() ?? "",
    passenger: context.carrier ?? "",
    contact: "",
    flight: flightMatch?.[0] ?? "",
    date: context.date && context.date <= today ? context.date : "",
    bagTag: "",
    reference: "",
    value: context.value !== undefined ? String(context.value) : "",
    claim: "",
    currency: context.currency ?? "EUR",
    incident: "delay",
    details: "",
    insuranceReference: "",
  });
  const [accelerated, setAccelerated] = useState(false);
  const [lossConfirmed, setLossConfirmed] = useState(false);
  const [certified, setCertified] = useState(false);
  const [kit, setKit] = useState<PirKit>();
  const [error, setError] = useState("");
  const change = <K extends keyof PirFields>(key: K, value: PirFields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
    setCertified(false);
  };
  return (
    <Dialog title="Dossier litige PIR" onClose={onClose} wide>
      <div className="bv-logistics-tool">
        <div className="bv-tool-intro">
          <span className="bv-tool-badge">
            <Scale size={15} /> CONVENTION DE MONTRÉAL
          </span>
          <p>Votre recours, documenté et prêt à transmettre.</p>
          <small>
            Bagage retardé, perdu ou avarié par la compagnie aérienne.
          </small>
        </div>
        <section className="bv-pir-limit">
          <div>
            <small>PLAFOND BAGAGES / PASSAGER</small>
            <strong>
              1 519 <span>DTS</span>
            </strong>
          </div>
          <p>
            Révision applicable depuis le 28 décembre 2024. Repère du rapport :
            environ 1 870 EUR, à recalculer au cours applicable. Le
            remboursement dépend du préjudice prouvé.
          </p>
        </section>
        {kit ? (
          <>
            <div className="bv-tool-success" role="status">
              <FileCheck2 size={22} />
              <div>
                <h3>Kit PIR généré</h3>
                <p>
                  Relisez la lettre, joignez vos preuves et transmettez le
                  dossier à la compagnie.
                </p>
              </div>
            </div>
            <article
              className="bv-pir-letter"
              aria-label="Lettre de mise en demeure"
            >
              <pre>{kit.letter}</pre>
            </article>
            {kit.accelerated && (
              <p className="bv-tool-notice">
                <ShieldCheck size={20} />
                <span>
                  Demande d’étude sous 72 h préparée. Aucune assurance activée,
                  aucun paiement garanti et aucune subrogation exécutée par
                  cette interface.
                </span>
              </p>
            )}
            <div className="bv-tool-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  downloadLogisticsText(`${kit.id}.txt`, kit.letter)
                }
              >
                <Download size={18} /> Télécharger le kit PIR
              </button>
              <button
                type="button"
                className="bv-tool-secondary"
                onClick={() => {
                  setKit(undefined);
                  setCertified(false);
                }}
              >
                Modifier le dossier
              </button>
            </div>
          </>
        ) : (
          <form
            className="bv-tool-form"
            onSubmit={(event) => {
              event.preventDefault();
              const required = [
                fields.company,
                fields.passenger,
                fields.contact,
                fields.flight,
                fields.date,
                fields.bagTag,
                fields.reference,
                fields.details,
              ];
              if (
                !certified ||
                required.some((value) => !value.trim()) ||
                !fields.value.trim() ||
                !fields.claim.trim() ||
                [Number(fields.value), Number(fields.claim)].some(
                  (n) => !Number.isFinite(n) || n < 0 || n > 10000000,
                ) ||
                fields.date > today ||
                (fields.incident === "loss" && !lossConfirmed) ||
                (accelerated && !fields.insuranceReference.trim())
              ) {
                setError(
                  "Vérifiez les informations, les montants et les attestations avant de générer le kit.",
                );
                return;
              }
              setError("");
              setKit({
                id: `PIR-${crypto.randomUUID().toUpperCase()}`,
                letter: generateLetter(
                  fields,
                  context,
                  accelerated,
                  new Date().toISOString(),
                ),
                accelerated,
              });
            }}
          >
            <fieldset>
              <legend>01 / Vol et déclaration d’irrégularité</legend>
              <div className="bv-tool-grid">
                <div>
                  <span className="block text-xs font-semibold mb-1.5">Nature de l’incident</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      Object.entries(incidentLabels) as [Incident, string][]
                    ).map(([key, label]) => {
                      const isSelected = fields.incident === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            change("incident", key as Incident);
                            setLossConfirmed(false);
                          }}
                          className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <label>
                  Compagnie aérienne
                  <input
                    required
                    maxLength={120}
                    value={fields.company}
                    onChange={(event) => change("company", event.target.value)}
                  />
                </label>
                <label>
                  Numéro de vol
                  <input
                    required
                    maxLength={12}
                    pattern="[A-Za-z0-9]{2,3}[ ]?[0-9]{1,4}"
                    placeholder="AH1021"
                    value={fields.flight}
                    onChange={(event) => change("flight", event.target.value)}
                  />
                </label>
                <label>
                  Date du vol
                  <input
                    required
                    type="date"
                    max={today}
                    value={fields.date}
                    onChange={(event) => change("date", event.target.value)}
                  />
                </label>
                <label>
                  Numéro d’étiquette bagage
                  <input
                    required
                    minLength={5}
                    maxLength={20}
                    value={fields.bagTag}
                    onChange={(event) => change("bagTag", event.target.value)}
                    placeholder="1234567890"
                  />
                </label>
                <label>
                  Référence PIR de l’aéroport
                  <input
                    required
                    minLength={5}
                    maxLength={30}
                    value={fields.reference}
                    onChange={(event) =>
                      change("reference", event.target.value)
                    }
                    placeholder="ALGAH12345"
                  />
                </label>
              </div>
            </fieldset>
            <p className="bv-tool-notice">
              <ClipboardList size={20} />
              <span>
                {fields.incident === "damage"
                  ? "Avarie : réclamation écrite sous 7 jours après réception du bagage."
                  : fields.incident === "delay"
                    ? "Retard : réclamation écrite sous 21 jours après mise à disposition du bagage ; conservez les factures des achats nécessaires."
                    : "Perte : reconnaissance par la compagnie ou absence de livraison après 21 jours. Réclamez dès que possible."}{" "}
                Le PIR seul ne remplace pas votre demande d’indemnisation
                écrite.
              </span>
            </p>
            {fields.incident === "loss" && (
              <label className="bv-tool-check">
                <input
                  type="checkbox"
                  required
                  checked={lossConfirmed}
                  onChange={(event) => setLossConfirmed(event.target.checked)}
                />
                <span>
                  La compagnie a reconnu la perte ou le bagage reste absent
                  après 21 jours.
                </span>
              </label>
            )}
            <fieldset>
              <legend>02 / Passager et préjudice</legend>
              <div className="bv-tool-grid">
                <label>
                  Nom du passager
                  <input
                    required
                    maxLength={120}
                    value={fields.passenger}
                    onChange={(event) =>
                      change("passenger", event.target.value)
                    }
                  />
                </label>
                <label>
                  Coordonnées du passager
                  <input
                    required
                    maxLength={300}
                    placeholder="Adresse postale ou e-mail de réponse"
                    value={fields.contact}
                    onChange={(event) => change("contact", event.target.value)}
                  />
                </label>
                <label>
                  Valeur des biens confiés
                  <input
                    required
                    type="number"
                    min="0"
                    max="10000000"
                    step="0.01"
                    value={fields.value}
                    onChange={(event) => change("value", event.target.value)}
                  />
                </label>
                <label>
                  {fields.incident === "delay"
                    ? "Frais nécessaires justifiés"
                    : "Montant du préjudice justifié"}
                  <input
                    required
                    type="number"
                    min="0"
                    max="10000000"
                    step="0.01"
                    value={fields.claim}
                    onChange={(event) => change("claim", event.target.value)}
                  />
                </label>
                <div>
                  <span className="block text-xs font-semibold mb-1.5">Devise des montants</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["EUR", "DZD", "MAD", "TND", "CAD"].map((curr) => {
                      const isSelected = fields.currency === curr;
                      return (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => {
                            setFields((current) => ({
                              ...current,
                              currency: curr,
                              value: "",
                              claim: "",
                            }));
                            setCertified(false);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {curr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <label>
                Circonstances et inventaire
                <textarea
                  required
                  maxLength={3000}
                  rows={3}
                  value={fields.details}
                  onChange={(event) => change("details", event.target.value)}
                  placeholder="Décrivez le retard ou les dommages, les articles et les justificatifs disponibles."
                />
              </label>
            </fieldset>
            <section className="bv-pir-insurance">
              <h3>
                <ShieldCheck size={19} /> Assurance ad valorem BagVoyage
              </h3>
              <label className="bv-tool-check">
                <input
                  type="checkbox"
                  checked={accelerated}
                  onChange={(event) => {
                    setAccelerated(event.target.checked);
                    setCertified(false);
                  }}
                />
                <span>
                  Préparer une demande d’indemnisation accélérée sous 72 h, sous
                  réserve de mon contrat.
                </span>
              </label>
              <p className="bv-tool-note">
                Objectif après validation d’un dossier complet, si prévu au
                contrat. La subrogation dans les droits du passager dépend de
                l’indemnisation effective.
              </p>
              {accelerated && (
                <label>
                  Référence du contrat ad valorem
                  <input
                    required
                    maxLength={120}
                    value={fields.insuranceReference}
                    onChange={(event) =>
                      change("insuranceReference", event.target.value)
                    }
                  />
                </label>
              )}
            </section>
            <label className="bv-tool-check">
              <input
                type="checkbox"
                required
                checked={certified}
                onChange={(event) => setCertified(event.target.checked)}
              />
              <span>
                Je confirme les faits déclarés et vérifierai l’application de la
                Convention de Montréal à mon vol avant l’envoi.
              </span>
            </label>
            {error && (
              <p className="bv-tool-alert" role="alert">
                {error}
              </p>
            )}
            <button
              className="primary-button"
              disabled={
                !certified || (fields.incident === "loss" && !lossConfirmed)
              }
            >
              <FileCheck2 size={18} /> Générer le kit contentieux PIR
            </button>
          </form>
        )}
        <p className="bv-tool-note">
          <a href={logisticsSources.montreal} target="_blank" rel="noreferrer">
            OACI : plafonds révisés
          </a>{" "}
          ·{" "}
          <a href={logisticsSources.claims} target="_blank" rel="noreferrer">
            Délais et démarches
          </a>
          . Ce modèle concerne les bagages aériens ; le fret marchandises et le
          transport maritime relèvent de régimes distincts.
        </p>
      </div>
    </Dialog>
  );
}
