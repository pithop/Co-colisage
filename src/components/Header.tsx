import React, { useEffect, useRef, useState } from 'react';
import { Plane, Package, Search, Bell, Smartphone, Monitor, ShieldCheck, CheckCircle2, X, Menu, Building2, LogOut, ChevronDown, ShoppingBag, Plus, ArrowUpRight } from 'lucide-react';
import { NotificationItem, MainPillar } from '../types';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

interface HeaderProps {
  activePillar: MainPillar;
  onSelectPillar: (pillar: MainPillar) => void;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  notifications: NotificationItem[];
  onOpenPublishModal: (initialTab?: MainPillar) => void;
  onOpenHowItWorks: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  pillarCounts?: Record<MainPillar, number>;
}

const pillars = [
  { id: 'voyageur', label: 'Voyageur', Icon: Plane, badge: 'bg-blue-50 text-blue-700 ring-blue-100', active: 'text-blue-700' },
  { id: 'expediteur', label: 'Expéditeur', Icon: Package, badge: 'bg-amber-50 text-amber-800 ring-amber-100', active: 'text-amber-700' },
  { id: 'destinataire', label: 'Destinataire', Icon: ShoppingBag, badge: 'bg-emerald-50 text-emerald-700 ring-emerald-100', active: 'text-emerald-700' },
] as const;
const dashboards = [
  { id: 'voyageur', label: 'Espace Voyageur', Icon: Plane },
  { id: 'transporteur', label: 'Espace Transporteur Pro', Icon: Building2 },
  { id: 'expediteur', label: 'Mes Commandes', Icon: Package },
] as const;
const roles: { id: UserRole; label: string }[] = [
  { id: 'voyageur', label: 'Voyageur' },
  { id: 'transporteur_pro', label: 'Transp. Pro' },
  { id: 'expediteur', label: 'Expéditeur' },
];
const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';
const iconButton = `inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-900 motion-safe:active:scale-95 motion-reduce:transition-none ${focus}`;

export const Header: React.FC<HeaderProps> = ({ activePillar, onSelectPillar, isPhoneFrame, onTogglePhoneFrame, notifications, onOpenPublishModal, onOpenHowItWorks, searchQuery, onSearchChange, pillarCounts }) => {
  const { user, isAuthenticated, logout, switchRole, openAuthModal, setActiveDashboard } = useAuth();
  const [panel, setPanel] = useState<'notifications' | 'profile' | 'mobile' | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const unreadCount = notifications.filter(n => n.unread).length;
  const compact = isPhoneFrame;

  useEffect(() => {
    if (!panel) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const panelElement = headerRef.current?.querySelector(`#header-${panel}`);
      if (!panelElement?.contains(target) && !triggerRef.current?.contains(target)) setPanel(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setPanel(null); triggerRef.current?.focus(); }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [panel]);

  const togglePanel = (next: typeof panel, event: React.MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = event.currentTarget;
    setPanel(current => current === next ? null : next);
  };
  const publishButton = (mobile = false) => (
    <button type="button" onClick={() => { onOpenPublishModal(activePillar); setPanel(null); }} className={`${mobile ? 'flex w-full' : compact ? 'hidden' : 'hidden md:flex'} min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(15,23,42,0.15)] transition duration-200 hover:bg-blue-700 hover:shadow-lg motion-safe:active:scale-[0.98] motion-reduce:transition-none ${focus}`}><Plus className="h-4 w-4" aria-hidden="true" />Publier un trajet / colis</button>
  );
  const searchField = (mobile = false) => (
    <div className={`relative ${mobile ? 'w-full' : 'w-48 xl:w-56'}`}>
      <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" aria-hidden="true" />
      <input type="search" aria-label="Rechercher une annonce" placeholder="Une ville, un produit…" value={searchQuery} onChange={event => onSearchChange(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200/80 bg-slate-50/80 pl-9 pr-9 text-xs text-slate-800 outline-none transition placeholder:text-slate-500 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 [&::-webkit-search-cancel-button]:appearance-none" />
      {searchQuery && <button type="button" aria-label="Effacer la recherche" onClick={() => onSearchChange('')} className={`absolute right-0 top-0 flex h-10 w-9 items-center justify-center rounded-xl text-slate-500 ${focus}`}><X className="h-3.5 w-3.5" /></button>}
    </div>
  );

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-white/80 bg-white/85 shadow-[0_4px_30px_-12px_rgba(15,23,42,0.16)] backdrop-blur-xl">
      <div className="bg-[#0A1128] px-4 py-2 text-[10px] text-slate-300 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <p className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 leading-relaxed">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />Stripe Connect Escrow Actif</span>
            <span className={compact ? 'hidden' : 'hidden sm:inline'}>•</span><span>Marseille (MRS) ⇄ Alger (ALG)</span><span>•</span><span>Paiement garanti PIN</span>
          </p>
          <button type="button" onClick={onTogglePhoneFrame} aria-label={isPhoneFrame ? 'Passer en plein écran' : 'Simuler la vue mobile'} aria-pressed={isPhoneFrame} title={isPhoneFrame ? 'Plein écran' : 'Aperçu mobile'} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white ${focus}`}>
            {isPhoneFrame ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-4 sm:px-6">
        <a href="#hero" aria-label="BagVoyage / Shop&Go — Accueil" className={`flex min-w-0 items-center gap-2.5 rounded-xl ${focus}`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-white/20 bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-md"><Plane className="h-5 w-5" aria-hidden="true" /></span>
          <span className="min-w-0"><span className="block text-lg font-bold leading-tight tracking-[-0.05em] text-slate-900">BagVoyage<span className={compact ? 'hidden' : 'hidden lg:inline'}><span className="mx-2 font-light text-slate-300">/</span><span className="font-medium">Shop<span className="text-blue-600">&</span>Go</span></span></span><span className={`mt-0.5 block text-[9px] font-medium uppercase tracking-[0.16em] text-slate-500 ${compact ? '' : 'lg:hidden'}`}>Shop&Go</span><span className={compact ? 'hidden' : 'mt-1 hidden text-[10px] text-slate-500 lg:block'}>Vos envies voyagent avec nous.</span></span>
        </a>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {publishButton()}
          <button type="button" onClick={event => togglePanel('notifications', event)} aria-label={`Notifications, ${unreadCount} non lues`} aria-expanded={panel === 'notifications'} aria-controls="header-notifications" className={`relative ${iconButton}`}><Bell className="h-[18px] w-[18px]" />{unreadCount > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-semibold text-white ring-2 ring-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}</button>
          {isAuthenticated && user ? (
            <button type="button" onClick={event => togglePanel('profile', event)} aria-label={`Compte de ${user.name}`} aria-expanded={panel === 'profile'} aria-controls="header-profile" className={`flex min-h-10 items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 p-1 pr-2 transition hover:border-slate-300 hover:shadow-sm ${focus}`}>
              <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" /><span className={compact ? 'hidden' : 'hidden max-w-24 truncate text-xs font-semibold text-slate-700 sm:inline'}>{user.name.split(' ')[0]}</span><ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${panel === 'profile' ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <div className="flex items-center gap-1"><button type="button" onClick={openAuthModal} className={`${compact ? 'hidden' : 'hidden sm:block'} min-h-10 rounded-xl px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 ${focus}`}>Connexion</button><button type="button" onClick={openAuthModal} className={`min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 shadow-sm transition hover:border-blue-300 hover:text-blue-700 ${focus}`}>S'inscrire</button></div>
          )}
          <button type="button" onClick={event => togglePanel('mobile', event)} aria-label={panel === 'mobile' ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={panel === 'mobile'} aria-controls="header-mobile" className={`${iconButton} ${compact ? '' : 'lg:hidden'}`}>{panel === 'mobile' ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>

        {panel === 'notifications' && <section id="header-notifications" aria-label="Notifications" className="absolute right-4 top-full z-50 w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-modal backdrop-blur-xl sm:right-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3"><h2 className="text-sm font-semibold text-slate-900">Notifications <span className="ml-1 text-xs font-medium text-blue-600">{unreadCount} nouvelles</span></h2><button type="button" aria-label="Fermer les notifications" onClick={() => { setPanel(null); triggerRef.current?.focus(); }} className={iconButton}><X className="h-4 w-4" /></button></div>
          <div className="max-h-[50vh] overflow-y-auto overscroll-contain">{notifications.length === 0 ? <p className="py-8 text-center text-xs text-slate-500">Vous êtes à jour. Aucune notification.</p> : notifications.map(n => <div key={n.id} className={`flex gap-3 rounded-xl px-2 py-3 ${n.unread ? 'bg-blue-50/50' : ''}`}><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><div><p className="text-xs font-semibold text-slate-800">{n.title}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">{n.description}</p><p className="mt-1 text-[10px] text-slate-500">{n.time}</p></div></div>)}</div>
        </section>}

        {panel === 'profile' && user && <section id="header-profile" aria-label="Votre compte" className="absolute right-4 top-full z-50 max-h-[65vh] w-[calc(100%-2rem)] max-w-xs overflow-y-auto overscroll-contain rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-modal backdrop-blur-xl sm:right-6">
          <div className="flex items-center gap-3 border-b border-slate-100 p-2 pb-4"><img src={user.avatar} alt="" className="h-11 w-11 rounded-full object-cover" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{user.name}</p><p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p><span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700"><ShieldCheck className="h-3 w-3" />{user.kycStatus === 'verified' ? 'Identité vérifiée · Stripe' : user.kycStatus === 'pending' ? 'Vérification en cours' : 'Identité à vérifier'}</span></div></div>
          <div className="space-y-1 py-2">{dashboards.map(({ id, label, Icon }) => <button type="button" key={id} onClick={() => { setActiveDashboard(id); setPanel(null); }} className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-700 ${focus}`}><Icon className="h-4 w-4" />{label}<ArrowUpRight className="ml-auto h-3.5 w-3.5 text-slate-400" /></button>)}</div>
          <div className="border-t border-slate-100 py-3"><p className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-wider text-slate-500">Changer de profil démo</p><div className="grid grid-cols-3 gap-1">{roles.map(role => <button type="button" key={role.id} onClick={() => { switchRole(role.id); setPanel(null); }} aria-pressed={user.role === role.id} className={`min-h-10 rounded-lg text-[10px] font-medium transition ${user.role === role.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'} ${focus}`}>{role.label}</button>)}</div></div>
          <button type="button" onClick={() => { logout(); setPanel(null); }} className={`flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-xs font-medium text-red-600 transition hover:bg-red-50 ${focus}`}><LogOut className="h-4 w-4" />Se déconnecter</button>
        </section>}
      </div>

      <div className="border-t border-slate-200/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-3 py-2 sm:px-6">
          <nav aria-label="Choisir votre espace" className={`grid min-w-0 grid-cols-3 gap-1 rounded-2xl border border-slate-200/70 bg-slate-100/70 p-1 ${compact ? 'w-full' : 'w-full lg:w-auto'}`}>
            {pillars.map(({ id, label, Icon, badge, active }) => <button type="button" key={id} onClick={() => { onSelectPillar(id); setPanel(null); }} aria-pressed={activePillar === id} className={`flex min-h-11 min-w-0 flex-wrap items-center justify-center gap-1.5 rounded-xl px-1.5 py-2 text-[10px] font-semibold transition duration-200 ${compact ? '' : 'sm:px-3 sm:text-xs'} motion-reduce:transition-none ${activePillar === id ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5' : 'text-slate-500 hover:bg-white/60 hover:text-slate-900'} ${focus}`}>
              <Icon className={`h-3.5 w-3.5 shrink-0 ${activePillar === id ? active : ''}`} aria-hidden="true" /><span>{label}</span>{pillarCounts && <span aria-label={`${pillarCounts[id]} annonces`} className={`rounded-md px-1.5 py-0.5 text-[9px] tabular-nums ring-1 ${badge} ${activePillar === id ? 'shadow-[0_0_10px_rgba(59,130,246,0.08)]' : 'opacity-80'}`}>{pillarCounts[id]}</span>}
            </button>)}
          </nav>
          <div className={compact ? 'hidden' : 'hidden items-center gap-4 lg:flex'}>
            <nav aria-label="Navigation principale" className="flex items-center gap-4 text-xs font-medium text-slate-500"><a href="#offres" className={`rounded-md transition hover:text-slate-900 ${focus}`}>Explorer</a><button type="button" onClick={onOpenHowItWorks} className={`whitespace-nowrap rounded-md transition hover:text-slate-900 ${focus}`}>Comment ça marche</button><a href="#securite" className={`hidden items-center gap-1 rounded-md transition hover:text-slate-900 xl:flex ${focus}`}><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />Sécurité</a></nav>{searchField()}
          </div>
        </div>
      </div>

      {panel === 'mobile' && <div id="header-mobile" className={`${compact ? '' : 'lg:hidden'} max-h-[55vh] space-y-3 overflow-y-auto overscroll-contain border-t border-slate-200/70 bg-white/95 px-4 py-4`}>
        {searchField(true)}
        <nav aria-label="Navigation mobile" className="grid grid-cols-2 gap-1 text-xs font-medium text-slate-600">
          <a href="#hero" onClick={() => setPanel(null)} className={`rounded-xl p-3 hover:bg-slate-50 ${focus}`}>Accueil</a><a href="#offres" onClick={() => setPanel(null)} className={`rounded-xl p-3 hover:bg-slate-50 ${focus}`}>Explorer</a><button type="button" onClick={() => { onOpenHowItWorks(); setPanel(null); }} className={`rounded-xl p-3 text-left hover:bg-slate-50 ${focus}`}>Comment ça marche</button><a href="#securite" onClick={() => setPanel(null)} className={`rounded-xl p-3 hover:bg-slate-50 ${focus}`}>Sécurité & KYC</a>
        </nav>
        {user && <div className="border-t border-slate-100 pt-2">{dashboards.map(({ id, label, Icon }) => <button type="button" key={id} onClick={() => { setActiveDashboard(id); setPanel(null); }} className={`flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 ${focus}`}><Icon className="h-4 w-4" />{label}</button>)}</div>}
        {!isAuthenticated && <button type="button" onClick={() => { openAuthModal(); setPanel(null); }} className={`min-h-11 w-full rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 ${focus}`}>Connexion</button>}
        {publishButton(true)}
      </div>}
    </header>
  );
};
