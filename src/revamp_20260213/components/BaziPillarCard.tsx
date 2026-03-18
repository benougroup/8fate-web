import type React from "react";
import { Text } from "./Text";
import { Stack } from "./Stack";
import { TenGodBadge } from "./TenGodBadge";

type BaziPillarCardProps = {
  pillarName: string;
  stem: string;
  stemEn?: string;
  branch: string;
  branchEn?: string;
  tenGod: string;
  element: string;
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
  className,
}: BaziPillarCardProps) {
  const classes = ["revamp-baziPillarCard", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <div className="revamp-pillarHeader">
        <Text className="revamp-pillarName" muted>
          {pillarName}
        </Text>
      </div>

      <Stack gap="md" align="center" className="revamp-pillarContent">
        <div className="revamp-pillarStem">
          <Text className="revamp-pillarLabel" muted>
            Heavenly Stem
          </Text>
          <div className="revamp-pillarCharacter">{stem}</div>
          {stemEn && (
            <Text className="revamp-pillarTranslation" muted>
              {stemEn}
            </Text>
          )}
        </div>

        <div className="revamp-pillarDivider" />

        <div className="revamp-pillarBranch">
          <Text className="revamp-pillarLabel" muted>
            Earthly Branch
          </Text>
          <div className="revamp-pillarCharacter">{branch}</div>
          {branchEn && (
            <Text className="revamp-pillarTranslation" muted>
              {branchEn}
            </Text>
          )}
        </div>
      </Stack>

      <div className="revamp-pillarFooter">
        <TenGodBadge tenGod={tenGod} />
        <Text className="revamp-pillarElement" muted>
          {element}
        </Text>
      </div>
    </div>
  );
}
