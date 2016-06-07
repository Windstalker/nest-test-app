import { CollectionView } from 'backbone.marionette';
// import _ from 'underscore';
// import template from './home.html';
import StructureView from 'views/structure/structure';
import { Devices } from 'models/nest-api';

export default CollectionView.extend({
  // template: _.template(template),
  childView: StructureView,
  initialize(options) {
    this.collection = options.structures;
    this.alarms = options.alarms;
    this.listenTo(
      this.alarms,
      'reset add remove',
      this.render
    );
  },
  childViewOptions(model) {
    const structure_id = model.get('structure_id');
    const filtered = this.alarms.where({ structure_id });
    const alarms = new Devices(filtered);
    return {
      alarms,
    };
  },
  onBeforeShow() {

  },
});
