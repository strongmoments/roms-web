import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-job-recommend',
  templateUrl: './job-recommend.component.html',
  styleUrls: ['./job-recommend.component.scss']
})
export class JobRecommendComponent implements OnInit {
  @ViewChild('resourceDemandDialog') resourceDemandDialog!: TemplateRef<any>;
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(data: any) {
    const dialogRef = this.dialog.open(this.resourceDemandDialog, {
      width: '35em',
      height: '30em',
      data: { data: data }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.router.navigate(['/registration/list']);
      console.log('The dialog was closed');
    });
  }


}
