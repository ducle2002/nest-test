import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin, {
  app,
  database,
  messaging,
  ServiceAccount,
} from 'firebase-admin';
import { Messaging, MessagingOptions } from 'firebase-admin/lib/messaging';
import { getDatabase, ref, child, get } from 'firebase/database';
import MulticastMessage = messaging.MulticastMessage;
import firebase from 'firebase/compat/app';
import { queryNotiTokenDto } from './dtos/queryNotiTokenDto.dto';
import { filter } from 'rxjs';
// import 'firebase/compat/database';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
// const serviceAccount = require('./serviceAccount.json');

@Injectable()
export class FirebaseService {
  private readonly app: app.App;
  private readonly messaging: Messaging;

  // private readonly logger = new LoggerService(FirebaseService.name);

  constructor(private readonly configService: ConfigService) {
    this.app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: 'villa-ddd53',
        clientEmail: 'firebase-test-1@villa-ddd53.iam.gserviceaccount.com',
        privateKey:
          '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCg/IBOFepBIFEM\nC6p5PTKz/r0eGgLoMsz/jo3UQAOuKbBfvOJPj/q2xEEyPNi0cpzenWQCZF6KvCRp\n+1hnIYySl2g37bBlPTZC6515MCEtNnn3g9LU5nJLy3+P5YWIocGr+NMHY4IROG5N\nvOirnnkWcYM87GaFAVgiVwpKcDlLiEuKaMVaWY4IssC1HfKEM/b7u7Aw5uiX3FeE\nc5d8dMxeJ3NtVvFL5wR9MwYWsBh/XLLvOc0eyGHsU4uedDnkjeUJpGI1Gp6PUqnP\new6pekrscsawYsvr24n/Slvva36lPfEVMU9hYpE8o7SeH6M6VRUGyRb+Hj7yl+3x\nW3olhcgjAgMBAAECggEAKrpqCY+qgceki0hrYkt6cii6JEuuGtgk7e11unCVKXw6\nKmb1QD3MQwc68K0SrW5AMZvfp/zg1PzTw2dpUtImP+A80p9dMrm49bEYtkoufBQZ\n8jaEVmqlynVEMbqvIxEf2NetlyfzpUNvj2WE8cwZgnn1Zc2u9j1hmZe1jQVVR7UE\nOWU0OkF0/fq9eWiMvT2YQD7+To0HxyQka7NFF3FZlqIjsxSWXgyLMiE21h7Y4Pi8\nahIQtPHZWMJpuM9AEihsmMawrM47E18K6BQI56nb0nT4OFFAvx5AL8KObnSxMwW+\nSMk4T1t2gSotmIriF0HS2FZ10M28txG8uuRTCI44NQKBgQDjK4PWkRW28SFuWN2M\nM0xDh1CX7PdhWR3iqEbqpjThp7X4f1NOt/egb0ejucsi6agPVCxk73akVBNME/Td\nSPAsXoVZ0Gh4mMKB/C9I9hceAnfy/L8ZGxR1yG9mRwbB+1hbmOe7+Tr32ZZi+V37\nFhLEke8FuiA751yCFCBlDrAL3QKBgQC1asHpQMnu5fHj0uyTPH6ggjKOuWd2Scpc\no0CoLP6I6Lx9Rh9XVWy6Ih7K0F71VlavgAY8ThmGCu6CNQMzd48NRJMBe8+QA7Qz\nlSzWNesn9t4rds5PvZf8ipX2TD1FL3yOidtP+no1mg4jpha0wniiYqCYGgDFZ0Cx\nblII/Gnj/wKBgGKXcSl/YDg8oLC+erCtVsz7/jthid/DCJhlRhnytoK1AeHuiJ5i\nc2M6yJHDQelOFTVJ59aKoyggoRtkkeI0FKB9CUz4iU7Fpa06YN8+hrvsgFiB3wIr\nYY7YxZhS/RjVV/yw+On4+eG1mnIsHeCqLM0JNP58UB8Pg3Ok/oY9gKQ1AoGANnjN\nrJnViDPnA38rpbH+W3d8crpcxHm3l0U1fsmzy6wGHJ9XfcOal/Dyyfby7Dt2X8/T\nD3xr0YGqx9HfGi8F9vfmJAXm9tkF3I8oHVGnQCKx5t8PZ4YIAr4h9QhDRWjSv4HJ\nJiSRWVLed/nAy5mw2yE+Ey2Lmbo9BImZfDU+HkUCgYApAbLw0Qf6IhL6NAI1EGFa\nwOnHoQKWUvmTIKxSRvTQSLk4BQpoXmYkOnXr8T87uxnwY1+JOFfuDkNZVnEXUgWs\nf0uiRuOl5Y6cCP/RPiskcrlP7p2Mg+YBYJzrNd2e4bs6v/tRDoGs+LCCalXgGcgu\nDvse777Sbc7IJva68u4luw==\n-----END PRIVATE KEY-----\n',
      }),
      databaseURL: `https://${String(
        this.configService.get('FIREBASE_PROJECT_ID'),
      )}.firebaseio.com`,
    });

    this.messaging = this.app.messaging();
  }

  convertToMulticastMessage(
    tokens: string[],
    title: string,
    body: string,
    action = 'default',
    data: {
      [key: string]: string;
    } = {},
  ): MulticastMessage {
    const messageMulticast: MulticastMessage = {
      tokens: tokens,
      notification: {},
      data: { ...data, action: action },
      android: {
        priority: 'high',
        notification: {
          title: title,
          body: body,
          // sound: 'default',
          // channelId: 'default',
          // clickAction: action,
          // icon: null,
          // // imageUrl: null,
          // eventTimestamp: new Date(),
        },
      },
      apns: {
        headers: {
          apnsPriority: '5',
        },
        payload: {
          aps: {
            alert: {
              title: title,
              body: body,
            },
            badge: 0,
            sound: 'default',
            category: action,
          },
        },
        fcmOptions: {
          // imageUrl: null,
        },
      },
      webpush: {
        headers: {
          Urgency: 'high',
        },
        notification: {
          title: title,
          body: body,
          //   dir: 'auto',
          //   actions: [
          //     {
          //       action: action,
          //       icon: null,
          //       title: action,
          //     },
          //   ],
          //   icon: null,
          //   // image: null,
          //   data: data,
          //   timestamp: new Date().getTime(),
        },
        fcmOptions: {
          link: null,
        },
      },
    };

    return messageMulticast;
  }

  async sendMulticastMessage(
    deviceTokens: string[],
    title: string,
    content: string,
    action?: string,
    data?: {
      [key: string]: string;
    },
  ) {
    await this.app
      .messaging()
      .sendEachForMulticast(
        this.convertToMulticastMessage(
          deviceTokens,
          title,
          content,
          action || 'default',
          data || {},
        ),
      )
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
    return this.convertToMulticastMessage(
      deviceTokens,
      title,
      content,
      action || 'default',
      data || {},
    );
  }

  async sendMessage(
    deviceTokens: string[],
    payload,
    options?: MessagingOptions,
  ) {
    await this.app
      .messaging()
      .sendEachForMulticast(
        this.convertToMulticastMessage(
          deviceTokens,
          payload.title,
          payload.content,
        ),
      )
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }

  async queryBase(
    query: queryNotiTokenDto,
    title: string,
    content: string,
    action?: string,
    data?: {
      [key: string]: string;
    },
  ) {
    const myTokens: string[] = [];
    await this.app
      .database('https://villa-ddd53-default-rtdb.firebaseio.com')
      .ref('tokens')
      .once('value')
      .then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          let check = 0;
          if (query.device) {
            if (!query.device.includes(childSnapshot.val().device)) {
              check++;
            }
          }
          if (query.userIds) {
            if (childSnapshot.val().user == query.userIds) {
              check++;
            }
          }

          if (check == 0) {
            myTokens.push(childSnapshot.val().token);
          }
        });
      });
    if (myTokens.length > 0) {
      await this.sendMulticastMessage(myTokens, title, content, action, data);
    }
  }

  async queryBase2() {
    // const dbRef = ref(getDatabase());

    await this.app
      .database('https://villa-ddd53-default-rtdb.firebaseio.com')
      .ref('tokens')
      // .child('1')
      .once('value')
      .then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          const id = childSnapshot.key;
          if (childSnapshot.val().device == 'android') {
            console.log(
              'log ' +
                id +
                ': ' +
                childSnapshot.val().token +
                ' + ' +
                Object.values(childSnapshot.val())[0] +
                '\n ',
            );
          }
          const user =
            (childSnapshot.val() && childSnapshot.val().device) || 'Anonymous';
          console.log(user + '\n');
        });
        const username =
          (snapshot.val() && snapshot.val().username) || 'Anonymous';
        console.log(username);
      });
  }
}
