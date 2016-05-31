import { ItemView } from 'backbone.marionette';
import _ from 'underscore';
import { RedirectUrl } from 'models/nest-api';
import template from './login.html';

export default ItemView.extend({
  model: new RedirectUrl(),
  template: _.template(template),
  serializeData() {
    const { nestAuthServer } = this.model.toJSON();
    const encodedRedirectUrl = encodeURIComponent(location.href);
    return {
      redirect: `${nestAuthServer}?redirect=${encodedRedirectUrl}`,
    };
  },
  onBeforeShow() {

  },
});
