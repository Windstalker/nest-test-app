import { Model, Collection } from 'backbone';
import Mn from 'backbone.marionette';
import Firebase from 'firebase';
import Cookie from 'js-cookie';
// import constants from './constants.json';

// const { NEST_ID, NEST_SECRET } = constants;

export const Structure = Model.extend({
  idAttribute: 'structure_id',
});

export const Device = Model.extend({
  idAttribute: 'device_id',
});

export const Structures = Collection.extend({
  model: Structure,
});

export const Devices = Collection.extend({
  model: Device,
});

export const NestFB = Mn.Object.extend({
  firebaseUrl: 'wss://developer-api.nest.com',
  initialize() {
    const dataRef = new Firebase(this.firebaseUrl);
    this.dataRef = dataRef;
    this.structures = new Structures();
    this.alarms = new Devices();
    this.bindFirebaseEvents();
    return this;
  },
  bindFirebaseEvents() {
    this.dataRef.once('value', (snapshot) =>
      Mn.triggerMethodOn(this, 'nest:data:received', snapshot));
  },
  auth(token) {
    const p = new Promise((resolve, reject) => {
      this.dataRef.authWithCustomToken(token, (error, result) => {
        if (error) {
          reject('auth error');
        }
        if (result) {
          resolve('authenticated');
        }
      });
    });
    return p;
  },
  onNestDataReceived(snapshot) {
    const smokeCOAlarms = snapshot.child('devices/smoke_co_alarms');
    // const smokeCOAlarmsVal = smokeCOAlarms.val();
    const structures = snapshot.child('structures');

    structures.ref().on('value', (state) => {
      const structuresState = state.val();
      this.structures.reset(
        Object.keys(structuresState).map((id) => structuresState[id])
      );
    });

    smokeCOAlarms.ref().on('value', (state) => {
      const alarmsState = state.val();
      this.alarms.reset(
        Object.keys(alarmsState).map((id) => alarmsState[id])
      );
    });
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
  clearToken() {
    this.set('access_token', '');
    Cookie.remove('nest_token');
  },
});

export const RedirectUrl = Model.extend({
  defaults: {
    nestAuthServer: '/auth/nest/',
  },
});
