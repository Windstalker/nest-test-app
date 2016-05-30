import {Application} from 'backbone.marionette';
import {history} from 'backbone';
import Router from 'router/router';

export default Application.extend({
  initialize(options) {
    this.appRouter = new Router();
    console.log('app init');
  },
  onStart() {
    console.log('on app start');
    history.start();
  }
});
