namespace Muonroi.Ui.Engine.Mvc.Models;

public sealed class MUiEngineManifest
{
    public string SchemaVersion { get; set; } = string.Empty;
    public DateTime GeneratedAtUtc { get; set; }
    public Guid UserId { get; set; }
    public string? TenantId { get; set; }
    public List<MUiEngineNavigationGroup> NavigationGroups { get; set; } = [];
    public List<MUiEngineScreen> Screens { get; set; } = [];
    public List<MUiEngineAction> Actions { get; set; } = [];
    public List<MUiEngineDataSource> DataSources { get; set; } = [];
}

public sealed class MUiEngineNavigationGroup
{
    public string GroupName { get; set; } = string.Empty;
    public string GroupDisplayName { get; set; } = string.Empty;
    public List<MUiEngineNavigationNode> Items { get; set; } = [];
}

public sealed class MUiEngineNavigationNode
{
    public string NodeKey { get; set; } = string.Empty;
    public string UiKey { get; set; } = string.Empty;
    public string? ParentUiKey { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Route { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int Order { get; set; }
    public bool IsVisible { get; set; }
    public bool IsEnabled { get; set; }
    public string? DisabledReason { get; set; }
    public string? ScreenKey { get; set; }
    public List<string> ActionKeys { get; set; } = [];
    public List<MUiEngineNavigationNode> Children { get; set; } = [];
}

public sealed class MUiEngineScreen
{
    public string ScreenKey { get; set; } = string.Empty;
    public string UiKey { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Route { get; set; } = string.Empty;
    public bool IsVisible { get; set; }
    public bool IsEnabled { get; set; }
    public string? DisabledReason { get; set; }
    public string? DataSourceKey { get; set; }
    public List<string> ActionKeys { get; set; } = [];
}

public sealed class MUiEngineAction
{
    public string ActionKey { get; set; } = string.Empty;
    public string UiKey { get; set; } = string.Empty;
    public string PermissionName { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Route { get; set; } = string.Empty;
    public string ActionType { get; set; } = string.Empty;
    public bool IsVisible { get; set; }
    public bool IsEnabled { get; set; }
    public string? DisabledReason { get; set; }
    public string? TargetScreenKey { get; set; }
}

public sealed class MUiEngineDataSource
{
    public string DataSourceKey { get; set; } = string.Empty;
    public string UiKey { get; set; } = string.Empty;
    public string ScreenKey { get; set; } = string.Empty;
    public string EndpointPath { get; set; } = string.Empty;
    public string HttpMethod { get; set; } = string.Empty;
    public string? RequestModel { get; set; }
    public string? ResponseModel { get; set; }
}