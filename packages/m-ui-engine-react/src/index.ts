import type { MUiEngineAction, MUiEngineNavigationGroup, MUiEngineScreen } from "@muonroi/ui-engine-core";

export interface MReactNavigationItem {
  id: string;
  title: string;
  route: string;
  disabled: boolean;
  children: MReactNavigationItem[];
}

export interface MReactNavigationGroup {
  id: string;
  title: string;
  items: MReactNavigationItem[];
}

export interface MReactUiModel {
  navigation: MReactNavigationGroup[];
  screens: MUiEngineScreen[];
  actions: MUiEngineAction[];
}

export function MCreateReactUiModel(
  groups: MUiEngineNavigationGroup[],
  screens: MUiEngineScreen[],
  actions: MUiEngineAction[]
): MReactUiModel {
  return {
    navigation: groups.map((group) => ({
      id: group.groupName,
      title: group.groupDisplayName,
      items: MMapNavigation(group.items)
    })),
    screens: screens.filter((screen) => screen.isVisible),
    actions: actions.filter((action) => action.isVisible)
  };
}

function MMapNavigation(nodes: MUiEngineNavigationGroup["items"]): MReactNavigationItem[] {
  return nodes
    .filter((node) => node.isVisible)
    .sort((left, right) => left.order - right.order)
    .map((node) => ({
      id: node.nodeKey,
      title: node.title,
      route: node.route,
      disabled: !node.isEnabled,
      children: MMapNavigation(node.children)
    }));
}