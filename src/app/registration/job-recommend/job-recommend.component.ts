import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { JobService } from 'src/app/core/services';

@Component({
  selector: 'app-job-recommend',
  templateUrl: './job-recommend.component.html',
  styleUrls: ['./job-recommend.component.scss']
})
export class JobRecommendComponent implements OnInit {
  // @ViewChild('resourceDemandDialog') resourceDemandDialog!: TemplateRef<any>;
  demandList: any = [];
  constructor(private dialog: MatDialog, private jobService: JobService, private router: Router) { }

  ngOnInit(): void {
    this.getDemandData();
  }

  // openDialog(data: any) {
  //   const dialogRef = this.dialog.open(this.resourceDemandDialog, {
  //     width: '35em',
  //     height: '30em',
  //     data: { data: data }
  //   });

  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     // this.router.navigate(['/registration/list']);
  //     console.log('The dialog was closed');
  //   });
  // }
  getDemandData() {
    this.jobService.getAllResourceDemand().pipe(first())
      .subscribe((result: any) => {
        this.demandList = result.data;
        console.log(this.demandList, 'result');
        // this.totalRecords += result.totalElement;
        // this.dataSource.data = [...result.data, ...this.dataSource.data];
        // console.log(this.dataSource.data, 'result.data');
        // this.comments = [];
        // this.dataSource.data.map(() => {
        //   this.comments.push('');
        // });
      });
  }


  getData(data: any) {
    let final: any = [];
    for (let item in data) {
      console.log(data[item])
      final.push(data[item])
    }
    return final;
  }

  onTabChanged(index: number) {
    this.getDemandData();
  }

  redirectView(id: string) {

    this.router.navigate(['/registration/recruitment-details'], { queryParams: { id: id } });
  }
  redirectAdd() {
    this.router.navigate(['/registration/recruitment']);

  }
}
