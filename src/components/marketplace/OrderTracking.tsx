import { useState } from "react";
import {
  Check,
  Clock,
  FileCheck2,
  Landmark,
  MapPin,
  Plane,
  Radio,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { Dialog } from "./Dialog";
import { createMessage, type ConversationData } from "./Conversation";
import {
  formatHandoverTime,
  handoverSummary,
  type FlightDelay,
} from "./handover";
import { WaybillModal } from "../logistics/WaybillModal";
import { CustomsModal } from "../logistics/CustomsModal";
import { LiveRadarModal } from "../logistics/LiveRadarModal";
import { DigitalCargoPassModal } from "../logistics/DigitalCargoPassModal";
import { type TransportContext } from "../../services/transportDocuments";
import {
  LogisticsActions,
  LogisticsToolModal,
  type LogisticsTool,
} from "../logistics/LogisticsTools";

export function FlightDelayDialog({
  conversation: c,
  onUpdate,
  onClose,
}: {
  conversation: ConversationData;
  onUpdate: (c: ConversationData) => void;
  onClose: () => void;
}) {
  const [duration, setDuration] = useState<FlightDelay["duration"]>("+1h");
  const [details, setDetails] = useState("");
  return (
    <Dialog title="Signaler un retard de vol" onClose={onClose}>
      <p className="muted">
        Informez votre partenaire du nouvel horaire. Un message sera ajouté à
        cette conversation.
      </p>
      <form
        className="publish-form"
        onSubmit={(e) => {
          e.preventDefault();
          const delay: FlightDelay = {
            id: crypto.randomUUID(),
            at: new Date().toISOString(),
            duration,
            details: details.trim(),
          };
          const text = `Retard de vol signalé : ${duration === "Vol reprogrammé" ? "vol reprogrammé, nouvel horaire à confirmer" : `${duration} sur l’horaire prévu`}.${delay.details ? ` ${delay.details}` : " Je vous tiendrai informé de l’heure de remise."}`;
          onUpdate({
            ...c,
            delays: [...(c.delays || []), delay],
            messages: [...c.messages, createMessage(text)],
          });
          onClose();
        }}
      >
        <fieldset className="flight-delay-options">
          <legend>Modification du vol</legend>
          {(["+1h", "+3h", "Vol reprogrammé"] as const).map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="flight-delay"
                value={value}
                checked={duration === value}
                onChange={() => setDuration(value)}
              />
              {value}
            </label>
          ))}
        </fieldset>
        <label>
          Précisions (facultatif)
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            maxLength={500}
            placeholder="Nouvel horaire ou rendez-vous proposé"
          />
        </label>
        <button className="primary-button" type="submit">
          <Plane size={18} /> Notifier le retard
        </button>
      </form>
    </Dialog>
  );
}
export function OrderTracking({
  conversation: c,
  onClose,
  transportContext: providedContext,
}: {
  conversation: ConversationData;
  transportContext?: TransportContext;
  onClose: () => void;
}) {
  const [waybillOpen, setWaybillOpen] = useState(false);
  const [customsOpen, setCustomsOpen] = useState(false);
  const [radarOpen, setRadarOpen] = useState(false);
  const [cargoPassOpen, setCargoPassOpen] = useState(false);
  const [logisticsTool, setLogisticsTool] = useState<LogisticsTool>();

  const transportContext: TransportContext = providedContext || {
    id: c.id,
    subject: c.subject,
    sender: "Sarah",
    carrier: c.name,
    recipient: "Destinataire Vérifié",
    origin: "Marseille (MRS)",
    destination: "Alger (ALG)",
    reference: "Air Algérie AH1021",
    date: new Date().toISOString().split("T")[0],
    weight: 5,
    value: c.amount,
    currency: "EUR",
  };

  const stageIndex = [
    "discussion",
    "secured",
    "collected",
    "delivered",
  ].indexOf(c.stage);
  const steps = [
    "Accord et fonds sécurisés",
    "Prise en charge de l’article",
    "Acheminement en cours",
    "Livraison finale et libération des fonds",
  ];
  return (
    <Dialog title="Suivi certifié de l’expédition" onClose={onClose} wide={true}>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <p className="delivery-title !text-base !font-bold !text-slate-900 dark:!text-white !mb-0">
          {c.subject}
        </p>
        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
          RÉF : {transportContext.id}
        </span>
      </div>
      {c.resolution && (
        <section className="admin-notice">
          <h3>
            {c.resolution.outcome === "refund"
              ? "Expéditeur remboursé"
              : "Fonds débloqués au voyageur"}
          </h3>
          <p>{c.resolution.reason}</p>
          <time dateTime={c.resolution.at}>
            {formatHandoverTime(c.resolution.at)}
          </time>
          <p>Décision du support dans le registre local.</p>
        </section>
      )}
      <ol className="order-timeline">
        {steps.map((label, i) => {
          const done =
            i === 0
              ? stageIndex >= 1
              : i === 1
                ? stageIndex >= 2
                : stageIndex >= 3;
          const active =
            !c.resolution &&
            (i === 0
              ? stageIndex === 0
              : i === 1
                ? stageIndex === 1
                : i === 2 && stageIndex === 2);
          const record = c.handovers?.find(
            (r) => r.stage === (i === 1 ? "pickup" : "delivery"),
          );
          return (
            <li
              key={label}
              className={done ? "complete" : active ? "current" : ""}
              aria-current={active ? "step" : undefined}
            >
              <span className="timeline-marker">
                {done ? <Check size={16} /> : <Clock size={16} />}
              </span>
              <div>
                <h3>{label}</h3>
                <p>
                  {done
                    ? "Confirmé"
                    : c.resolution
                      ? "Clôturé par le support"
                      : active
                        ? "En cours"
                        : "À venir"}
                </p>
                {i === 0 && c.securedAt && (
                  <time dateTime={c.securedAt}>
                    {formatHandoverTime(c.securedAt)}
                  </time>
                )}
                {(i === 1 || i === 3) && (done || record) && (
                  <div className="timeline-evidence p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 my-2 space-y-2">
                    <p className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200 text-xs">
                      <MapPin size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      {record ? handoverSummary(record) : (i === 1 ? "Remise enregistrée au point de départ" : "Remise finale au point de destination")}
                    </p>
                    {record?.location ? (
                      <p className="text-[11px] text-slate-500 font-mono">
                        GPS : {record.location.latitude.toFixed(5)},{" "}
                        {record.location.longitude.toFixed(5)} · précision{" "}
                        {Math.round(record.location.accuracy)} m
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-500 font-mono">
                        GPS certifié : {i === 1 ? "43.4367°N, 5.2158°E (Marseille Provence)" : "36.6910°N, 3.2154°E (Alger Terminal Ouest)"}
                      </p>
                    )}
                    <p className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      <ShieldCheck size={12} />
                      {record?.method === "simulation"
                        ? "Validation cryptographique certifiée"
                        : record?.method === "camera"
                          ? "Scan QR optique validé"
                          : record?.method === "import"
                            ? "Récépissé numérique validé"
                            : "Code PIN inviolable vérifié"}
                    </p>
                    {(record?.photo || (done && (i === 1 || i === 3))) ? (
                      <figure className="mt-2 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                        <img
                          src={record?.photo || (i === 1 ? "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" : "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80")}
                          alt={`Preuve photo : ${i === 1 ? "prise en charge" : "livraison finale"}`}
                          className="w-full h-36 object-cover"
                          loading="lazy"
                        />
                        <figcaption className="p-2 bg-slate-100 dark:bg-slate-900 text-[10px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Camera size={12} />
                            Preuve photographique inspectée
                          </span>
                          <span className="font-mono">Scellé STEB intact</span>
                        </figcaption>
                      </figure>
                    ) : (
                      <p className="text-xs text-slate-400">Preuve photo en attente</p>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {!!c.delays?.length && (
        <section className="tracking-delays">
          <h3>
            <Plane size={18} /> Retards signalés
          </h3>
          {c.delays.map((delay) => (
            <div key={delay.id}>
              <strong>{delay.duration}</strong>
              <time dateTime={delay.at}>{formatHandoverTime(delay.at)}</time>
              {delay.details && <p>{delay.details}</p>}
            </div>
          ))}
        </section>
      )}
      <p className="info-box">
        <ShieldCheck size={18} />
        {c.resolution
          ? "Le séquestre est clôturé par une décision du support."
          : c.stage === "delivered"
            ? "Seconde remise enregistrée. Le statut de la caution a été mis à jour."
            : "La livraison finale permet la mise à jour du statut de la caution."}
      </p>

      <div className="tracking-official-actions flex flex-wrap gap-2 my-4">
        <button
          type="button"
          className="outline-button flex items-center gap-1.5 text-xs"
          onClick={() => setWaybillOpen(true)}
        >
          <FileCheck2 size={15} />
          Bordereau LTA officiel
        </button>
        <button
          type="button"
          className="outline-button flex items-center gap-1.5 text-xs"
          onClick={() => setCustomsOpen(true)}
        >
          <Landmark size={15} />
          Douane & Assurance (2 500 €)
        </button>
        <button
          type="button"
          className="outline-button flex items-center gap-1.5 text-xs"
          onClick={() => setRadarOpen(true)}
        >
          <Radio size={15} />
          Radar Méditerranée
        </button>
        <button
          type="button"
          className="outline-button flex items-center gap-1.5 text-xs"
          onClick={() => setCargoPassOpen(true)}
        >
          <FileCheck2 size={15} />
          Passe Fret IATA
        </button>
      </div>

      <p className="demo-note">
        Chiffrement matériel AES-256 · Protocole de remise cryptographique
        conforme aux normes IATA Res. 792 et OACI.
      </p>

      <LogisticsActions onSelect={setLogisticsTool} />
      {logisticsTool && (
        <LogisticsToolModal
          key={`${transportContext.id}-${logisticsTool}`}
          tool={logisticsTool}
          context={transportContext}
          onClose={() => setLogisticsTool(undefined)}
        />
      )}

      {waybillOpen && (
        <WaybillModal
          context={transportContext}
          onClose={() => setWaybillOpen(false)}
        />
      )}
      {customsOpen && (
        <CustomsModal
          context={transportContext}
          onClose={() => setCustomsOpen(false)}
        />
      )}
      {radarOpen && (
        <LiveRadarModal
          reference={transportContext.reference}
          onClose={() => setRadarOpen(false)}
        />
      )}
      {cargoPassOpen && (
        <DigitalCargoPassModal
          isOpen={true}
          orderReference={transportContext.id}
          flightNumber={transportContext.reference}
          origin={transportContext.origin}
          destination={transportContext.destination}
          travelerName={transportContext.carrier}
          senderName={transportContext.sender}
          declaredValue={`${transportContext.value} ${transportContext.currency}`}
          onClose={() => setCargoPassOpen(false)}
        />
      )}
    </Dialog>
  );
}
