import {
  getDirectionSrc,
  getElementSrc,
  getZodiacSrc,
  type DirectionKey,
} from "../assets/domainAssetMap";
import type { LuckPanelMeta } from "../contracts/v1/homeMeta";
import { t } from "../i18n/t";
import { usePreferences } from "../stores/preferencesStore";

const getDirectionParts = (direction: LuckPanelMeta["direction"]): DirectionKey[] => {
  if (direction.includes("-")) {
    return direction.split("-") as DirectionKey[];
  }
  return [direction];
};

const getZodiacLabel = (zodiac: LuckPanelMeta["zodiac"]) =>
  t(`home.zodiac.${zodiac}`);

const getElementLabel = (element: LuckPanelMeta["element"]) =>
  t(`home.elements.${element}`);

type LuckAvoidMetaProps = {
  meta: LuckPanelMeta;
  variant?: "luck" | "avoid";
};

export function LuckAvoidMeta({ meta, variant = "luck" }: LuckAvoidMetaProps) {
  const { theme } = usePreferences();
  const zodiacLabel = getZodiacLabel(meta.zodiac);
  const elementLabel = getElementLabel(meta.element);
  const zodiacElementText = t("home.zodiacElement.format", {
    zodiac: zodiacLabel,
    element: elementLabel,
  });
  const directionParts = getDirectionParts(meta.direction);

  const isAvoid = variant === "avoid";
  
  return (
    <div className="revamp-luckAvoidMeta" data-variant={variant}>
      <div className="revamp-luckAvoidRow">
        <span className="revamp-luckAvoidLabel">
          {t("home.luckAvoid.labels.score")}
        </span>
        <span className="revamp-luckAvoidValue">{meta.number}</span>
      </div>
      <div className="revamp-luckAvoidRow">
        <span className="revamp-luckAvoidLabel">
          {t("home.luckAvoid.labels.color")}
        </span>
        <span className="revamp-luckAvoidValue">
          <span
            className="revamp-luckAvoidSwatch"
            style={{ backgroundColor: meta.colorHex }}
            aria-label={meta.colorHex}
          />
        </span>
      </div>
      <div className="revamp-luckAvoidRow">
        <span className="revamp-luckAvoidLabel">
          {t("home.luckAvoid.labels.zodiacElement")}
        </span>
        <span className="revamp-luckAvoidValue revamp-luckAvoidZodiacValue">
          <span className="revamp-luckAvoidIcons">
            <img
              className="revamp-luckAvoidIcon"
              src={getZodiacSrc(theme, meta.zodiac)}
              alt=""
            />
            <img
              className="revamp-luckAvoidIcon"
              src={getElementSrc(theme, meta.element, "regular")}
              alt=""
            />
          </span>
          <span>{zodiacElementText}</span>
        </span>
      </div>
      <div className="revamp-luckAvoidRow">
        <span className="revamp-luckAvoidLabel">
          {t("home.luckAvoid.labels.direction")}
        </span>
        <span className="revamp-luckAvoidValue">
          <span className="revamp-luckAvoidIcons">
            {directionParts.map((direction) => (
              <img
                key={direction}
                className="revamp-luckAvoidIcon"
                src={getDirectionSrc(theme, direction)}
                alt=""
              />
            ))}
          </span>
        </span>
      </div>
    </div>
  );
}
