import { useState, useEffect } from 'react';
import { Plane, Ship, Compass, Radio, CheckCircle2, Clock, MapPin, ArrowRight, RefreshCw } from 'lucide-react';
import { Dialog } from '../marketplace/Dialog';
import { useLanguage } from '../../context/LanguageContext';

export interface FlightCorridor {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  originCode: string;
  destCode: string;
  type: 'air' | 'sea';
  status: 'scheduled' | 'checkin' | 'boarding' | 'in_flight' | 'landed' | 'customs';
  progress: number;
  altitudeM: number;
  speedKmh: number;
  departureTime: string;
  arrivalTime: string;
  terminal: string;
  aircraft: string;
}

const corridors: FlightCorridor[] = [
  {
    flightNumber: 'AH1021',
    airline: 'Air Algérie',
    origin: 'Marseille Provence',
    destination: 'Alger Houari Boumediene',
    originCode: 'MRS',
    destCode: 'ALG',
    type: 'air',
    status: 'in_flight',
    progress: 68,
    altitudeM: 10600,
    speedKmh: 820,
    departureTime: '08:30',
    arrivalTime: '09:55',
    terminal: 'Terminal Ouest (Hall 1)',
    aircraft: 'Boeing 737-800 NG',
  },
  {
    flightNumber: 'TO7240',
    airline: 'Transavia France',
    origin: 'Paris Orly',
    destination: 'Alger Houari Boumediene',
    originCode: 'ORY',
    destCode: 'ALG',
    type: 'air',
    status: 'boarding',
    progress: 15,
    altitudeM: 0,
    speedKmh: 0,
    departureTime: '13:45',
    arrivalTime: '15:10',
    terminal: 'Orly 4 / Terminal Ouest',
    aircraft: 'Airbus A321neo',
  },
  {
    flightNumber: 'CL-MEDITERRANEE',
    airline: 'Corsica Linea',
    origin: 'Port de Marseille',
    destination: 'Port d’Alger',
    originCode: 'MRS-PORT',
    destCode: 'ALG-PORT',
    type: 'sea',
    status: 'in_flight',
    progress: 42,
    altitudeM: 0,
    speedKmh: 41,
    departureTime: '12:00',
    arrivalTime: '08:00 (+1j)',
    terminal: 'Gare Maritime d’Alger',
    aircraft: 'Ferry A Nepita',
  },
  {
    flightNumber: 'AH1037',
    airline: 'Air Algérie',
    origin: 'Lyon Saint-Exupéry',
    destination: 'Oran Ahmed Ben Bella',
    originCode: 'LYS',
    destCode: 'ORN',
    type: 'air',
    status: 'landed',
    progress: 100,
    altitudeM: 0,
    speedKmh: 0,
    departureTime: '06:40',
    arrivalTime: '08:15',
    terminal: 'Terminal International',
    aircraft: 'Boeing 737-800',
  },
];

export function LiveRadarModal({
  reference,
  onClose,
}: {
  reference?: string;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<FlightCorridor>(() => {
    if (reference) {
      const match = corridors.find(c => c.flightNumber.toLowerCase().includes(reference.toLowerCase()));
      if (match) return match;
    }
    return corridors[0];
  });
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const steps = [
    { label: 'Enregistrement', done: selected.progress >= 20 },
    { label: 'Embarquement', done: selected.progress >= 35 },
    { label: selected.type === 'air' ? 'En vol (Méditerranée)' : 'En mer', done: selected.progress >= 50 },
    { label: 'Atterrissage', done: selected.progress >= 85 },
    { label: 'Contrôle douanier & Remise', done: selected.progress >= 100 },
  ];

  return (
    <Dialog title={t('Corridors Méditerranée')} onClose={onClose} wide>
      <div className="bv-document-intro">
        <span className="bv-status">
          <Radio size={15} /> RADAR OPÉRATIONNEL BAGVOYAGE
        </span>
        <p>
          Suivi en temps réel des liaisons aériennes et maritimes directes France ⇄ Algérie et Méditerranée.
        </p>
      </div>

      <div className="radar-selector">
        {corridors.map((c) => (
          <button
            key={c.flightNumber}
            type="button"
            className={`radar-tab ${selected.flightNumber === c.flightNumber ? 'active' : ''}`}
            onClick={() => setSelected(c)}
          >
            {c.type === 'air' ? <Plane size={16} /> : <Ship size={16} />}
            <strong>{c.flightNumber}</strong>
            <span>{c.originCode} → {c.destCode}</span>
          </button>
        ))}
      </div>

      <div className="radar-display">
        <header className="radar-header">
          <div>
            <span className="radar-airline">{selected.airline} · {selected.aircraft}</span>
            <h2 className="radar-title">
              {selected.origin} ({selected.originCode})
              <ArrowRight size={18} className="mx-2 inline text-blue-500" />
              {selected.destination} ({selected.destCode})
            </h2>
          </div>
          <button
            type="button"
            className="outline-button flex items-center gap-1.5 text-xs"
            onClick={refresh}
            aria-label={t('Actualiser')}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{t('Actualiser')}</span>
          </button>
        </header>

        <div className="radar-metrics-grid">
          <div className="radar-metric">
            <span>{t('Altitude')}</span>
            <strong>{selected.altitudeM > 0 ? `${selected.altitudeM.toLocaleString('fr-FR')} m` : 'Sol'}</strong>
          </div>
          <div className="radar-metric">
            <span>{t('Vitesse')}</span>
            <strong>{selected.speedKmh > 0 ? `${selected.speedKmh} km/h` : 'À l’arrêt'}</strong>
          </div>
          <div className="radar-metric">
            <span>Départ</span>
            <strong>{selected.departureTime}</strong>
          </div>
          <div className="radar-metric">
            <span>Arrivée prévue</span>
            <strong>{selected.arrivalTime}</strong>
          </div>
          <div className="radar-metric col-span-2">
            <span>{t('Terminal')}</span>
            <strong>{selected.terminal}</strong>
          </div>
        </div>

        <div className="radar-progress-wrap">
          <div className="radar-progress-bar">
            <div
              className="radar-progress-fill"
              style={{ width: `${selected.progress}%` }}
            />
          </div>
          <div className="radar-steps">
            {steps.map((st, i) => (
              <div key={i} className={`radar-step ${st.done ? 'done' : ''}`}>
                <span className="radar-step-dot" />
                <span className="radar-step-label">{st.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="radar-info-box">
          <MapPin size={18} className="text-blue-500" />
          <p>
            Rendez-vous préconisé : Hall des arrivées internationales, sortie bagages après filtre douanier. Présentez votre code PIN ou scannez le QR code BagVoyage.
          </p>
        </div>
      </div>
    </Dialog>
  );
}
