import { Timespan } from '../index';

export class Config {

    restApiUrls: Array<any>;

    providerBlackList: Array<any>;

    solveLabels: boolean;

    proxyUrl: string;

    timespanPresets: Array<TimespanPreset>;
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
