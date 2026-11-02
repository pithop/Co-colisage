import { Compass, Globe2, MessageCircle, Package, Plane } from "lucide-react";

interface Props {
  route: string;
  unreadMessagesCount?: number;
  navigate: (route: string) => void;
}

interface NavItem {
  key: string;
  label: string;
  icon: typeof Compass;
  targetRoute: string;
  badge?: number;
}

export function BottomNavBar({ route, unreadMessagesCount = 0, navigate }: Props) {
  const items: NavItem[] = [
    {
      key: "explore",
      label: "Explorer",
      icon: Compass,
      targetRoute: "explore",
    },
    {
      key: "radar",
      label: "Radar",
      icon: Globe2,
      targetRoute: "radar",
    },
    {
      key: "arbitrage",
      label: "Arbitrage",
      icon: Plane,
      targetRoute: "arbitrage",
    },
    {
      key: "tracking",
      label: "Expéditions",
      icon: Package,
      targetRoute: "tracking",
    },
    {
      key: "messages",
      label: "Messages",
      icon: MessageCircle,
      targetRoute: "messages",
      badge: unreadMessagesCount,
    },
  ];

  const isCurrent = (key: string) => {
    if (key === "explore" && (route === "explore" || route === "")) return true;
    if (key === "radar" && route.startsWith("radar")) return true;
    if (key === "arbitrage" && route.startsWith("arbitrage")) return true;
    if (key === "tracking" && route === "tracking") return true;
    if (key === "messages" && route === "messages") return true;
    return false;
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Navigation mobile principale">
      <div className="mobile-bottom-nav-inner">
        {items.map((item) => {
          const active = isCurrent(item.key);
          const IconComponent = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              className={`mobile-nav-tab ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              onClick={() => {
                if (item.key === "radar") {
                  window.location.hash = "radar";
                } else if (item.key === "tracking") {
                  window.location.hash = "tracking";
                } else {
                  navigate(item.targetRoute);
                }
              }}
            >
              <span className="nav-tab-icon-wrap">
                <IconComponent size={20} className="nav-tab-icon" aria-hidden="true" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="nav-tab-badge" aria-label={`${item.badge} messages non lus`}>
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </span>
              <span className="nav-tab-label">{item.label}</span>
              {active && <span className="nav-tab-active-pill" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
