import { Model } from 'backbone';
import { Object as MnObject } from 'backbone.marionette';
import Firebase from 'firebase';
import Cookie from 'js-cookie';
import constants from './constants.json';

const { NEST_ID, NEST_SECRET } = constants;

export const NestFB = MnObject.extend({
  url: 'wss://developer-api.nest.com',
  initialize() {
    const dataRef = new Firebase(this.url);
    this.dataRef = dataRef;
    this.dataRef.on('value', this.valueReceived.bind(this));
    return this;
  },
  auth(token) {
    return this.dataRef.auth(token);
  },
  valueReceived(snapshot) {
    this.triggerMethod('value', snapshot);
  },
  onDestroy() {
    this.dataRef.off('value');
    this.dataRef = undefined;
  },
});

export const NestAuthModel = Model.extend({
  url: 'https://api.home.nest.com/oauth2/access_token',
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
  authorize(code) {
    return this.sync('create', this, {
      data: {
        code,
        client_id: NEST_ID,
        client_secret: NEST_SECRET,
        grant_type: 'authorization_code',
      },
    });
  },
});

export const RedirectUrl = Model.extend({
  defaults: {
    nestAuthServer: '/auth/nest/',
  },
});
