import React from "react";
import { NavLink } from "react-router-dom";

// --- ASSETS (Direct Imports for Stability) ---
// Ensure these match your actual folder structure in @/assets/images/general icons/
import iconHomeActive from "@/assets/images/general icons/home_icon.png";
import iconHomeInactive from "@/assets/images/general icons/home_grey_icon.png";

import iconPortfolioActive from "@/assets/images/general icons/start_icon.png"; // Or contract_icon.png if preferred
import iconPortfolioInactive from "@/assets/images/general icons/star_grey_icon.png";

import iconChatActive from "@/assets/images/general icons/chat_icon.png";
import iconChatInactive from "@/assets/images/general icons/chat_grey_icon.png";

import iconPlansActive from "@/assets/images/general icons/lock_icon.png"; // Or a specific 'crown' icon if available
import iconPlansInactive from "@/assets/images/general icons/lock_grey_icon.png";

import iconProfileActive from "@/assets/images/general icons/profile_icon.png";
import iconProfileInactive from "@/assets/images/general icons/profile_grey_icon.png";

export type BottomNavItem = {
  to: string;
  label: string;
  iconActive: string;
  iconInactive: string;
};

const navItems: BottomNavItem[] = [
  { to: "/dashboard", label: "Home", iconActive: iconHomeActive, iconInactive: iconHomeInactive },
  { to: "/portfolio", label: "Portfolio", iconActive: iconPortfolioActive, iconInactive: iconPortfolioInactive },
  { to: "/chat", label: "Chat", iconActive: iconChatActive, iconInactive: iconChatInactive },
  { to: "/payments", label: "Plans", iconActive: iconPlansActive, iconInactive: iconPlansInactive },
  { to: "/settings", label: "Profile", iconActive: iconProfileActive, iconInactive: iconProfileInactive },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background-color: #070914; /* Deep Navy, almost black */
          border-top: 1px solid rgba(244, 215, 62, 0.15); /* Faint Gold Border */
          padding-bottom: env(safe-area-inset-bottom); /* iOS Safe Area */
          box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5);
        }

        .nav-bar {
          display: grid;
          grid-template-columns: repeat(5, 1fr); /* Equal width columns */
          height: 65px; /* Fixed height for the touch area */
          align-items: center;
        }

        .nav-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          gap: 6px;
          height: 100%;
          width: 100%;
          transition: all 0.2s ease;
        }

        /* ICON STYLES */
        .nav-icon {
          width: 24px;
          height: 24px;
          object-fit: contain;
          transition: transform 0.2s ease;
        }

        /* TEXT STYLES */
        .nav-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.5); /* Inactive Grey */
          transition: color 0.2s ease;
        }

        /* ACTIVE STATE (Defined by NavLink class) */
        .nav-link.active .nav-label {
          color: #F4D73E; /* Gold */
          font-weight: 700;
          text-shadow: 0 0 8px rgba(244, 215, 62, 0.4);
        }

        .nav-link.active .nav-icon {
          transform: translateY(-2px); /* Subtle lift */
          filter: drop-shadow(0 0 5px rgba(244, 215, 62, 0.5));
        }

        /* TOUCH FEEDBACK */
        .nav-link:active {
          opacity: 0.7;
          transform: scale(0.95);
        }
      `}</style>

      <div className="nav-bar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? item.iconActive : item.iconInactive}
                  alt={item.label}
                  className="nav-icon"
                />
                <span className="nav-label">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
