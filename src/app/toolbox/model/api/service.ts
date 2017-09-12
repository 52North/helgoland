import { Parameter } from './parameter';

export class Service extends Parameter {
    providerUrl: string;
    quantities: ServiceQuantities;
}

export interface ServiceQuantities {
    platforms?: number;
    stations?: number;
}
