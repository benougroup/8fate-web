import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Avatar from "@/components/Avatar";

export type ProfileLinkProps = {
  fullName?: string;
  subtitle?: ReactNode;
  className?: string;
  ariaLabel?: string;
  imageUrl?: string;
};

function getFirstName(fullName?: string) {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return parts[0] ?? "";
}

export default function ProfileLink({
  fullName,
  subtitle,
  className,
  ariaLabel = "Open profile",
  imageUrl,
}: ProfileLinkProps) {
  const firstName = getFirstName(fullName);
  const greeting = firstName ? `Hi, ${firstName}` : "Hi";

  return (
    <>
      <style>{`
        .profile-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 4px 6px;
          margin: -4px -6px;
          border-radius: 10px;
          text-decoration: none;
          color: inherit;
        }
        .profile-link:focus-visible {
          outline: 2px solid rgba(244, 215, 62, 0.6);
          outline-offset: 4px;
        }
        .profile-link__text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .profile-link__greeting {
          font-size: 22px;
          font-weight: 700;
          margin: 0;
          color: #fff;
        }
        .profile-link__subtitle {
          font-size: 13px;
          opacity: 0.8;
          margin: 0;
          color: #e6ecf5;
        }
      `}</style>
      <Link
        to="/profile"
        className={["profile-link", className].filter(Boolean).join(" ")}
        aria-label={ariaLabel}
      >
        <Avatar name={fullName} size={36} imageUrl={imageUrl} />
        <span className="profile-link__text">
          <span className="profile-link__greeting">{greeting}</span>
          {subtitle ? <span className="profile-link__subtitle">{subtitle}</span> : null}
        </span>
      </Link>
    </>
  );
}
