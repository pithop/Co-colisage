import { Bell, Home, Luggage, ShoppingCart, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface Props {
  route: string;
  unreadMessagesCount?: number;
  navigate: (route: string) => void;
  onNotifications?: () => void;
}

export function BottomNavBar({ route, unreadMessagesCount = 0, navigate, onNotifications }: Props) {
  const { activePlatform } = useAuth();

  const isCurrent = (key: string) => {
    if (key === "home") {
      return (
        route === "explore" ||
        route === "" ||
        route === "voyageur" ||
        (route === "bagandgo" && activePlatform === "bagandgo")
      );
    }
    if (key === "missions") {
      return route === "tracking" || route === "shopandgo";
    }
    if (key === "notifications") return route === "notifications";
    if (key === "account") return route === "profile";
    return false;
  };

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // Safe fallback
      }
    }
  };

  const isShop = activePlatform === "shopandgo";

  return (
    <nav className="mobile-bottom-nav" aria-label="Navigation mobile principale">
      <div className="mobile-bottom-nav-inner">
        {/* Tab 1: Accueil */}
        <button
          type="button"
          className={`mobile-nav-tab ${isCurrent("home") ? "active active-cyan" : ""}`}
          aria-current={isCurrent("home") ? "page" : undefined}
          aria-label="Accueil"
          onClick={() => {
            triggerHaptic();
            navigate("explore");
          }}
        >
          <span className="nav-tab-icon-wrap">
            <Home size={20} className="nav-tab-icon" aria-hidden="true" />
          </span>
          <span className="nav-tab-label">Accueil</span>
          {isCurrent("home") && <span className="nav-tab-active-pill" aria-hidden="true" />}
        </button>

        {/* Tab 2: Mes commandes (Shop&Go) ou Mes missions (Bag&Go / Voyageur) */}
        <button
          type="button"
          className={`mobile-nav-tab ${isCurrent("missions") ? "active active-cyan" : ""}`}
          aria-current={isCurrent("missions") ? "page" : undefined}
          aria-label={isShop ? "Mes commandes" : "Mes missions"}
          onClick={() => {
            triggerHaptic();
            navigate("tracking");
          }}
        >
          <span className="nav-tab-icon-wrap">
            {isShop ? (
              <ShoppingCart size={20} className="nav-tab-icon" aria-hidden="true" />
            ) : (
              <Luggage size={20} className="nav-tab-icon" aria-hidden="true" />
            )}
          </span>
          <span className="nav-tab-label">{isShop ? "Mes commandes" : "Mes missions"}</span>
          {isCurrent("missions") && <span className="nav-tab-active-pill" aria-hidden="true" />}
        </button>

        {/* Tab 3: Notifications */}
        <button
          type="button"
          className={`mobile-nav-tab ${isCurrent("notifications") ? "active active-cyan" : ""}`}
          aria-current={isCurrent("notifications") ? "page" : undefined}
          aria-label="Notifications"
          onClick={() => {
            triggerHaptic();
            if (onNotifications) onNotifications();
            else navigate("notifications");
          }}
        >
          <span className="nav-tab-icon-wrap">
            <Bell size={20} className="nav-tab-icon" aria-hidden="true" />
            <span className="nav-tab-badge" aria-label="2 notifications non lues">
              2
            </span>
          </span>
          <span className="nav-tab-label">Notifications</span>
          {isCurrent("notifications") && <span className="nav-tab-active-pill" aria-hidden="true" />}
        </button>

        {/* Tab 4: Mon compte */}
        <button
          type="button"
          className={`mobile-nav-tab ${isCurrent("account") ? "active active-cyan" : ""}`}
          aria-current={isCurrent("account") ? "page" : undefined}
          aria-label="Mon compte"
          onClick={() => {
            triggerHaptic();
            navigate("profile");
          }}
        >
          <span className="nav-tab-icon-wrap">
            <UserRound size={20} className="nav-tab-icon" aria-hidden="true" />
          </span>
          <span className="nav-tab-label">Mon compte</span>
          {isCurrent("account") && <span className="nav-tab-active-pill" aria-hidden="true" />}
        </button>
      </div>
    </nav>
  );
}
