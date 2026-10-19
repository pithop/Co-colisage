import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileCheck, Landmark, Printer, ShieldCheck, Scale, AlertTriangle } from 'lucide-react';
import { Dialog } from '../marketplace/Dialog';
import { useLanguage } from '../../context/LanguageContext';
import {
  customsEstimate,
  getDocuments,
  issueDocument,
  type CustomsFields,
  type TransportContext,
  type TransportDocument,
} from '../../services/transportDocuments';
import { DocumentBarcode, DocumentQr } from './DocumentCode';

function CustomsPaper({ doc }: { doc: TransportDocument<CustomsFields> }) {
  const f = doc.fields;
  const estimate = customsEstimate(f);
  return (
    <article className="bv-paper" lang="fr" dir="ltr">
      <header className="bv-paper-heading">
        <div>
          <strong className="bv-wordmark">
            BagVoyage<span> / DOUANES & ASSURANCE</span>
          </strong>
          <p>DÉCLARATION SUR L'HONNEUR & CERTIFICAT D'ASSURANCE</p>
        </div>
        <Landmark size={32} />
      </header>

      <div className="bv-document-reference">
        <strong>{doc.id}</strong>
        <span>
          Émis le {new Date(doc.issuedAt).toLocaleString('fr-FR')} · Révision {doc.revision}
        </span>
      </div>

      <div className="bv-paper-parties">
        <section>
          <h3>DÉCLARANT</h3>
          <strong>{f.declarant}</strong>
          <p>Destination : {f.destination === 'DZ' ? 'Algérie (DZ)' : f.destination === 'MA' ? 'Maroc (MA)' : f.destination === 'TN' ? 'Tunisie (TN)' : 'Union Européenne (EU)'}</p>
        </section>
        <section>
          <h3>RÉGIME DOUANIER</h3>
          <strong>{f.personal ? 'Effets personnels sans caractère commercial' : 'Marchandise déclarée standard'}</strong>
          <p>Cadre : Article 106 LF 2021 (Franchise 150 000 DZD)</p>
        </section>
        <section>
          <h3>ASSURANCE SÉQUESTRE</h3>
          <strong>Couverture Tous Risques AXA / Lloyd's</strong>
          <p>Plafond garanti : 2 500 € contre perte, vol ou avarie</p>
        </section>
      </div>

      <dl className="bv-paper-details">
        <div>
          <dt>Valeur déclarée</dt>
          <dd>{f.value.toLocaleString('fr-FR')} {f.currency}</dd>
        </div>
        <div>
          <dt>Équivalent Dinars</dt>
          <dd>{estimate.dzd !== null ? `${estimate.dzd.toLocaleString('fr-FR')} DZD` : 'Non applicable'}</dd>
        </div>
        <div>
          <dt>Franchise douanière (150 000 DZD)</dt>
          <dd>{estimate.excess === 0 ? 'Conforme franchise (0 taxe)' : `Dépassement : ${estimate.excess?.toLocaleString('fr-FR')} DZD`}</dd>
        </div>
        <div>
          <dt>Taux de change retenu</dt>
          <dd>1 EUR = {f.rate} DZD (Taux douanier indicatif)</dd>
        </div>
      </dl>

      <section className="bv-contents">
        <h3>INVENTAIRE DÉTAILLÉ DES BIENS</h3>
        <p>{f.description}</p>
      </section>

      <div className="bv-document-codes">
        <DocumentBarcode digest={doc.digest} />
        <DocumentQr id={doc.id} digest={doc.digest} />
      </div>

      <p className="bv-hash">SHA-256 · {doc.digest}</p>

      <div className="bv-signatures">
        <span>Signature du déclarant</span>
        <span>Visa contrôle bagage BagVoyage</span>
      </div>

      <footer className="bv-paper-legal">
        <strong>Engagement et réglementation</strong>
        <p>
          Le déclarant atteste sur l'honneur l'exactitude des biens transportés et certifie l'absence totale de produits prohibés (substances illicites, armes, explosifs, devises non déclarées au-delà des plafonds légaux, contrefaçons). L'assurance séquestre s'applique dès la validation mutuelle de la prise en charge par QR code.
        </p>
      </footer>
    </article>
  );
}

export function CustomsModal({
  context,
  onClose,
}: {
  context: TransportContext;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [fields, setFields] = useState<CustomsFields>({
    destination: 'DZ',
    description: context.subject,
    value: context.value ?? 100,
    currency: context.currency ?? 'EUR',
    rate: 242.5,
    personal: true,
    certified: false,
    declarant: context.sender || context.carrier || 'Déclarant BagVoyage',
  });
  const [doc, setDoc] = useState<TransportDocument<CustomsFields>>();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    getDocuments(context.id)
      .then((rows) => {
        const saved = rows.find((d) => d.kind === 'customs') as
          | TransportDocument<CustomsFields>
          | undefined;
        if (alive && saved) {
          setDoc(saved);
          setFields(saved.fields);
        }
      })
      .catch(() => {
        if (alive) setError('Erreur de chargement du dossier douane.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [context.id]);

  const estimate = customsEstimate(fields);

  return (
    <Dialog title={t('Douane & assurance')} onClose={onClose} wide>
      <div className="bv-document-intro">
        <span className="bv-status">
          <Scale size={15} /> CONFORMITÉ DOUANIÈRE TRANSFRONTALIÈRE
        </span>
        <p>
          Déclaration officielle de conformité douanière (Article 106 LF 2021) et attestation d'assurance séquestre BagVoyage.
        </p>
      </div>

      {error && (
        <p role="alert" className="bv-error">
          {error}
        </p>
      )}

      {loading ? (
        <p role="status">{t('Chargement…')}</p>
      ) : doc ? (
        <>
          <CustomsPaper doc={doc} />
          <div className="bv-document-actions">
            <button
              className="outline-button"
              onClick={() => {
                setDoc(undefined);
              }}
            >
              Modifier la déclaration
            </button>
            <button className="primary-button" onClick={() => window.print()}>
              <Printer size={17} />
              {t('Imprimer la déclaration')}
            </button>
          </div>
          {createPortal(
            <div className="bv-print-root">
              <CustomsPaper doc={doc} />
            </div>,
            document.body
          )}
        </>
      ) : (
        <form
          className="bv-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!fields.certified || busy) return;
            setBusy(true);
            setError('');
            try {
              setDoc(await issueDocument(context.id, 'customs', fields));
            } catch {
              setError("Erreur lors de l'enregistrement de la déclaration.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <fieldset disabled={busy}>
            <legend>01 / Déclarant et Destination</legend>
            <div className="bv-field-grid">
              <label>
                {t('Nom du déclarant')}
                <input
                  required
                  maxLength={120}
                  value={fields.declarant}
                  onChange={(e) =>
                    setFields((cur) => ({ ...cur, declarant: e.target.value }))
                  }
                />
              </label>
              <label>
                {t('Pays de destination')}
                <select
                  value={fields.destination}
                  onChange={(e) =>
                    setFields((cur) => ({
                      ...cur,
                      destination: e.target.value as 'DZ' | 'MA' | 'TN' | 'EU',
                    }))
                  }
                >
                  <option value="DZ">Algérie (DZ)</option>
                  <option value="MA">Maroc (MA)</option>
                  <option value="TN">Tunisie (TN)</option>
                  <option value="EU">Union Européenne (EU)</option>
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset disabled={busy}>
            <legend>02 / Biens et Valeur Déclarée</legend>
            <label>
              {t('Contenu détaillé')}
              <textarea
                required
                maxLength={1000}
                value={fields.description}
                onChange={(e) =>
                  setFields((cur) => ({ ...cur, description: e.target.value }))
                }
              />
            </label>
            <div className="bv-field-grid">
              <label>
                {t('Valeur déclarée')}
                <input
                  required
                  type="number"
                  min="1"
                  max="50000"
                  step="0.01"
                  value={fields.value || ''}
                  onChange={(e) =>
                    setFields((cur) => ({
                      ...cur,
                      value: Number(e.target.value),
                    }))
                  }
                />
              </label>
              <label>
                {t('Devise')}
                <select
                  value={fields.currency}
                  onChange={(e) =>
                    setFields((cur) => ({
                      ...cur,
                      currency: e.target.value as 'EUR' | 'DZD',
                    }))
                  }
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="DZD">DZD (Dinars)</option>
                </select>
              </label>
              <label>
                {t('Taux douanier EUR / DZD')}
                <input
                  required
                  type="number"
                  min="1"
                  max="500"
                  step="0.1"
                  value={fields.rate}
                  onChange={(e) =>
                    setFields((cur) => ({
                      ...cur,
                      rate: Number(e.target.value),
                    }))
                  }
                />
              </label>
            </div>

            <div className="customs-summary-box">
              <p>
                <strong>Équivalent estimé : </strong>
                {estimate.dzd !== null
                  ? `${estimate.dzd.toLocaleString('fr-FR')} DZD`
                  : '—'}
              </p>
              {estimate.excess !== null && (
                <p className={estimate.excess > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                  {estimate.excess === 0
                    ? 'Franchise Article 106 LF 2021 respectée (aucune taxe douanière).'
                    : `Attention : dépassement de franchise de ${estimate.excess.toLocaleString('fr-FR')} DZD (taxation forfaitaire possible).`}
                </p>
              )}
            </div>
          </fieldset>

          <label className="bv-check">
            <input
              type="checkbox"
              checked={fields.personal}
              onChange={(e) =>
                setFields((cur) => ({ ...cur, personal: e.target.checked }))
              }
            />
            <span>Biens destinés à un usage personnel ou familial sans fin commerciale.</span>
          </label>

          <label className="bv-check">
            <input
              required
              type="checkbox"
              checked={fields.certified}
              onChange={(e) =>
                setFields((cur) => ({ ...cur, certified: e.target.checked }))
              }
            />
            <span>
              Je certifie sur l'honneur l'absence de tout article prohibé ou dangereux et demande l'activation de l'assurance séquestre 2 500 €.
            </span>
          </label>

          <button
            className="primary-button"
            disabled={busy || !fields.certified}
          >
            <ShieldCheck size={18} />
            {t(busy ? 'Enregistrement…' : 'Enregistrer la déclaration')}
          </button>
        </form>
      )}
    </Dialog>
  );
}
