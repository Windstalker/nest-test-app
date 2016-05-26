import Ember from 'ember';

const model = {
  nestOAuthURL: 'http://localhost:3001/auth/nest'
};

export default Ember.Route.extend({
  beforeModel() {
    window.open(model.nestOAuthURL);
  }
});
