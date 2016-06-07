import { ItemView } from 'backbone.marionette';
import _ from 'underscore';
import template from './device.html';

export default ItemView.extend({
  template: _.template(template),
  className: 'device-wrapper block white',
  onBeforeRender() {
    const { ui_color_state } = this.serializeData();
    this.$el.addClass(`alert-${ui_color_state}`);
  },
});
