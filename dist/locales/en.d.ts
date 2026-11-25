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
    table: {
        searchPlaceholder: string;
        searchTable: string;
        clearSearch: string;
        selectedCount: (count: number, { number }: import("../index.js").MessageKit) => string;
        showAsTable: string;
        showAsCards: string;
        columnsShown: string;
        columns: string;
        bulkSelected: (count: number, { plural }: import("../index.js").MessageKit) => string;
        exportAction: string;
        deleteAction: string;
        filters: string;
        filterOption: ({ column, option }: {
            column: string;
            option: string;
        }) => string;
        filterChosen: ({ chosen, count }: {
            chosen: number;
            count: number;
        }, { number }: import("../index.js").MessageKit) => string;
        filterOptionCount: (count: number, { plural }: import("../index.js").MessageKit) => string;
        filterBy: (column: string) => string;
        searchOptions: (column: string) => string;
        noOptionMatches: string;
        optionRows: (count: number, { plural }: import("../index.js").MessageKit) => string;
        clear: string;
        clearFilters: string;
        emptyTitle: string;
        noMatchTitle: string;
        noMatchText: string;
        loadFailed: string;
        loadingRecords: string;
        selectAll: string;
        selectRow: (name: string) => string;
        selectRowById: (id: string) => string;
        openRow: (name: string) => string;
        closeRow: (name: string) => string;
        expandRow: string;
        collapseRow: string;
        loading: string;
        showing: ({ range, total, count }: {
            range: string;
            total: string;
            count: number;
        }, { plural }: import("../index.js").MessageKit) => string;
        rowsPerPageLabel: string;
        rowsPerPage: string;
        firstPage: string;
        previousPage: string;
        nextPage: string;
        lastPage: string;
        basketToolbar: string;
        basketSelected: (count: number, { plural }: import("../index.js").MessageKit) => string;
        basketSelectedNoun: ({ count, noun }: {
            count: number;
            noun: readonly [string, string];
        }, { plural }: import("../index.js").MessageKit) => string;
        basketSelectAll: (count: number, { number }: import("../index.js").MessageKit) => string;
        basketSelectNone: string;
        basketClear: string;
        moveAction: string;
        shareAction: string;
        comparisonName: string;
        comparisonMatrix: string;
        comparisonCount: (count: number, { plural }: import("../index.js").MessageKit) => string;
        comparisonSearch: string;
        comparisonDifferences: string;
        comparisonEmpty: string;
        comparisonAction: string;
        comparisonInfo: (feature: string) => string;
        comparisonPlan: (plan: string) => string;
        changeNew: string;
        changeRemoved: string;
        changeFrom: string;
        changeTo: string;
        region: string;
    };
    select: {
        placeholder: string;
        search: string;
        noResults: string;
        choosePlaceholder: string;
        nothingMatches: string;
        removeChoice: (label: string) => string;
        hiddenChoices: (labels: readonly string[], _kit: import("../index.js").MessageKit) => string;
        clear: string;
        atMost: (max: number, { number }: import("../index.js").MessageKit) => string;
        create: (text: string) => string;
    };
    field: {
        save: string;
        saving: string;
        cancel: string;
        addValue: string;
        edit: (label: string) => string;
        saveFailed: string;
        unsavedChanges: string;
        discard: string;
        showPassword: string;
        hidePassword: string;
        otpName: string;
        otpDigit: ({ index, count }: {
            index: number;
            count: number;
        }, { number }: import("../index.js").MessageKit) => string;
        copy: string;
        copyNamed: (what: string) => string;
        copied: string;
        copyFailed: string;
        copyCode: string;
        code: string;
        exportCsv: string;
        moreOptions: (label: string) => string;
    };
    status: {
        healthOk: string;
        healthWarning: string;
        healthDown: string;
        healthUnknown: string;
        healthDisabled: string;
        stale: string;
        loadFailed: string;
        refreshFailed: string;
        historyEmpty: string;
        historyUp: ({ count, unit }: {
            count: number;
            unit?: {
                one: string;
                other: string;
            };
        }, { plural }: import("../index.js").MessageKit) => string;
        historyState: ({ status, count, unit, times, upSaid, }: {
            status: Exclude<import("../index.js").HealthStatus, "ok">;
            count: number;
            unit?: {
                one: string;
                other: string;
            };
            times: readonly string[];
            upSaid: boolean;
        }, { plural, number, list }: import("../index.js").MessageKit) => string;
        historyMore: (count: number, { number }: import("../index.js").MessageKit) => string;
        historyName: ({ label, summary }: {
            label: string;
            summary: string;
        }) => string;
        remove: string;
        dismiss: string;
        loadingName: string;
        loading: string;
        progress: string;
        stepCompleted: string;
    };
    layout: {
        panel: string;
        resize: string;
        resizePanel: (panel: string) => string;
        contents: string;
        sectionMenu: string;
        backToTop: string;
        dependencyGraph: string;
        nodeStatus: ({ name, status }: {
            name: string;
            status: string;
        }) => string;
        traceStatus: (status: string) => string;
        traceCalls: (names: readonly string[], _kit: import("../index.js").MessageKit) => string;
        traceCalledBy: (names: readonly string[], _kit: import("../index.js").MessageKit) => string;
        traceHint: string;
        connections: (count: number, { plural }: import("../index.js").MessageKit) => string;
        timelineItem: ({ title, status }: {
            title: string;
            status: string;
        }) => string;
        timelineCompleted: string;
        timelineInProgress: string;
        timelinePending: string;
        timelineFailed: string;
        timelineWarning: string;
        copyCommit: string;
        copyCommitNamed: (hash: string) => string;
        commitCopied: string;
        open: string;
        people: string;
        peopleList: (names: readonly string[], _kit: import("../index.js").MessageKit) => string;
        morePeople: (names: readonly string[], { number }: import("../index.js").MessageKit) => string;
    };
    shell: {
        skipToPage: string;
        navigation: string;
        openNavigation: string;
        closeNavigation: string;
        mainNavigation: string;
        pagesUnder: (entry: string) => string;
        collapse: string;
        collapseTarget: string;
        expand: string;
        expandSidebar: string;
        unseenCounts: string;
        unseenWarning: string;
        unseenWrong: string;
        entryWithBadge: ({ entry, badge }: {
            entry: string;
            badge: string;
        }) => string;
        breadcrumb: string;
        showHiddenPages: string;
        home: string;
        pageNotFound: string;
        account: string;
        signOut: string;
        singleSignOn: string;
        signInDivider: string;
        state: string;
        allGood: string;
        stateButton: ({ label, state }: {
            label: string;
            state: string;
        }) => string;
        stateLead: ({ lead, counts }: {
            lead: string;
            counts: string;
        }) => string;
        stateCounts: ({ danger, warning, success }: {
            danger: number;
            warning: number;
            success: number;
        }, { plural }: import("../index.js").MessageKit) => string;
    };
    look: {
        theme: string;
        system: string;
        light: string;
        dark: string;
        systemNow: (theme: import("../index.js").Theme) => string;
        themeButton: ({ state, press }: {
            state: string;
            press: string;
        }) => string;
        followsSystem: (theme: import("../index.js").Theme) => string;
        alwaysLight: string;
        alwaysDark: string;
        pressToFollowSystem: string;
        pressForLight: string;
        pressForDark: string;
        accentAndMaterial: string;
        lookName: ({ accent, material }: {
            accent: string;
            material: string;
        }) => string;
        lookDescription: ({ accent, material }: {
            accent: string;
            material: string;
        }) => string;
        accent: string;
        material: string;
        accentNeutral: string;
        accentViolet: string;
        accentIndigo: string;
        accentBlue: string;
        accentBloom: string;
        accentLagoon: string;
        accentAurora: string;
        accentDusk: string;
        accentGolden: string;
        materialFlat: string;
        materialGlass: string;
    };
    error: {
        otherPage: string;
        otherPart: string;
        otherRetry: string;
        otherWait: string;
        offlinePage: string;
        offlinePart: string;
        offlineRetry: string;
        offlineWait: string;
        chunkPage: string;
        chunkPart: string;
        chunkReload: string;
        tryAgain: string;
        reload: string;
        backToHome: string;
        details: string;
    };
    notFound: {
        pageTitle: string;
        pageDescription: string;
        backToHome: string;
        previousPage: string;
        title: string;
        description: string;
        errorBadge: (code: string) => string;
        errorHeading: ({ code, title }: {
            code: string;
            title: string;
        }) => string;
        goHome: string;
        goBack: string;
        helpfulLinks: string;
        suggestions: string;
        illustration: string;
    };
    router: {
        signInTitle: string;
        signInDescription: string;
        signIn: string;
        forbiddenTitle: string;
        forbiddenDescription: string;
        leaveTitle: string;
        leaveMessage: string;
        stay: string;
        leave: string;
    };
    shortcuts: {
        title: string;
        general: string;
        navigation: string;
        showShortcuts: string;
        showAgain: (keys: string) => string;
        toggleSidebar: string;
    };
    keys: {
        ctrl: string;
        alt: string;
        shift: string;
        meta: string;
        command: string;
        control: string;
        option: string;
        enter: string;
        escape: string;
        escapeSpoken: string;
        tab: string;
        space: string;
        backspace: string;
        delete: string;
        deleteSpoken: string;
        arrowUp: string;
        arrowDown: string;
        arrowLeft: string;
        arrowRight: string;
        pageUp: string;
        pageUpSpoken: string;
        pageDown: string;
        pageDownSpoken: string;
        home: string;
        end: string;
        then: string;
    };
    code: {
        original: string;
        modified: string;
        side: ({ label, version }: {
            label: string;
            version: string;
        }) => string;
        changes: (count: number, { plural }: import("../index.js").MessageKit) => string;
        previousChange: string;
        nextChange: string;
        find: string;
        replace: string;
        findNext: string;
        findPrevious: string;
        selectMatches: string;
        matchCase: string;
        regexp: string;
        byWord: string;
        replaceMatch: string;
        replaceAll: string;
        close: string;
        currentMatch: string;
        onLine: string;
        replacedMatches: string;
        replacedMatchOnLine: string;
        goToLine: string;
        go: string;
        controlCharacter: string;
        selectionDeleted: string;
        foldedLines: string;
        unfoldedLines: string;
        foldedTo: string;
        foldedCode: string;
        unfold: string;
        foldLine: string;
        unfoldLine: string;
        diagnostics: string;
        noDiagnostics: string;
        unchangedLines: string;
        accept: string;
        reject: string;
        revertChunk: string;
    };
    ai: {
        linkBlocked: string;
        emailHost: string;
        table: string;
        plainText: string;
        assistant: string;
        streaming: string;
        thinking: string;
        stopped: string;
        generating: string;
        unfinished: string;
        unfinishedReason: string;
        tryAgain: string;
        idle: string;
        sources: string;
        toolsUsed: (count: number, { plural }: import("../index.js").MessageKit) => string;
        toolSuccess: string;
        toolRunning: string;
        toolError: string;
        copied: string;
        copy: string;
        responseCopied: string;
        copyResponse: string;
        regenerate: string;
        regenerateResponse: string;
        goodResponse: string;
        poorResponse: string;
        response: string;
        activityTitle: string;
        activityRunning: string;
        stepsDone: ({ done, count }: {
            done: number;
            count: number;
        }, { number }: import("../index.js").MessageKit) => string;
        notStarted: string;
        expandAll: string;
        collapseAll: string;
        codeSnippet: string;
        noActivity: string;
        inputLabel: string;
        outputLabel: string;
        notesLabel: string;
        metadataEntry: (key: string) => string;
        send: string;
        stop: string;
        suggestions: string;
        attachments: string;
        attachmentPreparing: string;
        removeAttachment: (label: string) => string;
    };
    upload: {
        dropTitle: string;
        dropSubtitle: string;
        upTo: (size: string) => string;
        label: string;
        ready: string;
        processing: string;
        uploading: (progress: string) => string;
        files: (count: number, { number }: import("../index.js").MessageKit) => string;
        clearCompleted: string;
        tooLarge: (size: string) => string;
        failed: string;
        retry: (name: string) => string;
        remove: (name: string) => string;
    };
    notification: {
        notifications: string;
        unread: (count: number, { plural }: import("../index.js").MessageKit) => string;
        overflow: (most: number, { number }: import("../index.js").MessageKit) => string;
        newCount: (count: number, { number }: import("../index.js").MessageKit) => string;
        markAllRead: string;
        readAll: string;
        close: string;
        loading: string;
        empty: string;
        readFailed: string;
        tryAgain: string;
        markRead: string;
        markNotificationRead: string;
    };
    search: {
        label: string;
        placeholder: string;
        search: string;
        searchIn: (list: string) => string;
        back: string;
        backFrom: (list: string) => string;
        close: string;
        recent: string;
        recentSearches: string;
        opensList: string;
        searching: string;
        results: ({ count, more }: {
            count: number;
            more: number;
        }, { plural, number }: import("../index.js").MessageKit) => string;
        inList: ({ list, results }: {
            list: string;
            results: string;
        }) => string;
        noResultsFor: (query: string) => string;
        more: (count: number, { number }: import("../index.js").MessageKit) => string;
        failed: string;
        tryAgain: string;
    };
    tour: {
        position: ({ step, count }: {
            step: number;
            count: number;
        }, { number }: import("../index.js").MessageKit) => string;
        skip: string;
        goToStep: (step: number, { number }: import("../index.js").MessageKit) => string;
        back: string;
        next: string;
        done: string;
    };
    toast: {
        close: string;
        undoTitle: string;
        undoDescription: string;
        undo: string;
        restored: string;
        islandName: (label: string) => string;
        closeIsland: (label: string) => string;
        dismiss: string;
        copyReference: ({ label, value }: {
            label: string;
            value: string;
        }) => string;
    };
    dialog: {
        close: string;
        resize: string;
        width: (pixels: number, { number }: import("../index.js").MessageKit) => string;
        content: string;
        cancel: string;
        working: string;
        done: string;
        slideToConfirm: string;
        confirmed: string;
    };
};
/** The package's words, by namespace: English's, which every language's catalogue gives in full. */
export type Messages = typeof en;
