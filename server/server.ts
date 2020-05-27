import * as express from 'express';
import {Application} from 'express';
import {readAllLessons} from './read-all-lessons.route';
import {addPushSubscriber} from './add-push-subscriber.route';
import {sendNewsletter} from './send-newsletter.route';

const bodyParser = require('body-parser');
const webpush = require('web-push');

const app: Application = express();

const vapidKeys = {
  publicKey: 'BF9TtURzl3jgXA4TxVPLNl0BVV7j9HC5coNfbgDcsGjNY_xY2BYMcG0qLhAjCKSCn5YLmbdid20py7k_Im6U2qA',
  privateKey: 'u56Y1cFUJ8RtouNIlNfe9fiBBLMZlIfsKxq4WCDFVQY'
};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.use(bodyParser.json());

// REST API
app.route('/api/lessons')
    .get(readAllLessons);

app.route('/api/notifications')
    .post(addPushSubscriber);

app.route('/api/newsletter')
    .post(sendNewsletter);

// launch an HTTP Server
const httpServer: any = app.listen(9000, () => {
  console.log('HTTP Server running at http://localhost:' + httpServer.address().port);
});
