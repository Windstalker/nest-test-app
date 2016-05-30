import {Object as MnObject, Region, RegionManager} from 'backbone.marionette';
import {history} from 'backbone';
import MainView from 'views/main/main.js';
import {appChannel} from 'base/pubsub.js';

export default MnObject.extend({
  initialize(options) {
    this.mainView = new MainView();
    this.regionMgr = new RegionManager({
      regions: {
        app: '#app',
        overlay: '#overlay'
      }
    });
    this.regionMgr.get('app').show(this.mainView);
  },
  onRoute(...args) {
    appChannel.vent.trigger('route:changed', ...args);
  },
  onRouteDefault() {
    console.log('default route');

  },
  onRouteNotFound() {
    this.onRouteDefault();
  }
});
