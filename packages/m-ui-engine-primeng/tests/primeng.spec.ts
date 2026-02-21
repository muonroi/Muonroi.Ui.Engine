import { describe, expect, it } from "vitest";
import {
  MMapActionsToPrimeNgButtons,
  MMapNavigationGroupsToPrimeNgMenu,
  MPrimeNgRenderAdapter
} from "../src/index.js";
import { MBuildRenderPlan, type MUiEngineScreen } from "@muonroi/ui-engine-core";

describe("PrimeNG adapter", () => {
  it("maps navigation groups to PrimeNG menu model", () => {
    const menu = MMapNavigationGroupsToPrimeNgMenu([
      {
        groupName: "admin",
        groupDisplayName: "Administration",
        items: [
          {
            nodeKey: "node:admin",
            uiKey: "admin",
            title: "Admin",
            route: "/admin",
            type: "menu",
            order: 1,
            isVisible: true,
            isEnabled: true,
            actionKeys: [],
            children: []
          }
        ]
      }
    ]);

    expect(menu).toHaveLength(1);
    expect(menu[0].label).toBe("Administration");
    expect(menu[0].items?.[0].routerLink).toBe("/admin");
  });

  it("maps actions to PrimeNG button model", () => {
    const buttons = MMapActionsToPrimeNgButtons([
      {
        actionKey: "action:a",
        uiKey: "a",
        permissionName: "A",
        label: "Go",
        route: "/go",
        actionType: "navigate",
        isVisible: true,
        isEnabled: false
      }
    ]);

    expect(buttons).toHaveLength(1);
    expect(buttons[0].disabled).toBe(true);
    expect(buttons[0].icon).toBe("pi pi-arrow-right");
  });

  it("provides default component mapping for render plan", () => {
    const screen: MUiEngineScreen = {
      screenKey: "screen:s",
      uiKey: "s",
      title: "S",
      route: "/s",
      isVisible: true,
      isEnabled: true,
      actionKeys: [],
      layout: {
        template: "default-page",
        areas: []
      },
      components: [
        {
          componentKey: "component:s:main",
          uiKey: "s",
          screenKey: "screen:s",
          componentType: "page-content",
          slot: "main",
          order: 0,
          actionKeys: [],
          props: {}
        }
      ]
    };

    const plan = MBuildRenderPlan(screen, new MPrimeNgRenderAdapter());
    expect(plan[0].resolvedComponentType).toBe("MPrimeNgPageContent");
  });
});