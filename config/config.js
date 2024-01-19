module.exports = {
  /**
   * Name of the integration which is displayed in the Polarity integrations user interface
   *
   * @type String
   * @required
   */
  name: 'Google',
  /**
   * The acronym that appears in the notification window when information from this integration
   * is displayed.  Note that the acronym is included as part of each "tag" in the summary information
   * for the integration.  As a result, it is best to keep it to 4 or less characters.  The casing used
   * here will be carried forward into the notification window.
   *
   * @type String
   * @required
   */
  acronym: 'GS',
  /**
   * Description for this integration which is displayed in the Polarity integrations user interface
   *
   * @type String
   * @optional
   */
  description:
    'Google integration allows a Polarity user to retrieve and display search results from Google programmatically. Just like searching Google directly.',
  entityTypes: ['hash', 'cve'],
  customTypes: [
    {
      key: 'g:Search',
      regex: /^g:.{2,2048}/
    },
    {
      key: 'allText',
      regex: /\S[\s\S]{2,2048}\S/
    },
    {
      key: '@handle',
      regex: /@(\w){1,24}/
    }
  ],
  defaultColor: 'light-gray',
  /**
   * Provide custom component logic and template for rendering the integration details block.  If you do not
   * provide a custom template and/or component then the integration will display data as a table of key value
   * pairs.
   *
   * @type Object
   * @optional
   */
  styles: ['./styles/style.less'],
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
    }
  },
  request: {
    // Provide the path to your certFile. Leave an empty string to ignore this option.
    // Relative paths are relative to the integration's root directory
    cert: '',
    // Provide the path to your private key. Leave an empty string to ignore this option.
    // Relative paths are relative to the integration's root directory
    key: '',
    // Provide the key passphrase if required.  Leave an empty string to ignore this option.
    // Relative paths are relative to the integration's root directory
    passphrase: '',
    // Provide the Certificate Authority. Leave an empty string to ignore this option.
    // Relative paths are relative to the integration's root directory
    ca: '',
    // An HTTP proxy to be used. Supports proxy Auth with Basic Auth, identical to support for
    // the url parameter (by embedding the auth info in the uri)
    proxy: ''
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  onDemandOnly: true,
  /**
   * Options that are displayed to the user/admin in the Polarity integration user-interface.  Should be structured
   * as an array of option objects.
   *
   * @type Array
   * @optional
   */
  options: [
    {
      key: 'apiKey',
      name: 'API Key',
      description: 'Valid Google CSE API Key',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'showDisclaimer',
      name: 'Show Search Disclaimer',
      description:
        'If enabled, the integration will show a disclaimer the user must accept before running a search.',
      default: false,
      type: 'boolean',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'disclaimer',
      name: 'Search Disclaimer Content',
      description:
        'A disclaimer that users must review before the integration will submit questions to the Google Search API.',
      default:
        'Please affirm that no confidential information will be shared with your submission to Google. Click Accept to run your search.',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'disclaimerInterval',
      name: 'Disclaimer Interval',
      description:
        'How often to display the disclaimer to users. Restarting the integration will reset the interval timer.',
      default: {
        value: 'all',
        display: 'All searches - disclaimer will be shown before every search (default)'
      },
      type: 'select',
      options: [
        {
          value: 'all',
          display:
            'All searches - disclaimer will be shown before every new search (default)'
        },
        {
          value: '24',
          display: 'Every 24 hours - disclaimer will be shown once per day'
        },
        {
          value: '168',
          display: 'Every week - disclaimer will be shown once per week'
        }
      ],
      multiple: false,
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'maxResults',
      name: 'Maximum Number of Results to Return',
      description: 'Maximum number of search results to return',
      default: 10,
      type: 'number',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
