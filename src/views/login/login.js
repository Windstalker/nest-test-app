import { ItemView } from 'backbone.marionette';
import _ from 'underscore';
import { RedirectUrl } from 'models/nest-api';
import { appChannel } from 'base/pubsub';
import template from './login.html';

export default ItemView.extend({
  model: new RedirectUrl(),
  template: _.template(template),
  ui: {
    form: '#login',
    codeInput: 'input[name=code]',
  },
  events: {
    'submit @ui.form': 'logIn',
  },
  serializeData() {
    const { nestAuthServer } = this.model.toJSON();
    // const encodedRedirectUrl = encodeURIComponent(location.href);
    return {
      redirect: `${nestAuthServer}`,
    };
  },
  onRender() {
    console.log(this.ui.form);
    // this.ui.form.on('submit', (ev) => ev.preventDefault());
  },
  logIn(ev) {
    ev.preventDefault();
    const authCode = this.ui.codeInput.val();
    appChannel.commands.execute('nest-login', authCode);
  },
});
