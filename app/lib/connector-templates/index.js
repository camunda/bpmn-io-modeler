/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

/*
 * @typedef { {
 *   id: string,
 *   version?: number;
 * } } Template
 */

const fs = require('fs');
const path = require('path');

const MARKET_PLACE_API_URL = 'https://marketplace.cloud.camunda.io/api/v1';

const log = require('../log')('app:connector-templates');

const connectorTemplatesFileName = '.camunda-connector-templates.json';

function getConnectorTemplatesPath(userPath) {
  return path.join(userPath, 'resources/element-templates', connectorTemplatesFileName);
}

module.exports.getConnectorTemplatesPath = getConnectorTemplatesPath;

async function updateConnectorTemplates(renderer, userPath) {
  try {
    const connectorTemplatesPath = getConnectorTemplatesPath(userPath);

    const hasConnectorTemplates = fs.existsSync(connectorTemplatesPath);

    let connectorTemplates = [];

    if (hasConnectorTemplates) {
      try {
        connectorTemplates = JSON.parse(fs.readFileSync(connectorTemplatesPath));

        if (!Array.isArray(connectorTemplates)) {
          connectorTemplates = [];
        }
      } catch (error) {
        log.warn('Failed to parse connector templates', error);
      }
    }

    const { latestConnectorTemplates, warnings } = await fetchLatestConnectorTemplates();

    const {
      connectorTemplates: mergedConnectorTemplates,
      added
    } = mergeConnectorTemplates(connectorTemplates, latestConnectorTemplates);

    fs.mkdirSync(path.dirname(connectorTemplatesPath), { recursive: true });

    fs.writeFileSync(connectorTemplatesPath, JSON.stringify(mergedConnectorTemplates, null, 2));

    renderer.send('client:connector-templates-update-success', added > 0, warnings);
  } catch (error) {
    renderer.send('client:connector-templates-update-error', error.message);
  }
}

module.exports.updateConnectorTemplates = updateConnectorTemplates;

/**
 * Fetch latest connector templates created by Camunda through marketplace API.
 * Skip connector templates that cannot be fetched or parsed without errors.
 *
 * @returns {Promise<Template[]>}
 */
async function fetchLatestConnectorTemplates() {
  log.info('Fetching Camunda connector templates');

  let response = await fetch(`${ MARKET_PLACE_API_URL }/connectors?creatorType=camunda`);

  if (!response.ok) {
    throw new Error('Failed to fetch Camunda connector templates');
  }

  const { items } = await response.json();

  const latestConnectorTemplates = [],
        warnings = [];

  for (const item of items) {
    response = await fetch(`${ MARKET_PLACE_API_URL }/connectors/${ item.id }`);

    if (!response.ok) {
      log.warn('Failed to fetch Camunda connector template', item.name);

      warnings.push(`Unable to fetch Camunda connector template ${ item.name }`);

      continue;
    }

    const { templates } = await response.json();

    for (const template of templates) {
      response = await fetch(template.url);

      if (!response.ok) {
        log.warn('Failed to fetch Camunda connector template', item.name);

        warnings.push(`Unable to fetch Camunda connector template ${ item.name }`);

        continue;
      }

      const templateText = await response.text();

      try {
        const templateJson = JSON.parse(templateText);

        latestConnectorTemplates.push(templateJson);

        log.info('Fetched Camunda connector template', templateJson.id);
      } catch (error) {
        log.warn('Failed to fetch Camunda connector template', item.name);

        warnings.push(`Unable to fetch Camunda connector template ${ item.name }`);

        continue;
      }
    }
  }

  return { latestConnectorTemplates, warnings };
}

/**
 * Merge latest connector templates with existing. If connector template with
 * same ID and version exists, it will be replaced by latest. Otherwise, latest
 * will be added. No connector templates will be removed.
 *
 * @param {Template[]} connectorTemplates
 * @param {Template[]} latestConnectorTemplates
 *
 * @returns {Template[]}
 */
function mergeConnectorTemplates(connectorTemplates, latestConnectorTemplates) {
  let added = 0,
      replaced = 0;

  const mergedConnectorTemplates = [ ...connectorTemplates ];

  for (const latestConnectorTemplate of latestConnectorTemplates) {
    const index = mergedConnectorTemplates.findIndex((connectorTemplate) => {
      return connectorTemplate.id === latestConnectorTemplate.id
        && connectorTemplate.version === latestConnectorTemplate.version;
    });

    if (index !== -1) {
      mergedConnectorTemplates[ index ] = latestConnectorTemplate;

      replaced++;

      log.info('Replaced Camunda connector template', latestConnectorTemplate.id);
    } else {
      mergedConnectorTemplates.push(latestConnectorTemplate);

      added++;

      log.info('Added Camunda connector template', latestConnectorTemplate.id);
    }
  }

  return {
    connectorTemplates: mergedConnectorTemplates,
    added,
    replaced
  };
}