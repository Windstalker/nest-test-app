import 'skeleton-scss/scss/skeleton.scss';
import 'styles/main.scss';
import { Application } from 'backbone.marionette';
import { history } from 'backbone';
import Router from 'router/router';

export default Application.extend({
  initialize() {
    this.appRouter = new Router();
    console.log('app init');
  },
  onStart() {
    console.log('on app start');
    history.start({
      pushState: true,
    });
  },
});

// HMR
if (module.hot) {
  module.hot.accept();
}
