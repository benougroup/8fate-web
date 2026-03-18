import type React from "react";
import { Text } from "./Text";
import { Stack } from "./Stack";
import { Card } from "./Card";

type LuckPillarCardProps = {
  startAge: number;
  endAge: number;
  stem: string;
  stemEn: string;
  branch: string;
  branchEn: string;
  element: string;
  elementEn: string;
  isCurrent: boolean;
  analysis: string;
  className?: string;
};

export function LuckPillarCard({
  startAge,
  endAge,
  stem,
  stemEn,
  branch,
  branchEn,
  element,
  elementEn,
  isCurrent,
  analysis,
  className,
}: LuckPillarCardProps) {
  const classes = [
    "revamp-luckPillarCard",
    isCurrent && "revamp-luckPillarCard--current",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className={classes}>
      <Stack gap="md">
        {/* Age Range */}
        <div className="revamp-luckPillarHeader">
          <Text className="revamp-luckPillarAge">
            Age {startAge}-{endAge}
          </Text>
          {isCurrent && (
            <span className="revamp-luckPillarCurrentBadge">Current</span>
          )}
        </div>

        {/* Pillar Display */}
        <div className="revamp-luckPillarContent">
          <div className="revamp-luckPillarStem">
            <div className="revamp-luckPillarCharacter">{stem}</div>
            <Text className="revamp-luckPillarTranslation" muted>
              {stemEn}
            </Text>
          </div>
          <div className="revamp-luckPillarDivider" />
          <div className="revamp-luckPillarBranch">
            <div className="revamp-luckPillarCharacter">{branch}</div>
            <Text className="revamp-luckPillarTranslation" muted>
              {branchEn}
            </Text>
          </div>
        </div>

        {/* Element */}
        <div className="revamp-luckPillarElement">
          <Text muted>
            {element} ({elementEn})
          </Text>
        </div>

        {/* Analysis */}
        <div className="revamp-luckPillarAnalysis">
          <Text muted>{analysis}</Text>
        </div>
      </Stack>
    </Card>
  );
}
