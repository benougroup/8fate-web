import * as React from "react";
import { useLocation } from "react-router-dom";
import { t } from "../i18n/t";
import { PageSection } from "./PageSection";
import { PillLink } from "./PillButton";
import { Stack } from "./Stack";
import { UiIcon } from "./UiIcon";

export function PreviewBanner() {
  const location = useLocation();

  if (!location.pathname.startsWith("/__preview")) {
    return null;
  }

  return (
    <PageSection title={t("preview.banner.title")} gap="sm">
      <Stack gap="sm" align="start">
        <Stack gap="sm" align="start">
          <PillLink to="/__preview/home">
            <span className="revamp-pillContent">
              <UiIcon name="previewHome" size="sm" alt={t("icons.previewHome")} />
              {t("preview.banner.home")}
            </span>
          </PillLink>
          <PillLink to="/__preview/profile">
            <span className="revamp-pillContent">
              <UiIcon name="previewProfile" size="sm" alt={t("icons.previewProfile")} />
              {t("preview.banner.profile")}
            </span>
          </PillLink>
          <PillLink to="/__preview/components">
            <span className="revamp-pillContent">
              <UiIcon
                name="previewComponents"
                size="sm"
                alt={t("icons.previewComponents")}
              />
              {t("preview.banner.components")}
            </span>
          </PillLink>
        </Stack>
      </Stack>
    </PageSection>
  );
}
