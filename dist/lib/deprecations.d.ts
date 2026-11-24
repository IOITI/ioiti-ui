/** What is deprecated: a component's prop, one value of a prop, or a name the package exports. */
export type DeprecationKind = 'prop' | 'value' | 'export';
export interface Deprecation {
    kind: DeprecationKind;
    /** The components that take the prop or the value (`kind` prop or value). */
    components?: readonly string[];
    /** The prop that takes the value (`kind` value). */
    prop?: string;
    /** The old name, or the old value. */
    old: string;
    /** What replaces it, as an application writes it. */
    new: string;
    /** The version it was deprecated in. */
    since: string;
    /** What else changes with the name (an inverted meaning, a value renamed with it). */
    note?: string;
}
export declare const DEPRECATIONS: {
    readonly 'health-status-label': {
        readonly kind: "export";
        readonly old: "HEALTH_STATUS_LABEL";
        readonly new: "useMessages().status (healthOk…)";
        readonly since: "0.29.0";
    };
    readonly 'accent-label': {
        readonly kind: "export";
        readonly old: "ACCENT_LABEL";
        readonly new: "accentName(accent, useMessages().look)";
        readonly since: "0.29.0";
    };
    readonly 'material-label': {
        readonly kind: "export";
        readonly old: "MATERIAL_LABEL";
        readonly new: "materialName(material, useMessages().look)";
        readonly since: "0.29.0";
    };
    readonly 'theme-label': {
        readonly kind: "export";
        readonly old: "themeLabel";
        readonly new: "themeButtonLabel(preference, theme, useMessages().look)";
        readonly since: "0.29.0";
    };
    readonly 'default-home': {
        readonly kind: "export";
        readonly old: "DEFAULT_HOME";
        readonly new: "useMessages().shell.home";
        readonly since: "0.29.0";
    };
    readonly 'page-not-found': {
        readonly kind: "export";
        readonly old: "PAGE_NOT_FOUND";
        readonly new: "useMessages().shell.pageNotFound";
        readonly since: "0.29.0";
    };
    readonly 'combobox-on-value-change': {
        readonly kind: "prop";
        readonly components: readonly ["Combobox"];
        readonly old: "onValueChange";
        readonly new: "onChange";
        readonly since: "0.30.0";
    };
    readonly 'prompt-composer-on-value-change': {
        readonly kind: "prop";
        readonly components: readonly ["PromptComposer"];
        readonly old: "onValueChange";
        readonly new: "onChange";
        readonly since: "0.30.0";
    };
    readonly 'animated-tabs-active-tab': {
        readonly kind: "prop";
        readonly components: readonly ["AnimatedTabs"];
        readonly old: "activeTab";
        readonly new: "value";
        readonly since: "0.30.0";
    };
    readonly 'animated-tabs-default-tab': {
        readonly kind: "prop";
        readonly components: readonly ["AnimatedTabs"];
        readonly old: "defaultTab";
        readonly new: "defaultValue";
        readonly since: "0.30.0";
    };
    readonly 'smooth-accordion-default-open': {
        readonly kind: "prop";
        readonly components: readonly ["SmoothAccordion"];
        readonly old: "defaultOpen";
        readonly new: "defaultValue";
        readonly since: "0.30.0";
    };
    readonly 'notification-bell-is-open': {
        readonly kind: "prop";
        readonly components: readonly ["NotificationBell"];
        readonly old: "isOpen";
        readonly new: "open";
        readonly since: "0.30.0";
    };
    readonly 'aria-label-camel': {
        readonly kind: "prop";
        readonly components: readonly ["Slider", "RangeSlider", "LineChart", "FanChart", "BarChart", "DonutChart", "FunnelChart", "ActivityHeatmap", "LiveLineChart"];
        readonly old: "ariaLabel";
        readonly new: "aria-label";
        readonly since: "0.30.0";
    };
    readonly 'is-loading': {
        readonly kind: "prop";
        readonly components: readonly ["DataTable", "AdvancedDataTable", "TimeRangePicker"];
        readonly old: "isLoading";
        readonly new: "loading";
        readonly since: "0.30.0";
    };
    readonly 'button-is-loading': {
        readonly kind: "prop";
        readonly components: readonly ["Button"];
        readonly old: "isLoading";
        readonly new: "pending";
        readonly since: "0.30.0";
    };
    readonly 'save-bar-saving': {
        readonly kind: "prop";
        readonly components: readonly ["SaveBar"];
        readonly old: "saving";
        readonly new: "pending";
        readonly since: "0.30.0";
    };
    readonly busy: {
        readonly kind: "prop";
        readonly components: readonly ["PromptComposer", "AttachmentChip"];
        readonly old: "busy";
        readonly new: "pending";
        readonly since: "0.30.0";
    };
    readonly 'hide-close-button': {
        readonly kind: "prop";
        readonly components: readonly ["SettleModal"];
        readonly old: "hideCloseButton";
        readonly new: "showCloseButton";
        readonly since: "0.30.0";
        readonly note: "the other way round: hideCloseButton is showCloseButton={false}";
    };
    readonly 'show-close': {
        readonly kind: "prop";
        readonly components: readonly ["FlysheetContent"];
        readonly old: "showClose";
        readonly new: "showCloseButton";
        readonly since: "0.30.0";
    };
    readonly 'link-to': {
        readonly kind: "prop";
        readonly components: readonly ["ButtonLink", "TextLink", "PeekLink", "StateChip"];
        readonly old: "to";
        readonly new: "href";
        readonly since: "0.30.0";
    };
    readonly 'panel-dense': {
        readonly kind: "prop";
        readonly components: readonly ["Panel"];
        readonly old: "dense";
        readonly new: "density=\"compact\"";
        readonly since: "0.30.0";
    };
    readonly 'empty-state-compact': {
        readonly kind: "prop";
        readonly components: readonly ["EmptyState"];
        readonly old: "compact";
        readonly new: "density=\"compact\"";
        readonly since: "0.30.0";
    };
    readonly 'upload-variant-compact': {
        readonly kind: "value";
        readonly components: readonly ["AnimatedFileUpload"];
        readonly prop: "variant";
        readonly old: "compact";
        readonly new: "density=\"compact\"";
        readonly since: "0.30.0";
    };
    readonly 'meter-tone-positive': {
        readonly kind: "value";
        readonly components: readonly ["ProgressBar", "BarList", "Meter", "Slider", "LineChart", "FanChart"];
        readonly prop: "tone";
        readonly old: "positive";
        readonly new: "success";
        readonly since: "0.30.0";
    };
    readonly 'meter-tone-negative': {
        readonly kind: "value";
        readonly components: readonly ["ProgressBar", "BarList", "Meter", "Slider", "LineChart", "FanChart"];
        readonly prop: "tone";
        readonly old: "negative";
        readonly new: "danger";
        readonly since: "0.30.0";
    };
    readonly 'kpi-tone-negative': {
        readonly kind: "value";
        readonly components: readonly ["KpiTile"];
        readonly prop: "tone";
        readonly old: "negative";
        readonly new: "danger";
        readonly since: "0.30.0";
    };
    readonly 'sidebar-badge-negative': {
        readonly kind: "value";
        readonly components: readonly ["Sidebar", "AppShell"];
        readonly prop: "badgeTone";
        readonly old: "negative";
        readonly new: "danger";
        readonly since: "0.30.0";
    };
    readonly 'toast-variant': {
        readonly kind: "prop";
        readonly components: readonly ["VelocityToast", "UndoToast", "useToast"];
        readonly old: "variant";
        readonly new: "tone";
        readonly since: "0.30.0";
        readonly note: "its values too: default is neutral, error is danger";
    };
    readonly 'drag-to-confirm-variant': {
        readonly kind: "prop";
        readonly components: readonly ["DragToConfirm"];
        readonly old: "variant";
        readonly new: "tone";
        readonly since: "0.30.0";
        readonly note: "its value default is neutral";
    };
    readonly 'button-destructive': {
        readonly kind: "value";
        readonly components: readonly ["Button", "ButtonLink"];
        readonly prop: "variant";
        readonly old: "destructive";
        readonly new: "danger";
        readonly since: "0.30.0";
    };
    readonly 'bar-chart-tone': {
        readonly kind: "prop";
        readonly components: readonly ["BarChart"];
        readonly old: "tone";
        readonly new: "colorBy";
        readonly since: "0.30.0";
    };
    readonly 'format-tone': {
        readonly kind: "export";
        readonly old: "Tone";
        readonly new: "SignTone";
        readonly since: "0.30.0";
    };
    readonly 'velocity-toast-variant-type': {
        readonly kind: "export";
        readonly old: "VelocityToastVariant";
        readonly new: "StatusTone";
        readonly since: "0.30.0";
    };
    readonly 'undo-toast-variant-type': {
        readonly kind: "export";
        readonly old: "UndoToastVariant";
        readonly new: "StatusTone";
        readonly since: "0.30.0";
    };
    readonly 'drag-confirm-variant-type': {
        readonly kind: "export";
        readonly old: "DragConfirmVariant";
        readonly new: "StatusTone";
        readonly since: "0.30.0";
    };
};
export type DeprecationId = keyof typeof DEPRECATIONS;
