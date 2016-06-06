import { ItemView } from 'backbone.marionette';
import _ from 'underscore';
import template from './device.html';

export default ItemView.extend({
  template: _.template(template),
  className: 'device-wrapper',
});
