import type {
  MUiEngineAction,
  MUiEngineManifest,
  MUiEngineNavigationGroup,
  MUiEngineNavigationNode,
  MUiEngineScreen
} from "./contracts.js";

export interface MUiRuntimeSnapshot {
  navigationGroups: MUiEngineNavigationGroup[];
  screens: MUiEngineScreen[];
  actions: MUiEngineAction[];
}

export class MUiEngineRuntime {
  private readonly mManifest: MUiEngineManifest;
  private readonly mScreensByRoute: Map<string, MUiEngineScreen>;
  private readonly mScreensByKey: Map<string, MUiEngineScreen>;
  private readonly mActionsByKey: Map<string, MUiEngineAction>;

  constructor(manifest: MUiEngineManifest) {
    this.mManifest = manifest;
    this.mScreensByRoute = new Map(manifest.screens.map((screen) => [screen.route, screen]));
    this.mScreensByKey = new Map(manifest.screens.map((screen) => [screen.screenKey, screen]));
    this.mActionsByKey = new Map(manifest.actions.map((action) => [action.actionKey, action]));
  }

  public MGetManifest(): MUiEngineManifest {
    return this.mManifest;
  }

  public MGetSnapshot(): MUiRuntimeSnapshot {
    return {
      navigationGroups: this.MGetVisibleNavigationGroups(),
      screens: this.MGetVisibleScreens(),
      actions: this.MGetVisibleActions()
    };
  }

  public MGetVisibleNavigationGroups(): MUiEngineNavigationGroup[] {
    return this.mManifest.navigationGroups
      .map((group) => ({
        ...group,
        items: group.items
          .map((item) => this.MMapVisibleNode(item))
          .filter((item): item is MUiEngineNavigationNode => item !== null)
      }))
      .filter((group) => group.items.length > 0);
  }

  public MResolveScreenByRoute(route: string): MUiEngineScreen | null {
    return this.mScreensByRoute.get(route) ?? null;
  }

  public MResolveScreenByKey(screenKey: string): MUiEngineScreen | null {
    return this.mScreensByKey.get(screenKey) ?? null;
  }

  public MResolveAction(actionKey: string): MUiEngineAction | null {
    return this.mActionsByKey.get(actionKey) ?? null;
  }

  public MGetVisibleScreens(): MUiEngineScreen[] {
    return this.mManifest.screens.filter((screen) => MCanRenderScreen(screen));
  }

  public MGetVisibleActions(): MUiEngineAction[] {
    return this.mManifest.actions.filter((action) => MCanRenderAction(action));
  }

  private MMapVisibleNode(node: MUiEngineNavigationNode): MUiEngineNavigationNode | null {
    const mappedChildren = node.children
      .map((child) => this.MMapVisibleNode(child))
      .filter((child): child is MUiEngineNavigationNode => child !== null);

    if (!MCanRenderNode(node) && mappedChildren.length === 0) {
      return null;
    }

    return {
      ...node,
      children: mappedChildren
    };
  }
}

export function MCanRenderNode(node: MUiEngineNavigationNode): boolean {
  return node.isVisible;
}

export function MCanRenderScreen(screen: MUiEngineScreen): boolean {
  return screen.isVisible;
}

export function MCanRenderAction(action: MUiEngineAction): boolean {
  return action.isVisible;
}

export function MCanExecuteNode(node: MUiEngineNavigationNode): boolean {
  return node.isEnabled;
}

export function MCanExecuteAction(action: MUiEngineAction): boolean {
  return action.isEnabled;
}