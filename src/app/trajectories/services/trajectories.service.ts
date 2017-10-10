import { Injectable } from '@angular/core';
import { deserialize } from 'class-transformer';

import { LocatedTimeValueEntry } from './../../toolbox/model/api/data';
import { Dataset } from './../../toolbox/model/api/dataset/dataset';
import { Timespan } from './../../toolbox/model/internal/time-interval';
import { ApiInterface } from './../../toolbox/services/api-interface/api-interface.service';
import { InternalIdHandler } from './../../toolbox/services/api-interface/internal-id-handler.service';
import { LocalStorage } from './../../toolbox/services/local-storage/local-storage.service';
import { TrajectoryModel } from './../model/trajectory-model';

const TRAJECTORY_CACHE_PARAM = 'trajectory';

@Injectable()
export class TrajectoriesService {

    public model: TrajectoryModel;

    constructor(
        private api: ApiInterface,
        private localStorage: LocalStorage,
        private internalIdHandler: InternalIdHandler
    ) {
        this.model = {};
        this.loadTrajectory();
    }

    public setTrajectoryByInternalId(internalId: string) {
        const idConstellation = this.internalIdHandler.resolveInternalId(internalId);
        this.setTrajectory(idConstellation.id, idConstellation.url);
    }

    public setTrajectory(id: string, url: string) {
        this.api.getDataset(id, url).subscribe((res) => {
            this.model.trajectory = res;
            this.saveTrajectory();
            const timespan = new Timespan(
                new Date(this.model.trajectory.firstValue.timestamp),
                new Date(this.model.trajectory.lastValue.timestamp)
            );
            this.api.getData<LocatedTimeValueEntry>(this.model.trajectory.id, this.model.trajectory.url, timespan)
                .subscribe((data) => {
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

    public hasTrajectory(): boolean {
        return this.model.trajectory !== null && this.model.data !== null;
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
