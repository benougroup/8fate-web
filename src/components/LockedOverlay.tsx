import React from "react";

interface LockedOverlayProps {
  isLocked: boolean;
  lockIcon: string;
  message?: string;
  onUpgrade?: () => void;
  children: React.ReactNode;
}

export default function LockedOverlay({
  isLocked,
  lockIcon,
  message = "Unlock with Premium",
  onUpgrade,
  children,
}: LockedOverlayProps) {
  return (
    <div className="locked-overlay">
      <style>{`
        .locked-overlay {
          position: relative;
        }

        .locked-overlay__content--locked {
          filter: blur(4px);
          pointer-events: none;
        }

        .locked-overlay__mask {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 8px;
        }

        .locked-overlay__button {
          background: #F4D73E;
          border: none;
          padding: 6px 14px;
          border-radius: 20px;
          color: #0B0C2A;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }

        .locked-overlay__message {
          color: #fff;
          font-size: 13px;
          opacity: 0.9;
        }
      `}</style>

      <div className={isLocked ? "locked-overlay__content--locked" : undefined}>{children}</div>
      {isLocked ? (
        <div className="locked-overlay__mask">
          <img src={lockIcon} alt="Locked" style={{ width: 24, marginBottom: 4 }} />
          <span className="locked-overlay__message">{message}</span>
          {onUpgrade ? (
            <button className="locked-overlay__button" type="button" onClick={onUpgrade}>
              Upgrade
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
