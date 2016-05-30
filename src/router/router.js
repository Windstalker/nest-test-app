import {AppRouter} from 'backbone.marionette';
import Controller from './controller';

export default AppRouter.extend({
  appRoutes: {
    '': 'onRouteDefault',
    ':other': 'onRouteNotFound'
  },
  initialize() {
    this.controller = new Controller();
  }
});
