import { Component, OnInit } from '@angular/core';
import { LessonsService } from '../services/lessons.service';
import { Observable, of } from 'rxjs';
import { Lesson } from '../model/lesson';
import { SwPush } from '@angular/service-worker';
import { catchError } from 'rxjs/operators';
import { NewsletterService } from '../services/newsletter.service';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {

  lessons$: Observable<Lesson[]>;
  isLoggedIn$: Observable<boolean>;

  sub: PushSubscription;

  readonly VAPID_PUBLIC_KEY = 'BF9TtURzl3jgXA4TxVPLNl0BVV7j9HC5coNfbgDcsGjNY_xY2BYMcG0qLhAjCKSCn5YLmbdid20py7k_Im6U2qA';

  constructor(
    private lessonsService: LessonsService,
    private swPush: SwPush,
    private newsletterService: NewsletterService
  ) { }

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons() {
    this.lessons$ = this.lessonsService.loadAllLessons().pipe(catchError(err => of([])));
  }

  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(sub => {
      this.sub = sub;

      console.log('Notification Subscription: ', sub);
      this.newsletterService.addPushSubscriber(sub).subscribe(
        () => console.log('Sent push subscription object to server'),
        err => console.log('Could not send subscription object to server, reason: ', err)
      );
    }).catch(err => {
      console.error('Could not subscribe to notification', err);
    });
  }


  sendNewsletter() {
    console.log('Sending Newsletter to all Subscribers ...');
    this.newsletterService.send().subscribe();
  }

}
