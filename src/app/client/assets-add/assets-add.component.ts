import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services';
import { Utils } from 'src/app/core/_helpers/util';
import { CustomMessage } from 'src/app/custom-message';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-assets-add',
  templateUrl: './assets-add.component.html',
  styleUrls: ['./assets-add.component.scss']
})
export class AssetsAddComponent implements OnInit {
  globals: Globals;
  form: FormGroup;
  submitted: boolean = false;
  currentDate: Date = new Date();
  constructor(globals: Globals, private fb: FormBuilder, private alertService: AlertService, public util: Utils) {
    this.globals = globals;
    this.form = this.fb.group({
      assetNo: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      assetClass: new FormControl('', [Validators.required]),
      assetType: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      make: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
      yearOfMake: new FormControl('', [Validators.required]),
      contryOfOrigin: new FormControl('', [Validators.required]),
      currentRate: new FormControl('', [Validators.required]),
      currentRateRider: new FormControl('', [Validators.required]),
      allowWO: new FormControl(false, [Validators.required]),
      status: new FormControl('', [Validators.required]),
      retireAsset: new FormControl(false, [Validators.required]),
      ownership: new FormControl(false, [Validators.required]),
      retirementDate: new FormControl('', [Validators.required])
      // assetImageId
      // QrCodeId
    });

  }


  get f() {
    return this.form.controls;
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
  }

  onSubmit() {
    console.log('in');
    this.submitted = true;
    if (this.form.invalid) {
      this.alertService.openSnackBar(CustomMessage.invalidForm);
      return;
    }

    let formValues = this.form.value;


  }

}
