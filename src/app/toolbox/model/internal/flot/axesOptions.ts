export interface AxesOptions extends jquery.flot.axisOptions {
    uom?: string;
    internalIds?: Array<string>;
    tsColors?: Array<string>;
    timezone?: string;
    additionalWidth?: number;
    panRange?: boolean;
}
