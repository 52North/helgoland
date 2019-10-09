import { Settings } from '@helgoland/core';
import { MomentInputObject } from 'moment';

export interface HelgolandSettings extends Settings {

    defaultTimeseriesTimeduration: {
        duration: MomentInputObject;
        align: 'start' | 'center' | 'end';
    };

}
