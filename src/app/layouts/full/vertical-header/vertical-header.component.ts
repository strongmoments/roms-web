import { Component } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { AlertService, NotificationService, SseService } from 'src/app/core/services';

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
  constructor(private translate: TranslateService, private authService: AuthenticationService, private router: Router, private sseService: SseService, private notificationService: NotificationService, private alertService: AlertService) {
    translate.setDefaultLang('en');
    this.user = this.authService.getCurrentUser();

    this.sseService.getServerSentEvent(`http://13.234.56.70:8081/subscription/${this.user.id}`)
      .subscribe((data: any) => {
        //  data;
        if (data) {
          console.log();
          data = JSON.parse(data);
          this.alertService.openSnackBar(data.message, false, 5000, 'New Leave request', true, { profileImage: data.profileImage, url: '/leave/leave-request' });

        }
        console.log(data, 'askdsalkd')
      }, error => console.log(error, 'ererer'));

    this.notificationService.getAll().subscribe((result: any) => {
      this.notifications = result.data;
      console.log(this.notifications, 'this.notifications')
    });
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

  redirectNotification(item: object) {
    this.router.navigate(['/leave/leave-request']);

  }
  redirect(type: string) {
    if (type == 'release') {
      this.router.navigate(['release-note']);
    }
  }
  logOut() {
    this.authService.logout();
  }
}
