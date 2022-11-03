import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { JobService } from 'src/app/core/services';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-job-recommend',
  templateUrl: './job-recommend.component.html',
  styleUrls: ['./job-recommend.component.scss']
})
export class JobRecommendComponent implements OnInit {
  // @ViewChild('resourceDemandDialog') resourceDemandDialog!: TemplateRef<any>;
  globals: Globals;
  demandList: any = [];
  currentTab: number = 0;
  user: any;
  searchText: string = '';
  demandType: any = '';
  allDemandList: any = [];
  constructor(private authService: AuthenticationService, private dialog: MatDialog, private jobService: JobService, private router: Router, private global: Globals) {
    this.globals = global;
    this.user = this.authService.getCurrentUser();
  }

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
    if (this.currentTab == 0) {
      this.jobService.getAllResourceDemand().pipe(first())
        .subscribe((result: any) => {
          this.demandList = result.data;
          this.allDemandList = result.data;
        });
    } else if (this.currentTab == 1) {
      this.jobService.getAllMyResourceDemand(this.user.id).pipe(first())
        .subscribe((result: any) => {
          this.demandList = result.data;
          this.allDemandList = result.data;
        });
    }
  }


  getData(data: any) {
    let final: any = [];
    for (let item in data) {
      // console.log(data[item])
      final.push(data[item])
    }
    return final;
  }

  onTabChanged(index: number) {
    this.currentTab = index;
    this.searchText = '';
    this.demandList = [];
    this.allDemandList = [];
    this.getDemandData();
  }

  redirectView(id: string) {

    this.router.navigate(['/registration/recruitment-details'], { queryParams: { id: id } });
  }
  redirectAdd() {
    this.router.navigate(['/registration/recruitment']);

  }

  filter() {
    let allData = this.allDemandList;
    if (this.searchText != '') {
      allData = allData.filter((elem: any) => {
        return (elem?.clientProject?.name.toLowerCase().includes(this.searchText.toLowerCase())) || (elem?.classification?.toLowerCase().includes(this.searchText.toLowerCase()))
      });
    }

    if (this.demandType != '') {
      allData = allData.filter((elem: any) => {
        return (elem?.demandType == this.demandType)
      });
    }

    this.demandList = allData;
    // console.log(allData, 'asjaks')
    return;
  }
}
