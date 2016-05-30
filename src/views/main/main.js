import {LayoutView} from 'backbone.marionette';
import _ from 'underscore';
import template from './main.html';

export default LayoutView.extend({
  template: _.template(template),
  regions: {
    main: '.main-container',
    sidebar: '.sidebar-menu',
    dropdown: '.dropdown-menu'
  },
  initialize() {
    // on init
  },
  onBeforeShow() {

  }
});
