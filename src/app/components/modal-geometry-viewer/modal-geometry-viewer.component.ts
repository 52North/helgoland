import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'n52-modal-geometry-viewer',
  templateUrl: './modal-geometry-viewer.component.html',
  styleUrls: ['./modal-geometry-viewer.component.scss']
})
export class ModalGeometryViewerComponent {

  @Input()
  public geometry: GeoJSON.GeoJsonObject;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

}
