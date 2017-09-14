import { ParameterFilter } from './../api/parameterFilter';

export interface Provider {
    id: string;
    url: string;
}

export interface FilteredProvider extends Provider {
    filter: ParameterFilter;
}
