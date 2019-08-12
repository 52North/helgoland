import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAsCsvComponent } from './download-as-csv.component';

describe('DownloadAsCsvComponent', () => {
  let component: DownloadAsCsvComponent;
  let fixture: ComponentFixture<DownloadAsCsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadAsCsvComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAsCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
