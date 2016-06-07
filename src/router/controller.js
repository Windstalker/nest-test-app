import { Object as MnObject, RegionManager } from 'backbone.marionette';
import { history } from 'backbone';

import { NestFB, NestAuthModel } from 'models/nest-api';

import MainView from 'views/main/main';
import LoginView from 'views/login/login';
import HomeView from 'views/home/home';

import { appChannel } from 'base/pubsub';

export default MnObject.extend({
  auth: new NestAuthModel(),
  nestFB: new NestFB(),
  initialize() {
    this.mainView = new MainView();
    this.regionMgr = new RegionManager({
      regions: {
        app: '#app',
        overlay: '#overlay',
      },
    });
    this.regionMgr.get('app').show(this.mainView);
    this.setChannelHandlers();
  },
  setChannelHandlers() {

  },
  onRoute(fn, route, params) {
    const token = this.auth.checkAccessToken();
    if (token) {
      this.nestFB.auth(token).then(null, () => {
        this.auth.clearToken();
        this.redirectNotAuthorized();
      });
    }
    if (route !== 'login' && !token) {
      this.redirectNotAuthorized();
    }
    appChannel.vent.trigger('route:changed', route, params);
  },
  onRouteDefault() {
    this.showHomePage();
  },
  redirectNotAuthorized() {
    console.log('redirect to login');
    history.navigate('login', true);
  },
  showLoginPage() {
    this.mainView.showChildView('main', new LoginView());
  },
  showHomePage() {
    const { alarms, structures } = this.nestFB;
    this.mainView.showChildView('main', new HomeView({
      alarms,
      structures,
    }));
  },
  onRouteNotFound() {
    this.onRouteDefault();
  },
});
