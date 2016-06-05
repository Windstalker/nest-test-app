import { Object as MnObject, Region, RegionManager } from 'backbone.marionette';
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
    appChannel.commands.setHandler('nest-login', this.onNestLogin, this);
  },
  onRoute(fn, route, params) {
    const token = this.auth.checkAccessToken();
    if (token) {
      this.nestFB.auth(token);
    }
    if (route !== 'login' && !token) {
      console.log('redirect to login');
      history.navigate('login', true);
    }
    appChannel.vent.trigger('route:changed', route, params);
  },
  onRouteDefault() {
    console.log('default route');
    this.showHomePage();
  },
  showLoginPage() {
    this.mainView.showChildView('main', new LoginView());
  },
  showHomePage() {
    this.mainView.showChildView('main', new HomeView());
  },
  onRouteNotFound() {
    this.onRouteDefault();
  },
  onNestLogin(code) {
    const { auth } = this;
    auth.authorize(code).then(() => {
      history.navigate('home', true);
    });
  },
});
