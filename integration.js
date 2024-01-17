'use strict';

let Logger;

const { setLogger, getLogger } = require('./src/logger');
const { parseErrorToReadableJSON } = require('./src/errors');
const { polarityRequest } = require('./src/polarity-request');
const { validateOptions } = require('./src/userOptions');

const SEARCH_ENGINE_ID = 'f975889461020ee7a';
const disclaimerCache = {};

function startup(logger) {
  Logger = logger;
  setLogger(Logger);
}

function doLookup(entities, options, cb) {
  polarityRequest.setOptions(options);

  if (shouldShowDisclaimer(options)) {
    disclaimerCache[options._request.user.id] = new Date();

    const showDisclaimer = entities.map((entity) => {
      return {
        entity: entity,
        data: {
          summary: [`Searching Google for ${entity.value}`],
          details: {
            showDisclaimer: options.showDisclaimer,
            disclaimer: options.disclaimer
          }
        }
      };
    });

    return cb(null, showDisclaimer);
  }

  try {
    const lookupResults = Promise.all(
      entities.map(async (entity) => {
        return search(entity).then((searchResults) => {
          return {
            entity: entity,
            data: {
              summary: [
                `About ${searchResults.result.body.searchInformation.formattedTotalResults} results`
              ],
              details: {
                ...searchResults.result.body,
                items: searchResults.result.body.items.map((item) => ({
                  ...item,
                  displayUrl:
                    'https://' +
                    item.formattedUrl
                      .slice(8, item.formattedUrl.length - 1)
                      .replace(/^\/+|\/+$/g, '')
                      .split('/')
                      .join(' > '),
                  snippet:
                    typeof item.snippet === 'string'
                      ? item.snippet.replace(/\n/g, '')
                      : 'No snippet available'
                }))
              }
            }
          };
        });
      })
    );

    return cb(null, lookupResults);
  } catch (err) {
    const error = parseErrorToReadableJSON(err);
    Logger.error({ err: error }, 'Error Searching Google');
    return cb(error);
  }
}

async function search(entity) {
  const Logger = getLogger();

  try {
    const response = await polarityRequest.send({
      method: 'GET',
      uri: `https://www.googleapis.com/customsearch/v1/`,
      qs: {
        key: polarityRequest.options.apiKey,
        cx: SEARCH_ENGINE_ID,
        num: polarityRequest.options.maxResults,
        q: `"\"${entity.value.replace('g:', '')}\""`
      },
      json: true
    });

    Logger.trace({ response }, 'Response');

    return response[0];
  } catch (err) {
    const error = parseErrorToReadableJSON(err);
    Logger.error({ err: error }, 'Error Searching Google');
    throw error;
  }
}

function shouldShowDisclaimer() {
  if (!polarityRequest.options.showDisclaimer) {
    return false;
  }

  const { _request } = polarityRequest.options;
  const { user } = _request;
  const { id } = user;

  if (
    polarityRequest.options.disclaimerInterval.value === 'all' ||
    !disclaimerCache[id]
  ) {
    return true;
  }

  const cachedDisclaimerTime = disclaimerCache[id];

  const hours = getTimeDifferenceInHoursFromNow(cachedDisclaimerTime);
  Logger.trace({ hours }, 'Hours since last disclaimer');
  return hours >= polarityRequest.options.disclaimerInterval;
}

function getTimeDifferenceInHoursFromNow(date) {
  const diffInMs = Math.abs(new Date() - date);
  return diffInMs / (1000 * 60 * 60);
}

async function onMessage(payload, options, cb) {
  switch (payload.action) {
    case 'declineDisclaimer':
      delete disclaimerCache[options._request.user.id];
      cb(null, {
        declined: true
      });
    case 'search':
      const searchResults = await search(payload.entity);
      cb(null, {
        entity: payload.entity,
        data: {
          summary: [
            `About ${searchResults.result.body.searchInformation.formattedTotalResults} results`
          ],
          details: {
            ...searchResults.result.body,
            items: searchResults.result.body.items.map((item) => ({
              ...item,
              displayUrl:
                'https://' +
                item.formattedUrl
                  .slice(8, item.formattedUrl.length - 1)
                  .replace(/^\/+|\/+$/g, '')
                  .split('/')
                  .join(' > '),
              snippet:
                typeof item.snippet === 'string'
                  ? item.snippet.replace(/\n/g, '')
                  : 'No snippet available'
            }))
          }
        }
      });
  }
}

module.exports = {
  startup,
  validateOptions,
  doLookup,
  onMessage
};
