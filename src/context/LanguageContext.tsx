import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Languages } from 'lucide-react';
export type Language = 'fr' | 'en' | 'ar';
const translations: Record<string, [string, string]> = {
  'Explorer': ['Explore', 'استكشف'], 'Publier': ['Publish', 'انشر'], 'Messages': ['Messages', 'الرسائل'], 'Profil': ['Profile', 'الملف الشخصي'],
  'Votre profil, vos envies': ['Your profile, your plans', 'ملفك، اختياراتك'],
  'Que souhaitez-vous faire ?': ['What would you like to do?', 'ماذا تريد أن تفعل؟'],
  'Un compte, plusieurs possibilités.': ['One account, many possibilities.', 'حساب واحد، خيارات متعددة.'],
  'Dossier de transport': ['Transport documents', 'ملف النقل'], 'Bordereau de transport': ['Transport waybill', 'وثيقة النقل'],
  'Douane & assurance': ['Customs & insurance', 'الجمارك والتأمين'], 'Centre de confiance': ['Trust centre', 'مركز الثقة'],
  'Votre identité, en toute confiance.': ['Your identity, with confidence.', 'هويتك بكل ثقة.'],
  'Téléphone': ['Phone', 'الهاتف'], 'Identité': ['Identity', 'الهوية'], 'Certifications': ['Credentials', 'الاعتمادات'],
  'Vérifier mon identité': ['Verify my identity', 'التحقق من هويتي'], 'Envoyer le code SMS': ['Send SMS code', 'إرسال رمز التحقق'],
  'Vérifier le code': ['Verify code', 'تأكيد الرمز'], 'Vérification en cours': ['Verification in progress', 'التحقق جارٍ'],
  'À vérifier': ['Verification required', 'بانتظار التحقق'], 'Vérifié': ['Verified', 'تم التحقق'],
  'Enregistrer le bordereau': ['Save waybill', 'حفظ وثيقة النقل'], 'Télécharger le Bordereau PDF / Imprimer': ['Download waybill PDF / Print', 'تنزيل وثيقة النقل PDF / طباعة'],
  'Expéditeur': ['Sender', 'المرسل'], 'Transporteur': ['Carrier', 'الناقل'], 'Destinataire': ['Recipient', 'المستلم'],
  'Adresse de départ': ['Pickup address', 'عنوان الاستلام'], 'Adresse de remise': ['Delivery address', 'عنوان التسليم'],
  'Départ': ['Departure', 'المغادرة'], 'Destination': ['Destination', 'الوجهة'], 'Date de départ': ['Departure date', 'تاريخ المغادرة'],
  'Référence vol / bateau / trajet': ['Flight / ferry / journey reference', 'مرجع الرحلة أو السفينة'],
  'Contenu détaillé': ['Detailed contents', 'المحتوى بالتفصيل'], 'Poids déclaré (kg)': ['Declared weight (kg)', 'الوزن المصرح به (كغ)'],
  'Valeur déclarée': ['Declared value', 'القيمة المصرح بها'], 'Devise': ['Currency', 'العملة'],
  'Corridors Méditerranée': ['Mediterranean corridors', 'مسارات المتوسط'], 'Suivi du transport': ['Transport tracking', 'تتبع النقل'],
  'Actualiser': ['Refresh', 'تحديث'], 'En attente de données opérateur': ['Awaiting operator data', 'بانتظار بيانات المشغل'],
  'Altitude': ['Altitude', 'الارتفاع'], 'Vitesse': ['Speed', 'السرعة'], 'Terminal': ['Terminal', 'المحطة'],
  'Déclaration douanière': ['Customs declaration', 'التصريح الجمركي'], 'Enregistrer la déclaration': ['Save declaration', 'حفظ التصريح'],
  'Imprimer la déclaration': ['Print declaration', 'طباعة التصريح'], 'Nom du déclarant': ['Declarant name', 'اسم المصرح'],
  'Pays de destination': ['Destination country', 'بلد الوجهة'], 'Taux douanier EUR / DZD': ['Customs EUR / DZD rate', 'سعر الصرف الجمركي يورو / دينار'],
  'Assurance marchandises': ['Goods insurance', 'تأمين البضائع'], 'Aucune police active': ['No active policy', 'لا توجد وثيقة تأمين سارية'],
  'Chargement…': ['Loading…', 'جارٍ التحميل…'], 'Enregistrement…': ['Saving…', 'جارٍ الحفظ…'], 'Fermer': ['Close', 'إغلاق'],
};
const LanguageContext = createContext<{ language: Language; setLanguage: (l: Language) => void; t: (s: string) => string }>({ language: 'fr', setLanguage: () => {}, t: s => s });
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try { const l = localStorage.getItem('bv-language'); return l === 'ar' || l === 'en' ? l : 'fr'; } catch { return 'fr'; }
  });
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('bv-language', language); } catch { /* Language remains usable for this session. */ }
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t: s => language === 'fr' ? s : translations[s]?.[language === 'en' ? 0 : 1] ?? s }}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);
export function LanguageSelector({ location }: { location: 'header' | 'footer' }) {
  const { language, setLanguage } = useLanguage();
  return <label className="bv-language"><Languages size={16} aria-hidden="true" /><span className="sr-only">{location === 'header' ? 'Langue de l’application' : 'Langue du pied de page'}</span><select value={language} onChange={e => setLanguage(e.target.value as Language)}><option value="fr">FR · Français</option><option value="en">EN · English</option><option value="ar">AR · العربية</option></select></label>;
}
