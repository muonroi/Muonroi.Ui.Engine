import type { MUiEngineComponent, MUiEngineScreen } from "./contracts.js";

export interface MUiRenderAdapter {
  MResolveComponentType(componentType: string): string;
}

export class MDefaultUiRenderAdapter implements MUiRenderAdapter {
  private readonly mMap: Record<string, string>;

  constructor(componentMap?: Record<string, string>) {
    this.mMap = componentMap ?? {
      "page-content": "PageContent",
      "tab-content": "TabContent",
      panel: "Panel"
    };
  }

  public MResolveComponentType(componentType: string): string {
    return this.mMap[componentType] ?? componentType;
  }
}

export interface MUiRenderPlanItem {
  componentKey: string;
  slot: string;
  order: number;
  resolvedComponentType: string;
  props: Record<string, string>;
}

export function MBuildRenderPlan(screen: MUiEngineScreen, adapter: MUiRenderAdapter): MUiRenderPlanItem[] {
  return screen.components
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((component: MUiEngineComponent) => ({
      componentKey: component.componentKey,
      slot: component.slot,
      order: component.order,
      resolvedComponentType: adapter.MResolveComponentType(component.componentType),
      props: component.props
    }));
}