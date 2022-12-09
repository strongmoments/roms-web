import { Component, OnInit,TemplateRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JobService } from 'src/app/core/services';
import { first } from 'rxjs';

@Component({
  selector: 'app-recruitment-details',
  templateUrl: './recruitment-details.component.html',
  styleUrls: ['./recruitment-details.component.scss']
})
export class RecruitmentDetailsComponent implements OnInit {
  submitted: boolean = false;
  selectedRecord: any = {};
  id : string = ''; 
  demandDetails : any = {};
  @ViewChild('employeeDetailDialog') employeeDetailDialog!: TemplateRef<any>;

  constructor(
    private dialog: MatDialog,
    private router: Router, private activatedRoute: ActivatedRoute, private jobService: JobService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    this.getDemandDetails();
  }

  recomendEmployee() {
    let dId = this.id;
    this.router.navigate(['/registration/recommend'], { queryParams: { dId } });
  }

  onClick() {
    this.submitted = true;
    this.openDialog({});
    // if (this.form.invalid) {
    //   this.alertService.openSnackBar(CustomMessage.invalidForm);
    //   return;
    // }
  }

  getDemandDetails(){
    this.jobService.getDemandDetails(this.id).pipe(first())
        .subscribe((result: any) => {
          this.demandDetails = result.data;
          console.log('Demand Details:',this.demandDetails);
        });
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
