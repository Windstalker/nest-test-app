import { Object as MnObject, Region, RegionManager } from 'backbone.marionette';
import { history } from 'backbone';

import { NestFB, NestAuth } from 'models/nest-api';

import MainView from 'views/main/main';
import LoginView from 'views/login/login';
import HomeView from 'views/home/home';

import { appChannel } from 'base/pubsub';

export default MnObject.extend({
  auth: new NestAuth(),
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
    if (route !== 'login' && !this.auth.get('access_token')) {
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
