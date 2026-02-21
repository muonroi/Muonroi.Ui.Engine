export type MPermissionType = "menu" | "tab" | "action";

export interface MUiEngineManifest {
  schemaVersion: "mui.engine.v1";
  generatedAtUtc: string;
  userId: string;
  tenantId?: string | null;
  navigationGroups: MUiEngineNavigationGroup[];
  screens: MUiEngineScreen[];
  actions: MUiEngineAction[];
  dataSources: MUiEngineDataSource[];
}

export interface MUiEngineNavigationGroup {
  groupName: string;
  groupDisplayName: string;
  items: MUiEngineNavigationNode[];
}

export interface MUiEngineNavigationNode {
  nodeKey: string;
  uiKey: string;
  parentUiKey?: string | null;
  title: string;
  route: string;
  type: MPermissionType;
  icon?: string | null;
  order: number;
  isVisible: boolean;
  isEnabled: boolean;
  disabledReason?: string | null;
  screenKey?: string | null;
  actionKeys: string[];
  children: MUiEngineNavigationNode[];
}

export interface MUiEngineScreen {
  screenKey: string;
  uiKey: string;
  title: string;
  route: string;
  isVisible: boolean;
  isEnabled: boolean;
  disabledReason?: string | null;
  dataSourceKey?: string | null;
  actionKeys: string[];
  layout: MUiEngineLayout;
  components: MUiEngineComponent[];
}

export interface MUiEngineLayout {
  template: string;
  areas: MUiEngineLayoutArea[];
}

export interface MUiEngineLayoutArea {
  areaKey: string;
  purpose: string;
  order: number;
}

export interface MUiEngineComponent {
  componentKey: string;
  uiKey: string;
  screenKey: string;
  componentType: string;
  slot: string;
  order: number;
  dataSourceKey?: string | null;
  actionKeys: string[];
  props: Record<string, string>;
}

export interface MUiEngineAction {
  actionKey: string;
  uiKey: string;
  permissionName: string;
  label: string;
  route: string;
  actionType: string;
  isVisible: boolean;
  isEnabled: boolean;
  disabledReason?: string | null;
  targetScreenKey?: string | null;
}

export interface MUiEngineDataSource {
  dataSourceKey: string;
  uiKey: string;
  screenKey: string;
  endpointPath: string;
  httpMethod: string;
  requestModel?: string | null;
  responseModel?: string | null;
}