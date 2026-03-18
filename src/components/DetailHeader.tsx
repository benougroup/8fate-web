import React from "react";

interface DetailHeaderProps {
  title: string;
  onBack?: () => void;
  backIcon?: string;
}

export default function DetailHeader({ title, onBack, backIcon }: DetailHeaderProps) {
  return (
    <div className="detail-header">
      <style>{`
        .detail-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .detail-header__icon {
          width: 24px;
          height: 24px;
          cursor: pointer;
          filter: brightness(0) invert(1);
        }

        .detail-header__title {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }
      `}</style>

      {backIcon && onBack ? (
        <img className="detail-header__icon" src={backIcon} onClick={onBack} alt="Back" />
      ) : null}
      <span className="detail-header__title">{title}</span>
    </div>
  );
}
