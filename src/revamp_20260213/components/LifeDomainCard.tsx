import React, { useState } from "react";
import type { LifeDomain } from "../services/mock/baziTypes";
import { TrendIndicator } from "./TrendIndicator";
import { CardFlip } from "./CardFlip";

type LifeDomainCardProps = {
  domain: LifeDomain;
  icon?: string;
};

const domainLabels = {
  work: { en: "Work", zh: "業" },
  wealth: { en: "Wealth", zh: "財" },
  relationship: { en: "Relationship", zh: "緣" },
  health: { en: "Health", zh: "身" },
  study: { en: "Study", zh: "學" },
  family: { en: "Family", zh: "家" },
  talent: { en: "Talent", zh: "才" },
};

const domainIcons = {
  work: "💼",
  wealth: "💰",
  relationship: "💕",
  health: "🏥",
  study: "📚",
  family: "👨‍👩‍👧",
  talent: "🎨",
};

export const LifeDomainCard: React.FC<LifeDomainCardProps> = ({
  domain,
  icon,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const label = domainLabels[domain.domain];
  const emoji = icon || domainIcons[domain.domain];

  const frontContent = (
    <div className="revamp-lifeDomainCard-front">
      <div className="revamp-lifeDomainCard-icon">{emoji}</div>
      <div className="revamp-lifeDomainCard-label">
        <span className="revamp-lifeDomainCard-zh">{label.zh}</span>
        <span className="revamp-lifeDomainCard-en">{label.en}</span>
      </div>
      <div className="revamp-lifeDomainCard-trend">
        <TrendIndicator trend={domain.trend} size="lg" />
      </div>
      {domain.isPremium && (
        <div className="revamp-lifeDomainCard-premium">🔒</div>
      )}
    </div>
  );

  const backContent = (
    <div className="revamp-lifeDomainCard-back">
      <div className="revamp-lifeDomainCard-icon-small">{emoji}</div>
      <p className="revamp-lifeDomainCard-description">{domain.description}</p>
      {domain.isPremium && (
        <button className="revamp-lifeDomainCard-unlock">
          Unlock Premium
        </button>
      )}
    </div>
  );

  return (
    <div
      className="revamp-lifeDomainCard"
      onClick={() => !domain.isPremium && setIsFlipped(!isFlipped)}
      style={{ cursor: domain.isPremium ? "not-allowed" : "pointer" }}
    >
      <CardFlip
        frontContent={frontContent}
        backContent={backContent}
        isFlipped={isFlipped}
      />
    </div>
  );
};
