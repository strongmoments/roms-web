import { Component } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { AlertService, NotificationService, SseService } from 'src/app/core/services';
import { Base64ImagePipe } from 'src/app/core/_helpers';
// import { Base64ImagePipe } from 'src/app/core/_helpers/base64-image-pipe';

@Component({
  selector: 'app-vertical-header',
  templateUrl: './vertical-header.component.html',
  styleUrls: [],
})
export class VerticalAppHeaderComponent {
  public config: PerfectScrollbarConfigInterface = {};

  // This is for Notifications
  // tslint:disable-next-line - Disables all
  notifications: Object[] = [
    // {
    //   round: 'round-danger',
    //   icon: 'ti-link',
    //   title: 'Launch Admin',
    //   subject: 'Just see the my new admin!',
    //   time: '9:30 AM',
    // },
    // {
    //   round: 'round-success',
    //   icon: 'ti-calendar',
    //   title: 'Event today',
    //   subject: 'Just a reminder that you have event',
    //   time: '9:10 AM',
    // },
    // {
    //   round: 'round-info',
    //   icon: 'ti-settings',
    //   title: 'Settings',
    //   subject: 'You can customize this template as you want',
    //   time: '9:08 AM',
    // },
    // {
    //   round: 'round-primary',
    //   icon: 'ti-user',
    //   title: 'Pavan kumar',
    //   subject: 'Just see the my admin!',
    //   time: '9:00 AM',
    // },
  ];

  // This is for Mymessages
  // tslint:disable-next-line - Disables all
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM',
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM',
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM',
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM',
    },
  ];

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us',
  };

  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: 'us',
    },
    {
      language: 'Español',
      code: 'es',
      icon: 'es',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: 'fr',
    },
    {
      language: 'German',
      code: 'de',
      icon: 'de',
    },
  ];
  user: any = {};
  eve: any;
  constructor(
    private translate: TranslateService,
    private authService: AuthenticationService,
    private router: Router,
    private sseService: SseService,
    private notificationService: NotificationService,
    private alertService: AlertService,
    private base64ImagePipe: Base64ImagePipe,
  ) {
    translate.setDefaultLang('en');
    this.user = this.authService.getCurrentUser();
    this.getAllNotification();
    this.sseService
      .getServerSentEvent(`http://13.234.56.70:8081/subscription/${this.user.id}`)
      .subscribe(
        (data: any) => {
          //  data;
          if (data) {
            // console.log(data);
            data = JSON.parse(data);
            console.log(data, 'askdsalkd');
            if (data.profileImage) {
              let img: any = this.base64ImagePipe.transform(data.profileImage);
              console.log(img.changingThisBreaksApplicationSecurity);
              data.profileImage = img.changingThisBreaksApplicationSecurity;
            }
            // console.log(data, 'askdsalkd')
            let url = '';
            if (data.type == 'leave_request') {
              url = '/leave/leave-request';
            } else if (data.type == 'leave_approve' || data.type == 'leave_reject') {
              url = '/leave/apply-leave';
              // this.router.navigate(['/leave/apply-leave'], { queryParams: { id: item.eventId } });
            } else if (data.type == "resigne_request") {
              url = '/employee/resignation-list';
            } else if (data.type == "adduser_request") {
              url = '/registration/list';
            }
            this.alertService.openSnackBar(data.message, false, 0, '', true, {
              profileImage: data.profileImage,
              url: url,
              eventId: data.eventId,
            });
            this.notifications.push({});
            // this.getAllNotification();
          }
        },
        (error) => console.log(error, 'ererer'),
      );

    // let eventSource = new EventSource(`http://13.234.56.70:8081/subscription/${this.user.id}`);
    // eventSource.addEventListener('join', event => {
    //   alert(`Joined ${event.data}`);
    // });

    // eventSource.onopen = (ev: any) => {
    //   console.log('Connection to server opened.', ev);
    // };
    // eventSource.onerror = (ev: any) => {
    //   console.log('EventSource failed.', ev);
    // };

    // eventSource.onmessage = (ev: any) => {
    //   console.log('message.', ev.data);
    // };

    // eventSource.addEventListener('message', event => {
    //   alert(`Said: ${event.data}`);
    // });

    // eventSource.addEventListener('leave', event => {
    //   alert(`Left ${event.data}`);
    // });

    // eventSource.onmessage = function (event) {
    //   console.log("New message", event.data);
    //   // will log 3 times for the data stream above
    // };
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }

  getAllNotification() {
    this.notificationService.getAll().subscribe((result: any) => {
      this.notifications = result.data;
      this.notifications.map((elem: any) => {
        return (elem.body.time = new Date(parseInt(elem.body.time)));
      });
      this.notifications.sort((x: any, y: any) => y.body.time - x.body.time);

      console.log(this.notifications, 'this.notifications');
    });
  }

  markRead(id: string) {
    this.notificationService.markAsRead(id).subscribe();
    this.notifications = this.notifications.filter((elem: any) => elem.eventId != id);
    return;
  }
  redirectNotification(item: any) {
    console.log(item, 'item');
    // return
    // this.markRead(item.eventId);
    if (item.type == 'leave_request') {
      this.router.navigate(['/leave/leave-request'], { queryParams: { id: item.eventId } });
    } else if (item.type == 'leave_approve' || item.type == 'leave_reject') {
      this.router.navigate(['/leave/apply-leave'], { queryParams: { id: item.eventId } });
    } else if (item.type == "resigne_request") {
      this.router.navigate(['/employee/resignation-list'], { queryParams: { id: item.eventId } });
    } else if (item.type == "adduser_request") {
      this.router.navigate(['/registration/list'], { queryParams: { id: item.eventId } });
    }

  }
  redirect(type: string) {
    if (type == 'release') {
      this.router.navigate(['release-note']);
    } else if (type == 'change-password') {
      this.router.navigate(['change-password']);
    }
  }
  logOut() {
    this.authService.logout();
  }
}
