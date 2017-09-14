export interface DataSeries extends jquery.flot.dataSeries, SeriesOptions {
    id: string;
    url: string;
    data: any[];
}

interface SeriesOptions extends jquery.flot.seriesOptions {
    selected: boolean;
}
