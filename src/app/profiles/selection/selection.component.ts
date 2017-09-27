import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset.module';

import { PlatformTypes } from '../../toolbox/model/api/dataset/platformTypes';
import { ValueTypes } from '../../toolbox/model/api/dataset/valueTypes';
import { Feature } from './../../toolbox/model/api/feature';
import { Offering } from './../../toolbox/model/api/offering';
import { ParameterFilter } from './../../toolbox/model/api/parameterFilter';
import { Phenomenon } from './../../toolbox/model/api/phenomenon';
import { Procedure } from './../../toolbox/model/api/procedure';
import { Service } from './../../toolbox/model/api/service';
import { BlacklistedService } from './../../toolbox/model/config/config';
import { Settings } from './../../toolbox/services/settings/settings.service';
import { ProfilesSelectionPermalink } from './selection-permalink.service';
import { ProfilesSelectionCache } from './selection.service';

@Component({
  selector: 'n52-profiles-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfilesSelectionComponent implements OnInit {

  public providerList: Array<string>;
  public providerBlacklist: Array<BlacklistedService>;

  public providerFilter: ParameterFilter;
  public offeringFilter: ParameterFilter;
  public phenomenonFilter: ParameterFilter;
  public procedureFilter: ParameterFilter;
  public stationaryPlatformFilter: ParameterFilter;
  public mobilePlatformFilter: ParameterFilter;
  public trajectoryFilter: ParameterFilter;

  public selectedProvider: Service;
  public selectedOffering: Offering;
  public selectedPhenomenon: Phenomenon;
  public selectedProcedure: Procedure;
  public selectedFeature: Feature;

  @ViewChild('profileSelection')
  public tabset: NgbTabset;

  constructor(
    private settings: Settings,
    private cache: ProfilesSelectionCache,
    private selectionPermalink: ProfilesSelectionPermalink
  ) { }

  ngOnInit() {
    this.selectionPermalink.validatePeramlink().subscribe((selection) => {
      if (selection.selectedProvider) { this.providerSelected(selection.selectedProvider, false); }
      if (selection.selectedOffering) { this.offeringSelected(selection.selectedOffering, false); }
      if (selection.selectedPhenomenon) { this.phenomenonSelected(selection.selectedPhenomenon, false); }
      if (selection.selectedProcedure) { this.procedureSelected(selection.selectedProcedure, false); }
      if (selection.selectedFeature) { this.featureSelected(selection.selectedFeature); }
    });
    this.providerList = this.settings.config.restApiUrls;
    this.providerBlacklist = this.settings.config.providerBlackList;
    this.providerFilter = this.createFilter();
  }

  private createFilter(): ParameterFilter {
    const filter: ParameterFilter = {
      valueTypes: ValueTypes.quantity
    };
    if (this.selectedProvider) { filter.service = this.selectedProvider.id; }
    if (this.selectedOffering) { filter.offering = this.selectedOffering.id; }
    if (this.selectedPhenomenon) { filter.phenomenon = this.selectedPhenomenon.id; }
    if (this.selectedProcedure) {
      filter.procedure = this.selectedProcedure.id;
      filter.expanded = true;
    }
    if (this.selectedFeature) { filter.feature = this.selectedFeature.id; }
    return filter;
  }

  private setSelectedProvider(provider: Service) {
    this.selectedProvider = this.cache.selectedProvider = provider;
  }

  private setSelectedOffering(offering: Offering) {
    this.selectedOffering = this.cache.selectedOffering = offering;
  }

  private setSelectedPhenomenon(phenomenon: Phenomenon) {
    this.selectedPhenomenon = this.cache.selectedPhenomenon = phenomenon;
  }

  private setSelectedProcedure(procedure: Procedure) {
    this.selectedProcedure = this.cache.selectedProcedure = procedure;
  }

  private setSelectedFeature(feature: Feature) {
    this.selectedFeature = this.cache.selectedFeature = feature;
  }

  private providerSelected(provider: Service, clearPrevious: boolean) {
    this.openTabById('selectOffering');
    if (clearPrevious) {
      this.setSelectedOffering(null);
      this.setSelectedPhenomenon(null);
      this.setSelectedProcedure(null);
      this.setSelectedFeature(null);
    }
    this.setSelectedProvider(provider);
    this.offeringFilter = this.createFilter();
  }

  private offeringSelected(offering: Offering, clearPrevious: boolean) {
    this.openTabById('selectPhenomenon');
    if (clearPrevious) {
      this.setSelectedPhenomenon(null);
      this.setSelectedProcedure(null);
      this.setSelectedFeature(null);
    }
    this.setSelectedOffering(offering);
    this.phenomenonFilter = this.createFilter();
  }

  private phenomenonSelected(phenomenon: Phenomenon, clearPrevious: boolean) {
    this.openTabById('selectProcedure');
    if (clearPrevious) {
      this.setSelectedProcedure(null);
      this.setSelectedFeature(null);
    }
    this.setSelectedPhenomenon(phenomenon);
    this.procedureFilter = this.createFilter();
  }

  private procedureSelected(procedure: Procedure, clearPrevious: boolean) {
    this.openTabById('selectPlatform');
    if (clearPrevious) {
      this.setSelectedFeature(null);
    }
    this.setSelectedProcedure(procedure);
    this.stationaryPlatformFilter = this.createFilter();
    this.mobilePlatformFilter = this.createFilter();
    this.stationaryPlatformFilter.platformTypes = PlatformTypes.stationary;
    this.mobilePlatformFilter.platformTypes = PlatformTypes.mobile;
  }

  private featureSelected(feature: Feature) {
    this.openTabById('selectProfile');
    this.setSelectedFeature(feature);
    this.trajectoryFilter = this.createFilter();
  }

  private openTabById(id: string) {
    this.tabset.tabs.find(entry => entry.id === id).disabled = false;
    this.tabset.select(id);
  }
  // private platformSelected(platform: Platform) {
  //   this.selectedPlatform = platform;
  //   $uibModal.open({
  //     animation: true,
  //     template: require('./stationary-selection.modal.html'),
  //     resolve: {
  //       selection: () => {
  //         return {
  //           platform: platform,
  //           url: this.selectedProvider.providerUrl
  //         };
  //       }
  //     },
  //     controller: ['$scope', 'selection', '$uibModalInstance', 'seriesApiInterface', 'profilesService',
  //       function ($scope, selection, $uibModalInstance, seriesApiInterface, profilesService) {
  //         $scope.platform = selection.platform;

  //         $scope.platform.datasets.forEach(dataset => {
  //           dataset.loading = true;
  //           seriesApiInterface.getDatasets(dataset.id, selection.url)
  //             .then(res => {
  //               dataset.url = selection.url;
  //               var timespan = {
  //                 start: res.firstValue.timestamp,
  //                 end: res.lastValue.timestamp
  //               };
  //               seriesApiInterface.getDatasetData(dataset.id, selection.url, timespan)
  //                 .then(data => {
  //                   dataset.dataTimestamps = [];
  //                   data.values.forEach(entry => {
  //                     dataset.dataTimestamps.push(entry.timestamp);
  //                   });
  //                   dataset.loading = false;
  //                 });
  //             });
  //         });

  //         $scope.onTimeselected = (dataset, time) => {
  //           profilesService.addProfile(dataset.id, selection.url, time);
  //           $state.go('profiles.diagram');
  //         };

  //         $scope.close = () => {
  //           $uibModalInstance.close();
  //         };
  //       }
  //     ]
  //   });
  // }

  // private mobileGeometrySelected(dataset: Dataset, selectedData) {
  //   $uibModal.open({
  //     animation: true,
  //     template: require('./trajectory-preview.modal.html'),
  //     resolve: {
  //       selection: () => {
  //         return {
  //           dataset: dataset,
  //           url: this.selectedProvider.providerUrl,
  //           data: selectedData
  //         };
  //       }
  //     },
  //     size: 'lg',
  //     controller: ['$scope', 'selection', '$uibModalInstance', 'profilesService', '$state',
  //       function ($scope, selection, $uibModalInstance, profilesService, $state) {
  //         $scope.header = selection.dataset.label;
  //         $scope.timestamp = selection.data.timestamp;

  //         selection.dataset.style = {
  //           color: 'red'
  //         };

  //         $scope.datasets = {
  //           'preview': selection.dataset
  //         };

  //         $scope.profileData = {
  //           'preview': [{
  //             value: selection.data.value,
  //             verticalUnit: selection.data.verticalUnit
  //           }]
  //         };

  //         $scope.addToChart = () => {
  //           profilesService.addProfile(dataset.id, selection.url, selection.data.timestamp);
  //           $state.go('profiles.diagram');
  //           $scope.close();
  //         };

  //         $scope.goToCombiView = () => {
  //           $state.go('profiles.combi', {
  //             url: selection.url,
  //             id: selection.dataset.id,
  //             time: selection.data.timestamp
  //           });
  //           $scope.close();
  //         };

  //         $scope.close = () => {
  //           $uibModalInstance.close();
  //         };
  //       }
  //     ]
  //   });
  // }

  // private mobileTimeList(timelist) {
  //   this.timestamps = timelist;
  // }

  // private onMobileTimespanSelected(timespan) {
  //   this.selectedTimespan = timespan;
  // }

  createPermalink = () => {
    return this.selectionPermalink.createPermalink();
  }

}
