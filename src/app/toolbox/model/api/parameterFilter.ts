

export interface ParameterFilter {
    valueTypes?: string;
    platformTypes?: string;
    expanded?: boolean;
}

export interface DataParameterFilter extends ParameterFilter {
    format?: string;
}
