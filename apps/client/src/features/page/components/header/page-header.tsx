import classes from "./page-header.module.css";
import PageHeaderMenu from "@/features/page/components/header/page-header-menu.tsx";
import { useAtomValue } from "jotai";
import { IconMessage } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import SidebarToggle from "@/components/ui/sidebar-toggle-button";
import { desktopSidebarAtom } from "@/components/layouts/global/hooks/atoms/sidebar-atom";
import { useToggleSidebar } from "@/components/layouts/global/hooks/hooks/use-toggle-sidebar";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import Breadcrumb from "@/features/page/components/breadcrumbs/breadcrumb.tsx";

import { useParams } from "react-router-dom";
import { usePageMetaQuery } from "@/features/page/queries/page-query";
import { extractPageSlugId } from "@/lib";
import PagePresence from "./page-presence";
import { workspaceAtom } from "@/features/user/atoms/current-user-atom.ts";
import { useOpenAiChatForCurrentPage } from "@/features/ai-chat/hooks/use-open-ai-chat";

interface Props {
  readOnly?: boolean;
}
export default function PageHeader({ readOnly }: Props) {
  const { t } = useTranslation();
  const { pageSlug } = useParams();
  const pageId = extractPageSlugId(pageSlug);
  const { data } = usePageMetaQuery({ pageId });
  const page =
    data?.id === pageId || data?.slugId === pageId ? data : undefined;
  const sidebarOpen = useAtomValue(desktopSidebarAtom);
  const toggleSidebar = useToggleSidebar(desktopSidebarAtom);
  // On page routes the global header is hidden from `md` up, so the sidebar
  // was the only AI-chat entry point there: collapsing it while editing hid the
  // chat. The page header is always visible, so the entry point lives here too.
  const workspace = useAtomValue(workspaceAtom);
  const openAiChat = useOpenAiChatForCurrentPage();
  const aiChatEnabled = workspace?.settings?.ai?.chat === true;

  return (
    <div className={classes.header} data-page-header="true">
      <Group
        justify="space-between"
        h="100%"
        wrap="nowrap"
        className={classes.group}
      >
        <Group wrap="nowrap" gap="xs" className={classes.trail}>
          {!sidebarOpen && (
            <SidebarToggle
              visibleFrom="md"
              aria-label={t("Sidebar toggle")}
              onClick={toggleSidebar}
            />
          )}
          <Breadcrumb />
        </Group>

        <Group
          justify="flex-end"
          h="100%"
          wrap="nowrap"
          className={classes.actions}
        >
          <PagePresence pageId={page?.id} />
          {aiChatEnabled && (
            <Tooltip label={t("AI chat")} withArrow>
              <ActionIcon
                variant="subtle"
                color="dark"
                aria-label={t("AI chat")}
                onClick={openAiChat}
              >
                <IconMessage size={20} stroke={2} />
              </ActionIcon>
            </Tooltip>
          )}
          <PageHeaderMenu readOnly={readOnly} />
        </Group>
      </Group>
    </div>
  );
}
