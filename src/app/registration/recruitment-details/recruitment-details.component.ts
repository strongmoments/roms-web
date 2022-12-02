import { Component, OnInit,TemplateRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-recruitment-details',
  templateUrl: './recruitment-details.component.html',
  styleUrls: ['./recruitment-details.component.scss']
})
export class RecruitmentDetailsComponent implements OnInit {
  submitted: boolean = false;
  selectedRecord: any = {};
  @ViewChild('employeeDetailDialog') employeeDetailDialog!: TemplateRef<any>;

  constructor(
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onClick() {
    this.submitted = true;
    this.openDialog({});
    // if (this.form.invalid) {
    //   this.alertService.openSnackBar(CustomMessage.invalidForm);
    //   return;
    // }
  }

  openDialog(data: any) {
    this.selectedRecord = data;
    const dialogRef = this.dialog.open(this.employeeDetailDialog, {
      width: '60em',
      height: '20em',
      // data: { data: data },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.router.navigate(['/registration/list']);
      // console.log('The dialog was closed');
    });
  }

}
