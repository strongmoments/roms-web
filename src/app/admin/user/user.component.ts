import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { AdminService, AlertService } from 'src/app/core/services';
import { Globals } from 'src/app/globals';
import { ConfirmationDialog } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Company, User, ViewOptions } from 'src/app/_models';
import { UserDetailComponent } from '../user-detail/user-detail.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  resultsLength = 0;
  pagesize = 10;
  globals!: Globals;
  companyId = '';
  searchMe = '';
  totalRecords: number = 0;
  companyList: Company[] = [];
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  displayedColumns: string[] = ['fullName', 'email', 'role', 'companyName', 'action'];

  constructor(public dialog: MatDialog, globals: Globals, public adminService: AdminService,
    private alertService: AlertService) {
    this.globals = globals;
  }

  ngOnInit() {
    this.adminService.companyGetAll().pipe(first()).subscribe((result: any) => {
      this.companyList = result.data;
      // this.companyList.push(new Company({ id: this.globals.defaultId, parentCompany: 'N/A' }))
    });
    this.refresh(this.getDefaultOptions());
  }


  onSearch() {
    this.paginator.pageIndex = 0;
    this.refresh(this.getDefaultOptions());
  }
  onOptionsSelected(value: string) {
    this.companyId = value;
    this.refresh(this.getDefaultOptions());
  }

  refresh(options: ViewOptions) {
    this.adminService.userSearch(options).pipe(first()).subscribe((result: any) => {
      this.totalRecords = result.totalCount;
      this.dataSource.data = result.data;
    });

  }
  ngAfterViewInit(): void {
    this.paginator.page.subscribe((page: PageEvent) => {
      this.refresh(this.getDefaultOptions());
    });
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe((sort) => {
      this.refresh(this.getDefaultOptions());
    });

  }
  getRole(value: String) {
    return this.globals.role.find(c => c.value.toString() == value)?.name ?? '';
  }


  getDefaultOptions() {
    let obj = this.paginator;
    let sort = this.sort;
    const options: ViewOptions = {
      sortField: (sort !== undefined ? sort.active : 'fullName'),
      sortDirection: (sort !== undefined ? sort.direction : 'asc'),
      page: (obj != undefined ? (obj.pageIndex == null ? 1 : obj.pageIndex + 1) : 1),
      search: this.searchMe + `&companyid=${this.companyId}`,
      query: '',
      pageSize: (obj != undefined ? (obj.pageSize == null ? this.pagesize : obj.pageSize) : this.pagesize)
    };
    return options;
  }

  openDialog(data?: any): void {
    let dialogRef = this.dialog.open(UserDetailComponent, {
      position: {
        top: '10px',
        right: '10px'
      },
      data: { userData: data, companyList: this.companyList },
      height: '98%',
      width: '35vw',
      panelClass: 'full-screen-modal',
      disableClose: true
    });
    dialogRef.componentInstance.event.subscribe((_result: any) => {
      let updateItem = this.dataSource.data.find(x => x.id === _result.data.id);
      if (updateItem === undefined) {
        this.dataSource.data.push(_result.data);
      }
      else {
        let index = this.dataSource.data.indexOf(updateItem);
        this.dataSource.data[index] = _result.data;
      }
      this.dataSource._updateChangeSubscription();
    });
  }


  onDelete(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `Are you sure want to delete <br/> ' ${data.fullName} ' ?`,
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.adminService.userRemove(data.id).pipe(first()).subscribe({
          error: error => {
            this.alertService.openSnackBar(error);
          },
          next: (res: any) => {
            this.dataSource.data = this.dataSource.data.filter(obj => obj.id !== data.id);
            this.alertService.openSnackBar(res.message, false);
          }
        });
      }
    });
  }
}