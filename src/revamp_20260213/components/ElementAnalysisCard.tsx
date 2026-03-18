import type React from "react";
import { Text } from "./Text";
import { Stack } from "./Stack";
import { Card } from "./Card";

type ElementAnalysisCardProps = {
  strongestElement: string;
  strongestScore: number;
  weakestElement: string;
  weakestScore: number;
  analysis?: string;
  className?: string;
};

export function ElementAnalysisCard({
  strongestElement,
  strongestScore,
  weakestElement,
  weakestScore,
  analysis,
  className,
}: ElementAnalysisCardProps) {
  const classes = ["revamp-elementAnalysisCard", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className={classes}>
      <Stack gap="md">
        <Text className="revamp-sectionTitle">Element Analysis</Text>

        <div className="revamp-elementAnalysisContent">
          <Text muted>
            Your chart shows <strong>{strongestElement}</strong> as the strongest
            element ({strongestScore.toFixed(1)}), indicating a dominant influence
            in your life path.
          </Text>
        </div>

        <div className="revamp-elementAnalysisContent">
          <Text muted>
            Conversely, <strong>{weakestElement}</strong> is the weakest (
            {weakestScore.toFixed(1)}), suggesting areas where you may need to
            cultivate balance and awareness.
          </Text>
        </div>

        {analysis && (
          <div className="revamp-elementAnalysisContent">
            <Text muted>{analysis}</Text>
          </div>
        )}
      </Stack>
    </Card>
  );
}
