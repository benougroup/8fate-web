/**
 * DesktopSideNav.tsx — Sidebar navigation for desktop (≥900px) viewports.
 *
 * On mobile the FloatingRadialNav is used instead.
 * On desktop this sidebar is shown on the left side of the layout.
 */
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePreferences } from "../stores/preferencesStore";
import { getIconSrc, type IconKey } from "../assets/assetMap";
import { t } from "../i18n/t";

const NAV_ITEMS = [
  { key: "day",       iconKey: "today",        labelKey: "preview.nav.day",       path: "/daily" },
  { key: "monthly",   iconKey: "monthly_flow", labelKey: "preview.nav.monthly",   path: "/monthly" },
  { key: "year",      iconKey: "year",         labelKey: "preview.nav.year",       path: "/yearly" },
  { key: "lucktrend", iconKey: "lucktrend",    labelKey: "preview.nav.luckTrend", path: "/luck-pillars" },
  { key: "portfolio", iconKey: "me",           labelKey: "preview.nav.portfolio", path: "/portfolio" },
  { key: "calendar",  iconKey: "icon_time",    labelKey: "preview.nav.calendar",  path: "/auspicious-dates" },
  { key: "chat",      iconKey: "mouth",        labelKey: "preview.nav.chat",      path: "/chat" },
  { key: "settings",  iconKey: "settings",     labelKey: "preview.nav.settings",  path: "/settings" },
] as const;

export function DesktopSideNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = usePreferences();

  return (
    <nav className="revamp-desktopSideNav" aria-label="Main navigation">
      {/* Logo / brand mark */}
      <div className="revamp-desktopSideNavBrand">
        <span className="revamp-desktopSideNavBrandText">8fate</span>
      </div>

      {/* Nav items */}
      <ul className="revamp-desktopSideNavList" role="list">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== "/daily" && location.pathname.startsWith(item.path));
          return (
            <li key={item.key}>
              <button
                type="button"
                className={`revamp-desktopSideNavItem${isActive ? " is-active" : ""}`}
                onClick={() => navigate(item.path)}
                aria-current={isActive ? "page" : undefined}
              >
                <img
                  src={getIconSrc(theme, item.iconKey as IconKey)}
                  alt=""
                  className="revamp-desktopSideNavIcon"
                />
                <span className="revamp-desktopSideNavLabel">{t(item.labelKey)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
