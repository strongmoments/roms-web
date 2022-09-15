import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  isLinear = false;
  firstFormGroup: UntypedFormGroup = Object.create(null);
  secondFormGroup: UntypedFormGroup = Object.create(null);
  isOptional = false;
  isEditable = false;

  // tslint:disable-next-line - Disables all
  constructor(private _formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }

}
