import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home, Terminal, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Production telemetry hook or error logging
    if (typeof window !== "undefined") {
      console.error("[BagVoyage ErrorBoundary Caught]", error, errorInfo);
    }
  }

  handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  handleGoHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  handleCopyTrace = () => {
    const { error, errorInfo } = this.state;
    const text = `BagVoyage Runtime Exception:\n${error?.toString() || ""}\n\nStack:\n${error?.stack || ""}\n\nComponent Stack:\n${errorInfo?.componentStack || ""}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2500);
      });
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, showDetails, copied } = this.state;

      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
          <div className="w-full max-w-xl bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Icon Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 shadow-inner">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  Incident d'Exécution Protégé
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
                  Interruption inattendue
                </h1>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Une anomalie est survenue pendant l'affichage de ce composant. Vos données locales et transactions en cours dans IndexedDB sont entièrement préservées.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-blue-600/25 transition-all duration-200 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Recharger l'application
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-700/80 hover:bg-slate-700 active:scale-[0.98] text-slate-200 text-sm font-semibold border border-slate-600/60 transition-all duration-200 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Accueil
              </button>
            </div>

            {/* Technical details accordion */}
            <div className="border-t border-slate-700/70 pt-4">
              <button
                type="button"
                onClick={() => this.setState({ showDetails: !showDetails })}
                className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 py-1 font-medium transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  Rapport technique & diagnostic
                </span>
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showDetails && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-amber-400 font-bold">
                      {error?.name || "Error"}: {error?.message || "Détail non disponible"}
                    </span>
                    <button
                      type="button"
                      onClick={this.handleCopyTrace}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-sans font-medium transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                  {error?.stack && (
                    <div className="max-h-40 overflow-y-auto text-[10px] text-slate-400 whitespace-pre-wrap leading-relaxed pr-1">
                      {error.stack}
                    </div>
                  )}
                  {errorInfo?.componentStack && (
                    <div className="max-h-24 overflow-y-auto text-[10px] text-slate-500 whitespace-pre-wrap border-t border-slate-800/80 pt-1.5 pr-1">
                      {errorInfo.componentStack}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
