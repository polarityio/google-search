polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  init() {
    if (!this.get('block._state')) {
      this.set('block._state', {});
      this.set('block._state.errorMessage', '');
    }

    this._super(...arguments);
  },
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
          console.error(error);
          this.set(
            'block._state.errorMessage',
            JSON.stringify(this.getErrorMessage(error), null, 2)
          );
        });
    }
  },
  search: function () {
    this.set('runningSearch', true);
    const payload = {
      action: 'search',
      entity: this.get('block.entity')
    };

    this.sendIntegrationMessage(payload)
      .then((result) => {
        if(result.data.details.noResults){
          this.set('details.noResults', result.data.details.noResults);
        } else {
          this.set('details.items', result.data.details.items);
        }
        this.set('block.data.summary', result.data.summary);
        this.set('details.showDisclaimer', false);
        this.set('details.disclaimerDeclined', false);
      })
      .catch((error) => {
        console.error(error);
        this.set(
          'block._state.errorMessage',
          JSON.stringify(this.getErrorMessage(error), null, 2)
        );
      })
      .finally(() => {
        this.set('runningSearch', false);
      });
  },
  getErrorMessage(error) {
    if (Array.isArray(error) && error.length > 0) {
      error = error[0];
    }

    if (error.meta && error.meta.detail) {
      return error.meta.detail;
    } else {
      return error;
    }
  }
});
