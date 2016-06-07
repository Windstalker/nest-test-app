import { ItemView } from 'backbone.marionette';
import _ from 'underscore';
import { RedirectUrl } from 'models/nest-api';
import template from './login.html';

export default ItemView.extend({
  model: new RedirectUrl(),
  template: _.template(template),
  className: 'block white',
  serializeData() {
    const { nestAuthServer } = this.model.toJSON();
    return {
      redirect: `${nestAuthServer}`,
    };
  },
});
