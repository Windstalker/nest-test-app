/* eslint-disable quote-props */
import Mn, { AppRouter } from 'backbone.marionette';
import Controller from './controller';

export default AppRouter.extend({
  appRoutes: {
    '': 'onRouteDefault',
    'login': 'showLoginPage',
    'home': 'showHomePage',
    ':other': 'onRouteNotFound',
  },
  initialize() {
    this.controller = new Controller();
  },
  onRoute(...args) {
    Mn.triggerMethodOn(this.controller, 'route', ...args);
  },
});
/* eslint-enable quote-props */
