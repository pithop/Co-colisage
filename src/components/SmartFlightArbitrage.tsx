import { useEffect, useId, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Package, Plane, RefreshCw, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { euro, type PurchaseRequest } from "../data/marketplace";
import {
  calculateProfit, estimatedFlightOffers, filterOpportunities, flightArbitrageApi, matchFlight,
  type ArbitrageSnapshot, type MatchedOpportunity,
} from "../services/flightArbitrageApi";
import "../arbitrage.css";

interface Props {
  requests: PurchaseRequest[];
  reservedRequestIds?: string[];
  initialRouteId?: string;
  onSelectDeal: (opportunity: MatchedOpportunity) => void;
  onReserveDeal: (opportunity: MatchedOpportunity) => Promise<void>;
}
const dateLabel = (value: string) => new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });

export function SmartFlightArbitrage({ requests, reservedRequestIds = [], initialRouteId = "mrs-alg", onSelectDeal, onReserveDeal }: Props) {
  const id = useId();
  const [snapshot, setSnapshot] = useState<ArbitrageSnapshot>(() => ({
    source: "estimate", updatedAt: new Date().toISOString(), offers: estimatedFlightOffers(), opportunities: [],
  }));
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [minimum, setMinimum] = useState("");
  const [sort, setSort] = useState<"profit" | "roi">("profit");
  const [routeId, setRouteId] = useState(initialRouteId);
  const [offerId, setOfferId] = useState("");
  const [excluded, setExcluded] = useState<string[]>([]);
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState("");
  const reservedKey = [...reservedRequestIds].sort().join("|");
  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    const refresh = async () => {
      controller?.abort();
      const current = new AbortController();
      controller = current;
      const timeout = window.setTimeout(() => current.abort(), 12000);
      setLoading(true);
      try {
        const next = await flightArbitrageApi.scan(requests, reservedRequestIds, current.signal);
        if (active && !current.signal.aborted) { setSnapshot(next); setError(""); }
      } catch {
        if (active && controller === current) setError("L’actualisation a échoué. Réessayez pour confirmer les tarifs.");
      } finally {
        window.clearTimeout(timeout);
        if (active && controller === current) setLoading(false);
      }
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), 60000);
    return () => { active = false; controller?.abort(); window.clearInterval(timer); };
  }, [requests, reservedKey, refreshKey]);

  const matches = useMemo(() => snapshot.offers.map(flight => matchFlight(flight, requests, reservedRequestIds)),
    [snapshot, requests, reservedKey]);
  const filtered = filterOpportunities(matches, { origin, destination, minNetProfit: minimum === "" ? undefined : Number(minimum), sort });
  const routes = [...new Set(snapshot.offers.map(flight => flight.routeId))];
  const preferred = filtered.filter(item => item.flight.routeId === routeId);
  const base = preferred.find(item => item.flight.id === offerId)
    ?? [...preferred].sort((a, b) => a.flight.flightPrice - b.flight.flightPrice)[0] ?? filtered[0];
  const flight = base?.flight;
  const selectedRequests = base ? requests.filter(request => base.requestIds.includes(request.id) && !excluded.includes(request.id)) : [];
  const calculation = flight ? calculateProfit(selectedRequests.map(request => request.reward), flight.flightPrice, flight.baggageCost, flight.fees) : undefined;
  const deal: MatchedOpportunity | undefined = base && calculation ? {
    ...base, ...calculation, requestIds: selectedRequests.map(request => request.id),
    ordersCount: selectedRequests.length, ordersDescription: selectedRequests.map(request => request.title).join(" · "),
    totalWeightKg: selectedRequests.reduce((sum, request) => sum + Math.round(request.weightKg! * 1000), 0) / 1000,
    clientName: selectedRequests[0]?.buyer ?? base.clientName, clientAvatar: selectedRequests[0]?.buyerAvatar ?? "",
  } : undefined;
  const uniqueRoutes = filtered.filter((item, index) => filtered.findIndex(other => other.flight.routeId === item.flight.routeId) === index);
  const choose = (next: MatchedOpportunity) => { setRouteId(next.flight.routeId); setOfferId(next.flight.id); setExcluded([]); setError(""); };
  const reserve = async () => {
    if (!deal || !deal.ordersCount || reserving) return;
    setReserving(true); setError("");
    try { await onReserveDeal(deal); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Le groupe de missions n’a pas pu être préparé."); }
    finally { setReserving(false); }
  };
  return (
    <section className="flight-arbitrage" aria-labelledby={`${id}-title`}>
      <header className="arbitrage-heading">
        <div><span className="arbitrage-eyebrow"><Plane size={15} /> LE BON VOL, LES BONNES MISSIONS</span><h2 id={`${id}-title`}>Un billet. Plusieurs possibilités.</h2><p>Les demandes compatibles avec votre trajet, réunies dans un seul calcul.</p></div>
        <div className="arbitrage-source"><span>{snapshot.source === "live" ? "Tarifs fournisseur" : "Tarifs indicatifs"}</span><small>Actualisé à {new Date(snapshot.updatedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</small><button aria-label="Actualiser les vols" onClick={() => setRefreshKey(value => value + 1)} disabled={loading}><RefreshCw size={15} />Actualiser</button></div>
      </header>
      <div className="arbitrage-filters">
        <label>Ville de départ<select aria-label="Ville de départ" value={origin} onChange={event => { setOrigin(event.target.value); setExcluded([]); }}><option value="">Toutes les villes</option>{[...new Set(snapshot.offers.map(item => item.origin))].sort().map(city => <option key={city}>{city}</option>)}</select></label>
        <label>Ville d’arrivée<select aria-label="Ville d’arrivée" value={destination} onChange={event => { setDestination(event.target.value); setExcluded([]); }}><option value="">Toutes les villes</option>{[...new Set(snapshot.offers.map(item => item.destination))].sort().map(city => <option key={city}>{city}</option>)}</select></label>
        <label>Gain net minimum (€)<input type="number" step="1" placeholder="Aucun minimum" value={minimum} onChange={event => { setMinimum(event.target.value); setExcluded([]); }} /></label>
        <label>Trier les vols<select aria-label="Trier les vols" value={sort} onChange={event => setSort(event.target.value as "profit" | "roi")}><option value="profit">Gain net décroissant</option><option value="roi">ROI décroissant</option></select></label>
      </div>
      {(error || snapshot.error) && <p className="arbitrage-error" role="alert">{error || snapshot.error}</p>}
      {!deal || !flight ? <div className="arbitrage-empty"><SlidersHorizontal size={28} /><h3>Aucun vol ne correspond à ces critères.</h3><p>Essayez un autre trajet ou un gain minimum plus bas.</p><button onClick={() => { setOrigin(""); setDestination(""); setMinimum(""); }}>Réinitialiser les filtres</button></div> : (
        <div className="arbitrage-workspace">
          <div className="arbitrage-itinerary">
            <div className="arbitrage-section-title"><span>01</span><h3>Choisissez votre départ</h3></div>
            <label className="sr-only" htmlFor={`${id}-route`}>Itinéraire du vol</label>
            <select id={`${id}-route`} value={flight.routeId} onChange={event => { setRouteId(event.target.value); setOfferId(""); setExcluded([]); setOrigin(""); setDestination(""); setMinimum(""); }}>
              {routes.map(key => { const offer = snapshot.offers.find(item => item.routeId === key)!; return <option key={key} value={key}>{offer.origin} → {offer.destination} · {offer.originCode}–{offer.destinationCode}</option>; })}
            </select>
            <div className="arbitrage-dates" role="group" aria-label="Date de départ et prix du billet">
              {matches.filter(item => item.flight.routeId === flight.routeId).map(item => <button key={item.id} aria-pressed={item.id === base?.id} onClick={() => choose(item)}><span>{dateLabel(item.flight.departureAt)}</span><strong>{euro(item.flight.flightPrice)}</strong><small>{item.flight.airline}</small>{item.id === base?.id && <Check size={14} aria-hidden="true" />}</button>)}
            </div>
            <div className="arbitrage-section-title"><span>02</span><h3>Vos missions sur ce corridor</h3></div>
            <p className="arbitrage-caption">Dates compatibles · {flight.availableKg} kg disponibles · commissions voyageur</p>
            <div className="arbitrage-missions">
              {requests.filter(request => base?.requestIds.includes(request.id)).map(request => (
                <label key={request.id} className="arbitrage-mission">
                  <input type="checkbox" checked={!excluded.includes(request.id)} onChange={() => setExcluded(current => current.includes(request.id) ? current.filter(key => key !== request.id) : [...current, request.id])} aria-label={`Ajouter ${request.title}, commission ${request.reward} euros`} />
                  <span className="mission-icon">{request.kind === "parcel" ? <Package size={19} /> : <ShoppingBag size={19} />}</span>
                  <span><strong>{request.title}</strong><small>{request.buyer} · {request.weightKg} kg · {request.kind === "parcel" ? "Colis" : "Shop & Go"}</small></span>
                  <b>+{euro(request.reward)}</b>
                </label>
              ))}
              {!base?.ordersCount && <p className="arbitrage-caption">Aucune demande disponible pour ce départ.</p>}
            </div>
            <p className="arbitrage-caption">{deal.ordersCount} mission{deal.ordersCount > 1 ? "s" : ""} sélectionnée{deal.ordersCount > 1 ? "s" : ""} · {deal.totalWeightKg.toLocaleString("fr-FR")} kg à transporter</p>
          </div>
          <aside className="arbitrage-balance" aria-label="Bilan de votre voyage">
            <div className="arbitrage-flight-pair"><div><strong>{flight.originCode}</strong><span>{flight.origin}</span></div><Plane size={22} /><div><strong>{flight.destinationCode}</strong><span>{flight.destination}</span></div></div>
            <p className="arbitrage-caption">{dateLabel(flight.departureAt)} · {flight.airline} · Aller simple</p>
            <dl><div><dt>Commissions voyageur</dt><dd>+{euro(deal.totalOrderReward)}</dd></div><div><dt>Billet d’avion</dt><dd>−{euro(flight.flightPrice)}</dd></div>{deal.additionalCosts > 0 && <div><dt>Bagage et frais</dt><dd>−{euro(deal.additionalCosts)}</dd></div>}</dl>
            <div className="arbitrage-profit" role="status" aria-live="polite" aria-atomic="true"><span>{deal.netProfit >= 0 ? "Gain net estimé" : "Reste à financer"}</span><strong>{deal.netProfit > 0 ? "+" : deal.netProfit < 0 ? "−" : ""}{euro(Math.abs(deal.netProfit))}</strong><p>{deal.netProfit >= 0 ? "Billet couvert par vos commissions." : "Les missions ne couvrent pas encore le billet."}</p><small>ROI {deal.roi === null ? "non applicable" : `${deal.roi >= 0 ? "+" : ""}${deal.roi.toLocaleString("fr-FR")}%`}</small></div>
            <button className="arbitrage-reserve" disabled={!deal.ordersCount || reserving || loading || Date.parse(flight.expiresAt) <= Date.now()} onClick={() => void reserve()}>{reserving ? "Préparation des discussions…" : "Réserver et sécuriser le deal"}<ArrowUpRight size={17} /></button>
            <button className="arbitrage-details" disabled={!deal.ordersCount} onClick={() => onSelectDeal(deal)}>Choisir ce voyage<ArrowRight size={15} /></button>
            <p className="arbitrage-caption">Ouvre les discussions pour confirmer les missions. Aucun billet acheté ni fonds bloqués à cette étape.</p>
          </aside>
        </div>
      )}
      <div className="arbitrage-results-heading"><h3>Comparez les corridors</h3><span>{uniqueRoutes.length} itinéraires · {filtered.length} départs</span></div>
      <div className="arbitrage-results" aria-label="Vols classés par rentabilité">
        {uniqueRoutes.map(item => <button key={item.flight.routeId} aria-pressed={flight?.routeId === item.flight.routeId} onClick={() => choose(item)}><span><strong>{item.flight.origin} <ArrowRight size={13} /> {item.flight.destination}</strong><small>{item.flight.airline} · {euro(item.flight.flightPrice)} · {item.ordersCount} missions</small></span><span className={item.netProfit >= 0 ? "positive" : ""}><b>{item.netProfit > 0 ? "+" : ""}{euro(item.netProfit)}</b><small>ROI {item.roi === null ? "n/a" : `${item.roi >= 0 ? "+" : ""}${Math.round(item.roi)}%`}</small></span></button>)}
      </div>
      <footer className="arbitrage-footnote">{snapshot.source === "estimate" ? "Catalogue de démonstration : prix, profils et missions illustratifs. Les tarifs et la franchise bagage restent à confirmer." : "Prix reçus du fournisseur, à reconfirmer avant l’achat du billet."} Gain = commissions voyageur − billet − bagage et frais connus. Le budget d’achat est distinct de la rémunération. Les frais non communiqués ne sont pas inclus.</footer>
    </section>
  );
}
