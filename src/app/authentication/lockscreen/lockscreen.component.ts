import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.scss'],
})
export class LockscreenComponent implements OnInit {
  public form: UntypedFormGroup = Object.create(null);
  constructor(private fb: UntypedFormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])],
    });
  }

  onSubmit(): void {
    this.router.navigate(['/']);
  }
}
