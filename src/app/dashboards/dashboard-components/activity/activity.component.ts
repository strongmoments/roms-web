import { Component } from '@angular/core';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent {
  // Timeline
  mytimelines = [
    {
      from: 'Owen Cavanough',
      time: '(August 29, 2022)',
      image: '../../../../assets/img/rtl-logo-new-icon.jpg',
     // attachment: 'assets/images/big/img2.jpg',
      content:
        'Welcome to RTL Digital Transformation. We are committed to provide better work environment for all our staff.....',
    },
    {
      from: 'Mick Moroney',
      time: '(August 29, 2022)',
      image: '../../../../assets/img/rtl-logo-new-icon.jpg',
      content:
        'Our first release is Employee Leave applications. This will reduce paper across the organisation as well as improve efficiency ......',
      // buttons: 'primary',
    },
    {
      from: 'Dhram Yadav',
      time: '(August 30, 2022)',
      image: '../../../../assets/img/rtl-logo-new-icon.jpg',
      // attachment: 'assets/images/big/img1.jpg',
      content:
        'In coming coming weeks and months, we will add many features in Operations management to support all staff across the board ....',
    },
    // {
    //   from: 'Dhiren Adesara',
    //   time: '(1 minute ago)',
    //   image: 'assets/images/users/4.jpg',
    //   content:
    //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.',
    //   buttons: 'warn',
    // },
  ];

  constructor() {}
}
