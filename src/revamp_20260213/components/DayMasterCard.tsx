import type React from "react";
import { Text } from "./Text";
import { Stack } from "./Stack";
import { Card } from "./Card";

type DayMasterCardProps = {
  dayMaster: string;
  dayMasterEn: string;
  element: string;
  elementEn: string;
  description?: string;
  className?: string;
};

export function DayMasterCard({
  dayMaster,
  dayMasterEn,
  element,
  elementEn,
  description,
  className,
}: DayMasterCardProps) {
  const classes = ["revamp-dayMasterCard", className].filter(Boolean).join(" ");

  return (
    <Card className={classes}>
      <Stack gap="md" align="center">
        <div className="revamp-dayMasterCharacter">
          {dayMaster}
        </div>
        
        <Stack gap="xs" align="center">
          <Text className="revamp-dayMasterTranslation">
            {dayMasterEn}
          </Text>
          <Text className="revamp-dayMasterElement" muted>
            {element} ({elementEn})
          </Text>
        </Stack>

        {description && (
          <Text className="revamp-dayMasterDescription" muted>
            {description}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
