export class DatasetOptions {
    internalId: string;
    color = '#FF0000';
    visible = true;
    loading?: boolean;
    separateYAxe?= false;
    generalize?= false;

    constructor(internalId: string) {
        this.internalId = internalId;
    }
}

export class TimedDatasetOptions extends DatasetOptions {
    timestamp: number;

    constructor(internalId: string, timestamp: number) {
        super(internalId);
        this.timestamp = timestamp;
    }
}
