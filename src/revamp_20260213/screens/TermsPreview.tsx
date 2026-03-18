import * as React from "react";
import termsHtml from "@/assets/legal/terms.v1.0.0.en.html?raw";
import { getArrowSrc } from "../assets/assetMap";
import { Page } from "../components/Page";
import { PageCard } from "../components/PageCard";
import { PageContent } from "../components/PageContent";
import { PageSection } from "../components/PageSection";
import { PillButton, PillLink } from "../components/PillButton";
import { SectionCard } from "../components/SectionCard";
import { Stack } from "../components/Stack";
import { Text } from "../components/Text";
import { TopBar } from "../components/TopBar";
import { usePreferences } from "../stores/preferencesStore";

export function TermsPreview() {
  const { theme } = usePreferences();
  const backIconSrc = getArrowSrc(theme, "pointleft");
  const termsVersion = "v1.0.0";

  return (
    <Page>
      <PageCard>
        <PageContent>
          <Stack gap="md">
            <TopBar
              left={(
                <PillLink
                  to="/__preview/login"
                  className="revamp-termsBackButton"
                  aria-label="Back to login"
                >
                  <img
                    src={backIconSrc}
                    alt=""
                    className="revamp-termsBackIcon"
                  />
                </PillLink>
              )}
            />
            <PageSection>
              <SectionCard className="revamp-termsCard">
                <div
                  className="revamp-termsBody"
                  dangerouslySetInnerHTML={{ __html: termsHtml }}
                />
              </SectionCard>
            </PageSection>
            <PageSection>
              <SectionCard>
                <Stack gap="sm" align="start">
                  <Text muted>Version {termsVersion}</Text>
                  <label className="revamp-termsAgreement">
                    <input type="checkbox" />
                    <span>I agree to the Terms &amp; Conditions ({termsVersion}).</span>
                  </label>
                  <div className="revamp-termsActions">
                    <PillLink to="/__preview/login">Back</PillLink>
                    <PillButton>Agree &amp; Continue</PillButton>
                  </div>
                </Stack>
              </SectionCard>
            </PageSection>
          </Stack>
        </PageContent>
      </PageCard>
    </Page>
  );
}
