import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'n52-basic-auth',
  templateUrl: './basic-auth.component.html',
  styleUrls: ['./basic-auth.component.scss']
})
export class BasicAuthComponent implements OnInit {

  @Input() public serviceUrl: string;

  public username: string;
  public password: string;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  public confirm() {
    this.activeModal.close({
      username: this.username,
      password: this.password
    });
  }

  public cancel() {
    this.activeModal.close();
  }

}
