import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileCheck2, Printer, ShieldCheck } from 'lucide-react';
import { Dialog } from '../marketplace/Dialog';
import { useLanguage } from '../../context/LanguageContext';
import { getDocuments, issueDocument, type TransportContext, type TransportDocument, type WaybillFields } from '../../services/transportDocuments';
import { DocumentBarcode, DocumentQr } from './DocumentCode';

function WaybillPaper({ doc }: { doc: TransportDocument<WaybillFields> }) {
  const f = doc.fields;
  return <article className="bv-paper" lang="fr" dir="ltr">
    <header className="bv-paper-heading"><div><strong className="bv-wordmark">BagVoyage<span> / LOGISTICS</span></strong><p>BORDEREAU DE TRANSPORT</p></div><FileCheck2 size={32} /></header>
    <div className="bv-document-reference"><strong>{doc.id}</strong><span>Émis le {new Date(doc.issuedAt).toLocaleString('fr-FR')} · Révision {doc.revision}</span></div>
    <div className="bv-paper-parties">{[['01 / EXPÉDITEUR', f.sender, f.senderAddress], ['02 / TRANSPORTEUR', f.carrier, f.reference], ['03 / DESTINATAIRE', f.recipient, f.recipientAddress]].map(([label, name, address]) => <section key={label}><h3>{label}</h3><strong>{name}</strong><p>{address}</p></section>)}</div>
    <dl className="bv-paper-details"><div><dt>Itinéraire</dt><dd>{f.origin} → {f.destination}</dd></div><div><dt>Départ prévu</dt><dd>{f.date}</dd></div><div><dt>Poids déclaré</dt><dd>{f.weight} kg · pesée à confirmer à la prise en charge</dd></div><div><dt>Valeur déclarée</dt><dd>{f.value.toLocaleString('fr-FR')} {f.currency}</dd></div></dl>
    <section className="bv-contents"><h3>CONTENU DÉCLARÉ</h3><p>{f.description}</p></section>
    <div className="bv-document-codes"><DocumentBarcode digest={doc.digest} /><DocumentQr id={doc.id} digest={doc.digest} /></div>
    <p className="bv-hash">SHA-256 · {doc.digest}</p>
    <div className="bv-signatures"><span>Signature de l’expéditeur</span><span>Signature du transporteur</span><span>Signature du destinataire</span></div>
    <footer className="bv-paper-legal"><strong>Conditions de transport</strong><p>Ce bordereau consigne les déclarations des parties et accompagne leur accord. Il ne constitue ni une lettre de transport aérien (LTA) émise par une compagnie, ni un titre douanier, ni un certificat d’assurance. La Convention de Montréal de 1999 ou le régime de Varsovie peut régir la responsabilité du transporteur aérien selon le trajet et les États concernés. Les bagages accompagnés restent soumis aux conditions de la compagnie et aux formalités douanières. Le transport maritime relève de son propre régime.</p><p>Les signatures des parties et les preuves de remise complètent ce document. L’empreinte identifie son contenu ; elle ne certifie pas l’identité des déclarants.</p><a href="https://www.iata.org/en/programs/passenger/mc99/">Référence : transport aérien international — Convention de Montréal</a></footer>
  </article>;
}
export function WaybillModal({ context, onClose }: { context: TransportContext; onClose: () => void }) {
  const { t } = useLanguage();
  const [fields, setFields] = useState<WaybillFields>({ sender: context.sender ?? 'Expéditeur BagVoyage', senderAddress: context.senderAddress ?? 'Marseille (MRS) · Prise en charge', carrier: context.carrier ?? 'Transporteur Vérifié', recipient: context.recipient ?? 'Destinataire Confirmé', recipientAddress: context.recipientAddress ?? 'Alger (ALG) · Livraison convenante', origin: context.origin ?? 'Marseille', destination: context.destination ?? 'Alger', reference: context.reference ?? 'AH1021', date: context.date ?? new Date().toISOString().split('T')[0], description: context.subject, weight: context.weight ?? 5, value: context.value ?? 100, currency: context.currency ?? 'EUR' });
  const [doc, setDoc] = useState<TransportDocument<WaybillFields>>();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [certified, setCertified] = useState(false);
  useEffect(() => {
    let alive = true;
    getDocuments(context.id).then(rows => {
      const saved = rows.find(d => d.kind === 'waybill') as TransportDocument<WaybillFields> | undefined;
      if (alive && saved) { setDoc(saved); setFields(saved.fields); }
    }).catch(() => { if (alive) setError('Impossible de charger le dossier. Réessayez en rouvrant le bordereau.'); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [context.id]);
  const change = <K extends keyof WaybillFields>(key: K, value: WaybillFields[K]) => setFields(current => ({ ...current, [key]: value }));
  return <Dialog title={t('Bordereau de transport')} onClose={onClose} wide>
    <div className="bv-document-intro"><span className="bv-status"><FileCheck2 size={15} /> BAGVOYAGE / DOCUMENTS</span><p>Les informations du colis, les parties et les références du voyage réunies dans un document imprimable.</p></div>
    {error && <p role="alert" className="bv-error">{error}</p>}
    {loading ? <p role="status">{t('Chargement…')}</p> : doc ? <><WaybillPaper doc={doc} /><div className="bv-document-actions"><button className="outline-button" onClick={() => { setDoc(undefined); setCertified(false); }}>Créer une nouvelle révision</button><button className="primary-button" onClick={() => window.print()}><Printer size={17} />{t('Télécharger le Bordereau PDF / Imprimer')}</button></div>{createPortal(<div className="bv-print-root"><WaybillPaper doc={doc} /></div>, document.body)}</> : <form className="bv-form" onSubmit={async e => {
      e.preventDefault(); if (!certified || busy) return;
      if (!Number.isFinite(fields.weight) || fields.weight <= 0 || !Number.isFinite(fields.value) || fields.value < 0) { setError('Vérifiez le poids et la valeur déclarée.'); return; }
      setBusy(true); setError('');
      try { setDoc(await issueDocument(context.id, 'waybill', fields)); } catch { setError('Le bordereau n’a pas été enregistré. Réessayez.'); } finally { setBusy(false); }
    }}>
      <fieldset disabled={busy}><legend>01 / Parties et itinéraire</legend><div className="bv-field-grid">{([
        ['sender','Expéditeur'], ['senderAddress','Adresse de départ'], ['carrier','Transporteur'], ['recipient','Destinataire'], ['recipientAddress','Adresse de remise'], ['origin','Départ'], ['destination','Destination'], ['reference','Référence vol / bateau / trajet'], ['date','Date de départ'],
      ] as const).map(([key,label]) => <label key={key}>{t(label)}<input required maxLength={180} type={key === 'date' ? 'date' : 'text'} value={fields[key]} onChange={e => change(key, e.target.value)} /></label>)}</div></fieldset>
      <fieldset disabled={busy}><legend>02 / Marchandises</legend><label>{t('Contenu détaillé')}<textarea required maxLength={1500} value={fields.description} onChange={e => change('description', e.target.value)} /></label><div className="bv-field-grid"><label>{t('Poids déclaré (kg)')}<input required type="number" min="0.01" max="10000" step="0.01" value={fields.weight || ''} onChange={e => change('weight', e.target.valueAsNumber)} /></label><label>{t('Valeur déclarée')}<input required type="number" min="0" max="10000000" step="0.01" value={Number.isNaN(fields.value) ? '' : fields.value} onChange={e => change('value', e.target.valueAsNumber)} /></label><label>{t('Devise')}<select value={fields.currency} onChange={e => change('currency', e.target.value as 'EUR' | 'DZD')}><option>EUR</option><option>DZD</option></select></label></div></fieldset>
      <label className="bv-check"><input required type="checkbox" checked={certified} onChange={e => setCertified(e.target.checked)} /><span>Je confirme l’exactitude des informations déclarées. Le poids sera contrôlé lors de la prise en charge.</span></label>
      <button className="primary-button" disabled={busy || !certified || Boolean(error && loading)}><ShieldCheck size={18} />{t(busy ? 'Enregistrement…' : 'Enregistrer le bordereau')}</button>
    </form>}
  </Dialog>;
}
