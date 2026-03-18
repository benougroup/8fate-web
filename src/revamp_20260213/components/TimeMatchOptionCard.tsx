import type React from "react";
import iconLock from "@/assets/images/general icons/lock_icon.png";
import { Button } from "./Button";
import { Text } from "./Text";

export type TimeMatchOption = {
  id: string;
  hourLabel: string;
  description: string;
  keywords: string[];
  isLocked?: boolean;
};

type TimeMatchOptionCardProps = {
  option: TimeMatchOption;
  isSelected: boolean;
  lockedTitle: string;
  lockedBody: string;
  lockedCta: string;
  onSelect: (id: string) => void;
  onLockedClick: () => void;
};

export function TimeMatchOptionCard({
  option,
  isSelected,
  lockedTitle,
  lockedBody,
  lockedCta,
  onSelect,
  onLockedClick,
}: TimeMatchOptionCardProps) {
  const isLocked = !!option.isLocked;

  const handleSelect = () => {
    if (isLocked) {
      onLockedClick();
      return;
    }
    onSelect(option.id);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleSelect();
  };

  return (
    <div
      className={[
        "revamp-timeMatchCard",
        isSelected ? "is-selected" : null,
        isLocked ? "is-locked" : null,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-disabled={isLocked}
    >
      {isLocked ? (
        <div className="revamp-timeMatchLock">
          <img
            src={iconLock}
            alt=""
            className="revamp-timeMatchLockIcon"
            aria-hidden="true"
          />
          <div>
            <Text className="revamp-timeMatchLockTitle">{lockedTitle}</Text>
            <Text className="revamp-timeMatchLockBody">{lockedBody}</Text>
          </div>
          <Button
            size="sm"
            pill
            onClick={(event) => {
              event.stopPropagation();
              onLockedClick();
            }}
          >
            {lockedCta}
          </Button>
        </div>
      ) : null}

      <div className="revamp-timeMatchCardHeader">
        <span className="revamp-timeMatchLabel">{option.hourLabel}</span>
        <span className="revamp-timeMatchCheck" aria-hidden="true">
          {isSelected ? "✓" : ""}
        </span>
      </div>

      <Text className="revamp-timeMatchDescription">{option.description}</Text>

      <div className="revamp-timeMatchTags">
        {option.keywords.map((keyword) => (
          <span key={keyword} className="revamp-timeMatchTag">
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}
