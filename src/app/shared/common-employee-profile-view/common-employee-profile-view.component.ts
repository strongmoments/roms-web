import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, EmployeeService } from 'src/app/core/services';
import { CustomMessage } from 'src/app/custom-message';

@Component({
    selector: 'app-common-employee-profile-view',
    templateUrl: './common-employee-profile-view.component.html',
    styleUrls: ['./common-employee-profile-view.component.scss']
})
export class CommonEmployeeProfileViewComponent implements OnInit {
    @Input() record: any;
    constructor(private alertService: AlertService, private employeeService: EmployeeService, private router: Router) {
    }

    ngOnInit(): void {
    }


    onFileChange(event: any) {
        console.log(this.record, 'rwecodd');

        if (event !== null && event.target !== null && event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // console.log(file, 'file')
            let filename = file.type.toLowerCase();
            if (["image/jpeg", "image/png", "image/jpg"].includes(filename) == true) {
                if (file.size <= 2000000) {
                    var reader = new FileReader();
                    reader.onload = (e: any) => {
                        // console.log('Got here: ', e.target.result);
                        // let type = ["image/jpeg", "image/png", "image/jpg"].includes(filename) == true ? 'image' : 'pdf';
                        // this.attachments.push({ url: e.target.result, type: type });
                        // this.obj.photoUrl = e.target.result;
                    }
                    // reader.readAsDataURL(file);
                    let data = new FormData();
                    data.append('id', this.record.id);
                    // this.attachmentFiles.map((elem: any) => {
                    data.append('file', file);
                    this.employeeService.uploadPicture(data).subscribe(
                        (res) => {
                            this.alertService.openSnackBar(CustomMessage.userImageUpdateSuccess, false);
                            const currentUrl = this.router.url;
                            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                                this.router.navigate([currentUrl]);
                            });
                            //   this.router.navigate(['/dashboard']);
                        },
                        (error) => {
                            this.alertService.openSnackBar(CustomMessage.error);
                            //   this.router.navigate(['/dashboard']);

                            // this.alertService.openSnackBar(CustomMessage.error);
                        },
                    );
                    // 
                    // })
                    //   this.attachmentFiles.push(file);

                } else {
                    this.alertService.openSnackBar(CustomMessage.invalidLeaveAttachmentSize);
                }
            } else {
                this.alertService.openSnackBar(CustomMessage.invalidLeaveAttachment);
            }
            return;
            // console.log(file, 'sd');
        }


    }

}
