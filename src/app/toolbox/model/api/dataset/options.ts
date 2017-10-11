export class DatasetOptions {
    internalId: string;
    color: string;
    visible = true;
    loading?: boolean;
    separateYAxe?= false;
    generalize?= false;

    constructor(internalId: string, color: string) {
        this.internalId = internalId;
        this.color = color;
    }
}

export class TimedDatasetOptions extends DatasetOptions {
    timestamp: number;

    constructor(internalId: string, color: string, timestamp: number) {
        super(internalId, color);
        this.timestamp = timestamp;
    }
}
