import { Plane } from "lucide-react";

export function BrandMark() {
  return (
    <span className="bagvoyage-brand">
      <span className="bagvoyage-insignia">
        <Plane size={22} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span className="bagvoyage-wordmark">BagVoyage</span>
    </span>
  );
}
