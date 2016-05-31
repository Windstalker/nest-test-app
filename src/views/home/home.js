import {ItemView} from 'backbone.marionette';
import _ from 'underscore';
import template from './home.html';

export default ItemView.extend({
  template: _.template(template),
  initialize() {
    // on init
  },
  onBeforeShow() {

  }
});
