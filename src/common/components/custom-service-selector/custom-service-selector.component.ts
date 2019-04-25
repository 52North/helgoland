import { Component, Input, SimpleChanges, OnChanges} from '@angular/core';
import { ServiceSelectorComponent } from '@helgoland/selector';
import { Service } from '@helgoland/core';

@Component({
  selector: 'n52-custom-service-selector',
  templateUrl: './custom-service-selector.component.html',
  styleUrls: ['./custom-service-selector.component.scss']
})
export class CustomServiceSelectorComponent extends ServiceSelectorComponent implements OnChanges{ 

  @Input() 
  public addedService: Service;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.addedService) {
      if(this.services && this.addedService){
        this.services.push(this.addedService);
      }
    }
  }

}
