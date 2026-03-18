import type React from "react";
import { Text } from "./Text";
import { Stack } from "./Stack";

type Element = {
  name: string;
  nameChinese: string;
  score: number;
  color: string;
};

type ElementBalanceChartProps = {
  elements: Element[];
  maxScore?: number;
  className?: string;
};

export function ElementBalanceChart({
  elements,
  maxScore = 6,
  className,
}: ElementBalanceChartProps) {
  const classes = ["revamp-elementBalanceChart", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <Stack gap="md">
        {elements.map((element) => {
          const percentage = (element.score / maxScore) * 100;

          return (
            <div key={element.name} className="revamp-elementRow">
              <div className="revamp-elementInfo">
                <Text className="revamp-elementName">
                  {element.name} ({element.nameChinese})
                </Text>
                <Text className="revamp-elementScore" muted>
                  {element.score.toFixed(1)}
                </Text>
              </div>
              <div className="revamp-elementBarContainer">
                <div
                  className="revamp-elementBar"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: element.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </Stack>
    </div>
  );
}
