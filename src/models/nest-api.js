import { Model } from 'backbone';
import Mn from 'backbone.marionette';
import Firebase from 'firebase';
import Cookie from 'js-cookie';
// import constants from './constants.json';

// const { NEST_ID, NEST_SECRET } = constants;

export const NestFB = Model.extend({
  firebaseUrl: 'wss://developer-api.nest.com',
  initialize() {
    const dataRef = new Firebase(this.firebaseUrl);
    this.dataRef = dataRef;
    this.bindFirebaseEvents();
    return this;
  },
  bindFirebaseEvents() {
    this.dataRef.once('value', (snapshot) =>
      Mn.triggerMethodOn(this, 'nest:data:received', snapshot));
  },
  auth(token) {
    const pr = this.dataRef.authWithCustomToken(token, (error, result) => {
      if (error) {
        console.log('auth error');
      }
      if (result) {
        console.log('authenticated');
      }
    });
    return pr;
  },
  onNestDataReceived(snapshot) {
    const smokeCOAlarms = snapshot.child('devices/smoke_co_alarms');
    const smokeCOAlarmsVal = smokeCOAlarms.val();
    let structures = snapshot.child('structures');
    structures = Object.keys(structures.val())
      .map((id) => structures.child(id).val());

    const alarms = Object.keys(smokeCOAlarmsVal).map((id) => {
      const alarm = smokeCOAlarms.child(id);
      this.listenForSmokeAlarms(alarm);
      this.listenForCOAlarms(alarm);
      this.listenForBatteryAlarms(alarm);
      return alarm.val();
    });

    this.set('structures', structures);
    this.set('alarms', alarms);

    console.log(this.toJSON());
  },
  listenForSmokeAlarms(alarm) {
    alarm.child('smoke_alarm_state').ref().on('value', () => {
      this.triggerAlarmEvent('smoke:alarm', alarm);
    });
  },
  listenForCOAlarms(alarm) {
    alarm.child('co_alarm_state').ref().on('value', () => {
      this.triggerAlarmEvent('co:alarm', alarm);
    });
  },
  listenForBatteryAlarms(alarm) {
    alarm.child('battery_health').ref().on('value', () => {
      this.triggerAlarmEvent('battery:alarm', alarm);
    });
  },
  triggerAlarmEvent(eventName, alarm) {
    const payload = alarm.val();
    Mn.triggerMethodOn(this, eventName, payload);
  },
  onDestroy() {
    this.dataRef.off('value');
    this.dataRef = undefined;
  },
});

export const NestAuthModel = Model.extend({
  // url: 'https://api.home.nest.com/oauth2/access_token',
  defaults: {
    access_token: '',
  },
  checkAccessToken() {
    const token = Cookie.get('nest_token');
    if (typeof token === 'string') {
      this.set('access_token', token);
      return token;
    }
    return false;
  },
  // authorize(code) {
  //   return this.sync('create', this, {
  //     data: {
  //       code,
  //       client_id: NEST_ID,
  //       client_secret: NEST_SECRET,
  //       grant_type: 'authorization_code',
  //     },
  //   });
  // },
});

export const RedirectUrl = Model.extend({
  defaults: {
    nestAuthServer: '/auth/nest/',
  },
});
