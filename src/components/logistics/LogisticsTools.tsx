import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  Box,
  FileWarning,
  Landmark,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import type { TransportContext } from "../../services/transportDocuments";
import { AirportLockersModal } from "./AirportLockersModal";
import { CustomsHsClassifierModal } from "./CustomsHsClassifierModal";
import { PirLitigationKitModal } from "./PirLitigationKitModal";
import { SecurityStebSealModal } from "./SecurityStebSealModal";
import { VolumetricCalculatorModal } from "./VolumetricCalculatorModal";

export type LogisticsTool = "seal" | "volume" | "lockers" | "hs" | "pir";
const tools = [
  {
    id: "seal",
    label: "Scellé OACI STEB",
    detail: "Inspection et intégrité",
    Icon: ShieldCheck,
  },
  {
    id: "volume",
    label: "Calculateur volumétrique",
    detail: "Poids et gabarit",
    Icon: Box,
  },
  {
    id: "hs",
    label: "Douane SH",
    detail: "Codes et franchises",
    Icon: Landmark,
  },
  {
    id: "lockers",
    label: "Consignes aéroport",
    detail: "Remise asynchrone",
    Icon: MapPin,
  },
  {
    id: "pir",
    label: "Dossier litige PIR",
    detail: "Réclamation bagage",
    Icon: FileWarning,
  },
] as const;

export function LogisticsActions({
  onSelect,
}: {
  onSelect: (tool: LogisticsTool) => void;
}) {
  return (
    <section
      className="bv-logistics-actions"
      aria-label="Outils de cette expédition"
    >
      <h3>Préparer & protéger votre envoi</h3>
      <div>
        {tools.map(({ id, label, detail, Icon }) => (
          <button
            type="button"
            key={id}
            onClick={() => onSelect(id)}
            aria-label={label}
          >
            <span className="bv-logistics-action-icon">
              <Icon size={19} />
            </span>
            <span>
              <strong>{label}</strong>
              <small>{detail}</small>
            </span>
            <ArrowUpRight size={15} />
          </button>
        ))}
      </div>
    </section>
  );
}

export function LogisticsToolModal({
  tool,
  context,
  onClose,
}: {
  tool: LogisticsTool;
  context: TransportContext;
  onClose: () => void;
}) {
  const props = { context, onClose };
  const content =
    tool === "seal" ? (
      <SecurityStebSealModal {...props} />
    ) : tool === "volume" ? (
      <VolumetricCalculatorModal {...props} />
    ) : tool === "lockers" ? (
      <AirportLockersModal {...props} />
    ) : tool === "hs" ? (
      <CustomsHsClassifierModal {...props} />
    ) : (
      <PirLitigationKitModal {...props} />
    );
  return createPortal(content, document.body);
}
