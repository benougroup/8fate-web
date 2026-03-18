import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getIconSrc, type IconKey } from "../assets/assetMap";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";
import { BackdropOverlay } from "./BackdropOverlay";

const NAV_ITEMS = [
  {
    key: "day",
    iconKey: "sun",
    labelKey: "preview.nav.day",
  },
  {
    key: "monthly",
    iconKey: "moon",
    labelKey: "preview.nav.monthly",
  },
  {
    key: "year",
    iconKey: "year",
    labelKey: "preview.nav.year",
  },
  {
    key: "lucktrend",
    iconKey: "lucktrend",
    labelKey: "preview.nav.luckTrend",
  },
  {
    key: "portfolio",
    iconKey: "me",
    labelKey: "preview.nav.portfolio",
  },
  {
    key: "settings",
    iconKey: "settings",
    labelKey: "preview.nav.settings",
  },
  {
    key: "chat",
    iconKey: "mouth",
    labelKey: "preview.nav.chat",
  },
] as const;

function getTargetPath(key: string, isPreviewRoute: boolean) {
  switch (key) {
    case "day":
      return isPreviewRoute ? "/__preview/home" : "/daily";
    case "monthly":
      return "/monthly";
    case "year":
      return "/yearly";
    case "lucktrend":
      return "/portfolio";
    case "portfolio":
      return "/portfolio";
    case "settings":
      return "/settings";
    case "chat":
      return "/chat";
    default:
      return "/daily";
  }
}

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

function getRadialRadius(itemCount: number) {
  if (typeof window === "undefined") {
    return 108 + Math.max(0, itemCount - 5) * 6;
  }

  const minDimension = Math.min(window.innerWidth, window.innerHeight);
  const extra = Math.max(0, itemCount - 5) * 6;
  let radius = 126 + extra;
  if (minDimension < 820) {
    radius = 108 + extra;
  }

  if (minDimension < 640) {
    radius = 92 + extra;
  }

  const safeMargin = 44;
  const maxRadius = Math.max(72, window.innerWidth / 2 - safeMargin);
  return Math.min(radius, maxRadius);
}

function getArcAngles(itemCount: number) {
  const startAngleDeg = 180;
  const endAngleDeg = 0;
  if (itemCount <= 1) {
    return [startAngleDeg];
  }
  const step = (endAngleDeg - startAngleDeg) / (itemCount - 1);
  return Array.from({ length: itemCount }, (_, index) => startAngleDeg + step * index);
}

export function FloatingRadialNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = usePreferences();
  const [isOpen, setIsOpen] = React.useState(false);
  const [radius, setRadius] = React.useState(() =>
    getRadialRadius(NAV_ITEMS.length)
  );
  const isPreviewRoute = location.pathname.startsWith("/__preview");
  const shouldPreviewOpen = location.pathname.includes("/menu-open");
  const angles = React.useMemo(
    () => getArcAngles(NAV_ITEMS.length),
    [NAV_ITEMS.length]
  );

  React.useEffect(() => {
    if (isPreviewRoute) {
      setIsOpen(shouldPreviewOpen);
    }
  }, [isPreviewRoute, shouldPreviewOpen]);

  React.useEffect(() => {
    const handleResize = () => setRadius(getRadialRadius(NAV_ITEMS.length));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [NAV_ITEMS.length]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNavigate = (target: string, disabled?: boolean) => {
    if (disabled) {
      return;
    }
    setIsOpen(false);
    navigate(target);
  };

  return (
    <div className="revamp-radialNav" data-open={isOpen}>
      <BackdropOverlay
        open={isOpen}
        onClose={() => setIsOpen(false)}
        variant="dim-blur"
      />
      <div className="revamp-radialMenu">
        {NAV_ITEMS.map((item, index) => {
          const target = getTargetPath(item.key, isPreviewRoute);
          const angle = angles[index] ?? angles[angles.length - 1];
          const radians = toRadians(angle);
          const offset = {
            x: Math.cos(radians) * radius,
            y: -Math.sin(radians) * radius,
          };
          const style = {
            "--radial-x": isOpen ? `${offset.x}px` : "0px",
            "--radial-y": isOpen ? `${offset.y}px` : "0px",
          } as React.CSSProperties;

          return (
            <button
              key={item.key}
              type="button"
              className="revamp-radialItem"
              style={style}
              aria-label={t(item.labelKey)}
              onClick={() => handleNavigate(target)}
            >
              <img
                src={getIconSrc(theme, item.iconKey as IconKey)}
                alt=""
                className="revamp-radialItemIcon"
              />
              <span className="revamp-radialItemLabel">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="revamp-radialFab"
        aria-expanded={isOpen}
        aria-label={t("preview.nav.open")}
        onClick={handleToggle}
      >
        <img
          src={getIconSrc(theme, "menu")}
          alt=""
          className="revamp-radialFabIcon"
        />
      </button>
    </div>
  );
}
