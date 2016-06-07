import { LayoutView } from 'backbone.marionette';
import _ from 'underscore';
import template from './main.html';

export default LayoutView.extend({
  template: _.template(template),
  className: 'block white',
  regions: {
    main: '.main-container',
  },
  initialize() {
    // on init
  },
  onBeforeShow() {

  },
});
