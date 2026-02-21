import type { MUiEngineNavigationNode, MUiEngineScreen } from "@muonroi/ui-engine-core";

export interface MAngularRouteDefinition {
  path: string;
  screenKey: string;
  canActivate: boolean;
}

export interface MAngularMenuItem {
  key: string;
  label: string;
  icon?: string | null;
  route: string;
  disabled: boolean;
  children: MAngularMenuItem[];
}

export function MMapScreensToAngularRoutes(screens: MUiEngineScreen[]): MAngularRouteDefinition[] {
  return screens
    .filter((screen) => screen.isVisible)
    .map((screen) => ({
      path: screen.route.startsWith("/") ? screen.route.slice(1) : screen.route,
      screenKey: screen.screenKey,
      canActivate: screen.isEnabled
    }));
}

export function MMapNavigationToAngularMenu(nodes: MUiEngineNavigationNode[]): MAngularMenuItem[] {
  return nodes
    .filter((node) => node.isVisible)
    .sort((left, right) => left.order - right.order)
    .map((node) => ({
      key: node.nodeKey,
      label: node.title,
      icon: node.icon,
      route: node.route,
      disabled: !node.isEnabled,
      children: MMapNavigationToAngularMenu(node.children)
    }));
}