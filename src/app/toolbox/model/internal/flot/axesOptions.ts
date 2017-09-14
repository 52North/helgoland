export interface AxesOptions extends jquery.flot.axisOptions {
    uom?: string;
    tsColors?: Array<string>;
    timezone?: string;
    additionalWidth?: number;
    panRange?: boolean;
}
