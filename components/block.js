polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  actions: {
    acceptDisclaimer: function () {
      this.set('details.showDisclaimer', false);
      this.set('details.acceptedDisclaimer', true);
      this.search();
    },
    declineDisclaimer: function () {
      const payload = {
        action: 'declineDisclaimer',
        search: this.get('details.response.choices')
      };

      this.sendIntegrationMessage(payload)
        .then((result) => {
          this.set('details.showDisclaimer', false);
          this.set('details.disclaimerDeclined', result.declined);
        })
        .catch((error) => {
          consol;
          this.set('errorMessage', JSON.stringify(error, null, 2));
        });
    }
  },
  search: function () {
    const payload = {
      action: 'search',
      entity: this.get('block.entity')
    };

    this.sendIntegrationMessage(payload)
      .then((result) => {
        this.set('details.items', result.data.details.items);
        this.set('details.showDisclaimer', false);
        this.set('details.disclaimerDeclined', false);
      })
      .catch((error) => {
        console.log(error);
        this.set('errorMessage', JSON.stringify(error, null, 2));
      });
  }
});
