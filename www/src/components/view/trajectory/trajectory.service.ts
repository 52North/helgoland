import { Injectable } from '@angular/core';
import { deserialize } from 'class-transformer';

import { Dataset } from '../../../model';
import { LocatedTimeValueEntry } from './../../../model/api/data';
import { Timespan } from './../../../model/internal/timespan';
import { ApiInterface } from './../../../services/api-interface/api-interface.service';
import { LocalStorage } from './../../../services/local-storage/local-storage.service';

const TRAJECTORY_CACHE_PARAM = 'trajectory';

@Injectable()
export class TrajectoryService {

    public model: {
        trajectory?: Dataset,
        data?: Array<LocatedTimeValueEntry>,
        geometry?: GeoJSON.LineString
    };

    constructor(
        private api: ApiInterface,
        private localStorage: LocalStorage
    ) {
        this.model = {};
        this.loadTrajectory();
    }

    public setTrajectory(id: string, url: string) {
        this.api.getDataset(id, url).subscribe((res) => {
            this.model.trajectory = res;
            this.saveTrajectory();
            const timespan = new Timespan(
                new Date(this.model.trajectory.firstValue.timestamp),
                new Date(this.model.trajectory.lastValue.timestamp)
            );
            this.api.getData<LocatedTimeValueEntry>(this.model.trajectory.id, this.model.trajectory.url, timespan).subscribe((data) => {
                this.model.data = data.values;
                this.model.geometry = {
                    type: 'LineString',
                    coordinates: []
                };
                this.model.data.forEach((entry) => {
                    this.model.geometry.coordinates.push(entry.geometry.coordinates);
                });
            });
        });
    }

    public getPointForIdx(idx: number): GeoJSON.Point {
        return this.model.data[idx].geometry;
    }

    private saveTrajectory() {
        this.localStorage.save(TRAJECTORY_CACHE_PARAM, this.model.trajectory);
    }

    private loadTrajectory() {
        const json = this.localStorage.loadTextual(TRAJECTORY_CACHE_PARAM);
        if (json) {
            const result = deserialize<Dataset>(Dataset, json);
            this.setTrajectory(result.id, result.url);
        }
    }
}
