import { CompositeView } from 'backbone.marionette';
import _ from 'underscore';
import template from './structure.html';
import DeviceView from 'views/device/device';

export default CompositeView.extend({
  template: _.template(template),
  childView: DeviceView,
  childViewContainer: '.devices-list',
  className: 'structure-wrapper',
  initialize(options) {
    this.collection = options.alarms;
  },
});
