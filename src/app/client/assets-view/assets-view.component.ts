import { Component, OnInit,Input } from '@angular/core';
import { TemplateRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JobService, AssetsService } from 'src/app/core/services';
import { first } from 'rxjs';

@Component({
  selector: 'app-assets-view',
  templateUrl: './assets-view.component.html',
  styleUrls: ['./assets-view.component.scss']
})
export class AssetsViewComponent implements OnInit {
  submitted: boolean = false;
  selectedRecord: any = {};
  id : string = ''; 
  assetDetails : any = {};
  isEditEnable: boolean = false;
  // @ViewChild('employeeDetailDialog') employeeDetailDialog!: TemplateRef<any>;

  constructor(
    private dialog: MatDialog,
    private router: Router, private activatedRoute: ActivatedRoute,private assetsService: AssetsService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    this.getAssetsDetails();
  }
  getAssetsDetails(){
    this.assetsService.getDetailsAsset(this.id).pipe(first()).subscribe((result: any) => {
          this.assetDetails = result.data;
          console.log('Assets Details:',this.assetDetails);
        });
  }
 
  

  

  

}
