export declare const en: {
    format: {
        milliseconds: string;
        seconds: string;
        minutes: string;
        hours: string;
        days: string;
        future: (duration: string) => string;
        past: (duration: string) => string;
        bytes: string;
        kilobytes: string;
        megabytes: string;
        gigabytes: string;
    };
    date: {
        previousMonth: string;
        nextMonth: string;
        pickerDialog: string;
        datePlaceholder: string;
        rangePlaceholder: string;
        range: ({ from, to }: {
            from: string;
            to?: string;
        }) => string;
        lastDays: (count: number, { plural }: import("../index.js").MessageKit) => string;
        allTime: string;
        customRange: string;
    };
    heatmap: {
        unit: (count: number, { plural }: import("../index.js").MessageKit) => string;
        less: string;
        more: string;
        summaryPerWeek: ({ total, unit }: {
            total: string;
            unit: string;
        }) => string;
        summaryLastYear: ({ total, unit }: {
            total: string;
            unit: string;
        }) => string;
        summaryLastMonths: ({ total, unit, months }: {
            total: string;
            unit: string;
            months: number;
        }, { plural }: import("../index.js").MessageKit) => string;
        summaryLastWeeks: ({ total, unit, weeks }: {
            total: string;
            unit: string;
            weeks: number;
        }, { plural }: import("../index.js").MessageKit) => string;
        best: ({ title, value }: {
            title: string;
            value: string;
        }) => string;
        worst: ({ title, value }: {
            title: string;
            value: string;
        }) => string;
        peak: ({ title, value }: {
            title: string;
            value: string;
        }) => string;
        hourCell: ({ day, hour }: {
            day: string;
            hour: string;
        }) => string;
        label: (summary: string) => string;
        status: ({ title, value }: {
            title: string;
            value: string;
        }) => string;
    };
    timeRange: {
        today: string;
        yesterday: string;
        todaySoFar: string;
        thisWeek: string;
        thisWeekSoFar: string;
        lastWeek: string;
        thisMonth: string;
        thisMonthSoFar: string;
        lastMonth: string;
        thisYear: string;
        thisYearSoFar: string;
        lastSpan: (span: {
            count: number;
            unit: import("../index.js").TimeUnit;
        }, kit: import("../index.js").MessageKit) => string;
        nextSpan: (span: {
            count: number;
            unit: import("../index.js").TimeUnit;
        }, kit: import("../index.js").MessageKit) => string;
        now: string;
        ago: (span: {
            count: number;
            unit: import("../index.js").TimeUnit;
        }, kit: import("../index.js").MessageKit) => string;
        later: (span: {
            count: number;
            unit: import("../index.js").TimeUnit;
        }, kit: import("../index.js").MessageKit) => string;
        rounded: ({ moved, unit }: {
            moved: string;
            unit: import("../index.js").TimeUnit;
        }) => string;
        ends: ({ from, to }: {
            from: string;
            to: string;
        }) => string;
        arrow: string;
        showEnds: string;
        quickSelect: string;
        beforeOrAfterNow: string;
        lastOption: string;
        nextOption: string;
        howMany: string;
        unit: string;
        unitOption: ({ unit }: {
            count: number;
            unit: import("../index.js").TimeUnit;
        }, _kit: import("../index.js").MessageKit) => string;
        apply: string;
        commonlyUsed: string;
        recentlyUsed: string;
        startOfRange: string;
        endOfRange: string;
        startTabs: string;
        endTabs: string;
        absolute: string;
        relative: string;
        nowTab: string;
        time: string;
        agoOption: string;
        fromNowOption: string;
        roundTo: (unit: import("../index.js").TimeUnit) => string;
        nowExplained: string;
        setStartToNow: string;
        setEndToNow: string;
        update: string;
        refresh: string;
        refreshing: string;
        autoRefresh: string;
        refreshOff: string;
        refreshEvery: ({ count, unit }: {
            count: number;
            unit: "s" | "m" | "h";
        }, { number }: import("../index.js").MessageKit) => string;
        refreshInterval: string;
        refreshUnit: string;
        startRefresh: string;
        stopRefresh: string;
    };
    chart: {
        noData: string;
        tableCaption: string;
        seriesLegend: string;
        legend: string;
        detailsColumn: string;
        total: string;
        namedValue: ({ name, value }: {
            name: string;
            value: string;
        }) => string;
        lineChartName: (series: readonly string[], _kit: import("../index.js").MessageKit) => string;
        timeColumn: string;
        fanChartName: (lines: readonly string[], _kit: import("../index.js").MessageKit) => string;
        placeColumn: string;
        bandRange: ({ low, high }: {
            low: string;
            high: string;
        }) => string;
        barChartName: ({ series, count }: {
            series: readonly string[];
            count: number;
        }, { plural }: import("../index.js").MessageKit) => string;
        categoryColumn: string;
        donutChartName: (total: string) => string;
        gaugeChartName: (total: string) => string;
        otherSegment: string;
        segmentColumn: string;
        valueColumn: string;
        shareColumn: string;
        funnelChartName: ({ count, first, last }: {
            count: number;
            first: string;
            last: string;
        }, { plural }: import("../index.js").MessageKit) => string;
        funnelTableCaption: string;
        conversionSummary: string;
        biggestDrop: string;
        funnelCounted: string;
        shareOfFirstStage: string;
        lossToNextStage: string;
        noLoss: string;
        stageColumn: string;
        firstStageShareColumn: string;
        previousPeriod: string;
        statCardName: ({ name, value, direction, change }: {
            name: string;
            value: string;
            direction: "up" | "down" | "flat";
            change: string;
        }) => string;
        trendName: ({ name, first, last }: {
            name: string;
            first: string;
            last: string;
        }) => string;
        trendPoint: (index: number) => string;
        sparklineSummary: ({ first, last, high, low }: {
            first: string;
            last: string;
            high: string;
            low: string;
        }) => string;
        liveChartName: ({ span, value, unit }: {
            span: string;
            value?: string;
            unit: string;
        }) => string;
        liveWindow: (span: string) => string;
        pauseLive: string;
        resumeLive: string;
        live: string;
        paused: string;
        livePausedStatus: string;
        now: string;
        beforeNow: (span: string) => string;
    };
    clock: {
        title: string;
        name: string;
        cities: (count: number, { plural }: import("../index.js").MessageKit) => string;
        timeZones: string;
        row: ({ time, city }: {
            time: string;
            city: string;
        }) => string;
    };
    ledger: {
        title: string;
        count: (count: number, { plural }: import("../index.js").MessageKit) => string;
        restore: string;
        restoreEntry: ({ restore, action }: {
            restore: string;
            action: string;
        }) => string;
        current: string;
        changes: string;
    };
    log: {
        empty: string;
        search: (label: string) => string;
        searchPlaceholder: string;
        matchPosition: ({ index, count }: {
            index: number;
            count: number;
        }) => string;
        noMatch: string;
        previousMatch: string;
        previousMatchHint: (keys: string) => string;
        nextMatch: string;
        nextMatchHint: (keys: string) => string;
        wrap: string;
        wrapped: string;
        unwrapped: string;
        copy: string;
        download: string;
        downloadAs: (name: string) => string;
        dropped: (count: number, { plural }: import("../index.js").MessageKit) => string;
        jumpToEnd: string;
    };
    numberInput: {
        decrease: string;
        increase: string;
        rangeFrom: (label: string) => string;
        rangeTo: (label: string) => string;
        rangeValue: ({ from, to }: {
            from: string;
            to: string;
        }) => string;
        rangeName: string;
        changeNone: string;
        changeUp: (figure: string) => string;
        changeDown: (figure: string) => string;
    };
};
/** The package's words, by namespace: English's, which every language's catalogue gives in full. */
export type Messages = typeof en;
