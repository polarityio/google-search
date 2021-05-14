polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  totalResults: 0,
  init() {
    this.set(
      'totalResults',
      this.get('details.searchInformation.totalResults')
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    );
    this._super(...arguments);
  }
});
