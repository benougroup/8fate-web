import type React from "react";
import { Text } from "./Text";
import { TenGodBadge } from "./TenGodBadge";

type BaziPillarCardProps = {
  pillarName: string;
  stem: string;
  stemEn?: string;
  branch: string;
  branchEn?: string;
  tenGod: string;
  element: string;
  /** When true, renders stem and branch side-by-side in a compact horizontal row */
  compact?: boolean;
  className?: string;
};

export function BaziPillarCard({
  pillarName,
  stem,
  stemEn,
  branch,
  branchEn,
  tenGod,
  element,
  compact = false,
  className,
}: BaziPillarCardProps) {
  const classes = [
    "revamp-baziPillarCard",
    compact ? "revamp-baziPillarCard--compact" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (compact) {
    return (
      <div className={classes}>
        <div className="revamp-pillarCompactName">{pillarName}</div>
        <div className="revamp-pillarCompactRow">
          <div className="revamp-pillarCompactCell">
            <span className="revamp-pillarCompactLabel">Stem</span>
            <span className="revamp-pillarCompactChar">{stem}</span>
            {stemEn && <span className="revamp-pillarCompactSub">{stemEn}</span>}
          </div>
          <div className="revamp-pillarCompactDivider" />
          <div className="revamp-pillarCompactCell">
            <span className="revamp-pillarCompactLabel">Branch</span>
            <span className="revamp-pillarCompactChar">{branch}</span>
            {branchEn && <span className="revamp-pillarCompactSub">{branchEn}</span>}
          </div>
        </div>
        <div className="revamp-pillarCompactFooter">
          <TenGodBadge tenGod={tenGod} />
          <span className="revamp-pillarCompactElement">{element}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={classes}>
      <div className="revamp-pillarHeader">
        <Text className="revamp-pillarName" muted>
          {pillarName}
        </Text>
      </div>
      <div className="revamp-pillarContent">
        <div className="revamp-pillarStem">
          <Text className="revamp-pillarLabel" muted>Heavenly Stem</Text>
          <div className="revamp-pillarCharacter">{stem}</div>
          {stemEn && <Text className="revamp-pillarTranslation" muted>{stemEn}</Text>}
        </div>
        <div className="revamp-pillarDivider" />
        <div className="revamp-pillarBranch">
          <Text className="revamp-pillarLabel" muted>Earthly Branch</Text>
          <div className="revamp-pillarCharacter">{branch}</div>
          {branchEn && <Text className="revamp-pillarTranslation" muted>{branchEn}</Text>}
        </div>
      </div>
      <div className="revamp-pillarFooter">
        <TenGodBadge tenGod={tenGod} />
        <Text className="revamp-pillarElement" muted>{element}</Text>
      </div>
    </div>
  );
}
