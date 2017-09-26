import { Timespan } from './../internal/timespan';

export class Config {
    restApiUrls: Array<string>;
    providerBlackList: Array<BlacklistedService>;
    solveLabels: boolean;
    proxyUrl: string;
    timespanPresets: Array<TimespanPreset>;
    colorList: Array<string>;
}

export class BlacklistedService {
    serviceId: string;
    apiUrl: string;
}

export class TimespanPreset {
    name: string;
    label: string;
    timespan: TimespanMomentTemplate;
    seperatorAfterThisItem?: boolean;
}

export class ParsedTimespanPreset {
    name: string;
    label: string;
    timespan: Timespan;
    seperatorAfterThisItem?: boolean;
}

export class TimespanMomentTemplate {
    to: string;
    from: string;
}
