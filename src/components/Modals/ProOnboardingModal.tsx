import { useState } from "react";
import { Building2, FileCheck, Plus, Trash2, ShieldCheck, Truck, Check, Lock } from "lucide-react";
import { Dialog } from "../marketplace/Dialog";
import { readAttachment, type Attachment } from "../../services/uploads";
import {
  getAll,
  saveRecord,
  type ProApplication,
} from "../../services/productionDb";
import type { User } from "../../types/auth";

export const proDocumentLabels = {
  registry: "Kbis ou extrait CNRC",
  license: "Licence de transport DREAL / Ministère des Transports",
  insurance: "Attestation RC Pro marchandises",
  identity: "Pièce d’identité du gérant",
} as const;

export function ProOnboardingModal({
  user,
  onClose,
  onSubmitted,
}: {
  user: User;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [country, setCountry] = useState<"FR" | "DZ">("FR");
  const [documents, setDocuments] = useState<
    Partial<ProApplication["documents"]>
  >({});
  const [fleet, setFleet] = useState([
    {
      id: crypto.randomUUID(),
      type: "Camionnette",
      payloadKg: 1000,
      volume: 8,
    },
  ]);
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(0);
  const [error, setError] = useState("");

  const updateVehicle = (id: string, values: Partial<(typeof fleet)[number]>) =>
    setFleet((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...values } : row)),
    );

  const docCount = Object.keys(documents).length;
  const currentStep = docCount >= 4 ? 3 : docCount > 0 ? 2 : 1;

  return (
    <Dialog title="Devenir transporteur professionnel agréé" onClose={onClose} wide>
      {/* Stepper with connected sleek indicators */}
      <div className="mb-5 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
        <div className="grid grid-cols-3 gap-2">
          {[
            { num: 1, title: 'Entreprise', subtitle: 'SIRET / CNRC' },
            { num: 2, title: 'Licences & RC', subtitle: 'DREAL & Assurance' },
            { num: 3, title: 'Flotte & Capacités', subtitle: 'Charges utiles (kg/m³)' },
          ].map((s) => {
            const active = currentStep === s.num;
            const completed = currentStep > s.num;
            return (
              <div
                key={s.num}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all border ${
                  completed
                    ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                    : active
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border-blue-500/40 dark:border-blue-500/50 ring-2 ring-blue-500/10'
                    : 'border-transparent text-slate-400 dark:text-slate-500 opacity-60'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 transition-transform ${
                    completed
                      ? 'bg-emerald-600 text-white'
                      : active
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}
                >
                  {completed ? <Check size={13} strokeWidth={3} /> : s.num}
                </span>
                <div className="min-w-0 hidden sm:block">
                  <p className="text-xs font-bold leading-tight truncate">{s.title}</p>
                  <p className="text-[10px] opacity-75 truncate">{s.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="composer-heading">
        <Building2 size={32} />
        <div>
          <span className="eyebrow">BAGVOYAGE BUSINESS</span>
          <h3>Votre métier. Un nouveau territoire.</h3>
          <p>Dossier officiel pour agrémenter votre flotte et débloquer les groupages volumétriques.</p>
        </div>
      </div>
      <form
        className="publish-form pro-onboarding"
        onSubmit={async (event) => {
          event.preventDefault();
          if (busy || reading) return;
          const data = new FormData(event.currentTarget);
          setError("");
          setBusy(true);
          try {
            if (
              !Object.keys(proDocumentLabels).every(
                (key) => documents[key as keyof typeof documents],
              )
            )
              throw new Error(
                "Les quatre pièces justificatives sont obligatoires.",
              );
            if (
              (await getAll("pro_applications")).some(
                (row) => row.userId === user.id && row.status !== "rejected",
              )
            )
              throw new Error(
                "Vous avez déjà un dossier en cours ou approuvé.",
              );
            await saveRecord("users", user);
            await saveRecord("pro_applications", {
              id: crypto.randomUUID(),
              userId: user.id,
              companyName: String(data.get("companyName")).trim(),
              country,
              registration: String(data.get("registration")).trim(),
              documents: documents as Record<
                keyof typeof proDocumentLabels,
                Attachment
              >,
              fleet,
              status: "pending",
              submittedAt: new Date().toISOString(),
            });
            onSubmitted();
          } catch (cause) {
            setError(
              cause instanceof Error
                ? cause.message
                : "Enregistrement impossible. Vos pièces restent dans ce formulaire.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Raison sociale
          <input
            name="companyName"
            required
            maxLength={150}
            defaultValue={user.companyName}
          />
        </label>
        <div className="form-grid">
          <div>
            <span className="block text-xs font-semibold mb-1.5">Pays d’immatriculation</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "FR", label: "France" },
                { id: "DZ", label: "Algérie" },
              ].map((c) => {
                const isSelected = country === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCountry(c.id as typeof country)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
          <label>
            {country === "FR" ? "Numéro SIRET" : "Numéro CNRC"}
            <input
              key={country}
              name="registration"
              required
              pattern={country === "FR" ? "[0-9]{14}" : "[A-Za-z0-9 /-]{6,30}"}
              title={
                country === "FR"
                  ? "14 chiffres sans espaces"
                  : "Numéro CNRC de 6 à 30 caractères"
              }
            />
          </label>
        </div>
        <section className="document-list">
          <h3>Pièces justificatives</h3>
          <p>
            PDF, JPEG, PNG ou WebP. 4 Mo par pièce. Conservation sur cet
            appareil.
          </p>
          {Object.entries(proDocumentLabels).map(([key, label]) => (
            <label className="document-upload" key={key}>
              <FileCheck size={22} />
              <span>
                {label}
                <small>
                  {documents[key as keyof typeof documents]?.name ||
                    "Ajouter le document"}
                </small>
              </span>
              <input
                aria-label={label}
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                disabled={busy}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setReading((count) => count + 1);
                  setError("");
                  try {
                    const attachment = await readAttachment(file, true);
                    setDocuments((current) => ({
                      ...current,
                      [key]: attachment,
                    }));
                  } catch (cause) {
                    setError(
                      cause instanceof Error
                        ? cause.message
                        : "Lecture impossible.",
                    );
                  } finally {
                    setReading((count) => count - 1);
                  }
                }}
              />
            </label>
          ))}
        </section>
        <fieldset className="fleet-editor">
          <legend>Votre flotte</legend>
          {fleet.map((vehicle, index) => (
            <div className="fleet-row" key={vehicle.id}>
              <div className="bv-vehicle-type-group">
                <span className="bv-vehicle-label">Véhicule {index + 1}</span>
                <div className="bv-vehicle-type-segmented" role="group" aria-label={`Type de véhicule ${index + 1}`}>
                  {["Camionnette", "Fourgon", "Poids lourd"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`bv-vehicle-type-btn ${vehicle.type === type ? "active" : ""}`}
                      onClick={() => updateVehicle(vehicle.id, { type })}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <label>
                Charge utile {index + 1} (kg)
                <input
                  required
                  type="number"
                  min="1"
                  max="44000"
                  value={vehicle.payloadKg || ""}
                  onChange={(event) =>
                    updateVehicle(vehicle.id, {
                      payloadKg: Number(event.target.value),
                    })
                  }
                />
              </label>
              <label>
                Volume {index + 1} (m³)
                <input
                  required
                  type="number"
                  min="0.1"
                  max="200"
                  step="0.1"
                  value={vehicle.volume || ""}
                  onChange={(event) =>
                    updateVehicle(vehicle.id, {
                      volume: Number(event.target.value),
                    })
                  }
                />
              </label>
              <button
                className="icon-button"
                type="button"
                disabled={fleet.length === 1}
                aria-label={`Retirer le véhicule ${index + 1}`}
                onClick={() =>
                  setFleet((rows) =>
                    rows.filter((row) => row.id !== vehicle.id),
                  )
                }
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="outline-button"
            disabled={fleet.length >= 30}
            onClick={() =>
              setFleet((rows) => [
                ...rows,
                {
                  id: crypto.randomUUID(),
                  type: "Fourgon",
                  payloadKg: 1500,
                  volume: 12,
                },
              ])
            }
          >
            <Plus size={18} />
            Ajouter un véhicule
          </button>
        </fieldset>
        <label className="check-row">
          <input type="checkbox" required />
          Je certifie l’exactitude de ces informations et la validité des
          documents transmis.
        </label>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="primary-button"
          disabled={busy || reading > 0}
        >
          {busy
            ? "Enregistrement…"
            : reading
              ? "Lecture des documents…"
              : "Soumettre mon dossier"}
        </button>
        <p>
          Le badge Transporteur Professionnel Vérifié sera attribué après examen
          et approbation du dossier.
        </p>
      </form>
    </Dialog>
  );
}
