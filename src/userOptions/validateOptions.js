const { validateStringOptions } = require('./utils');

const validateOptions = async (options, callback) => {
  const stringOptionsErrorMessages = {
    apiKey: '* Required',
  };

  const stringValidationErrors = validateStringOptions(
    stringOptionsErrorMessages,
    options
  );

  callback(null, stringValidationErrors);
};

module.exports = validateOptions;
