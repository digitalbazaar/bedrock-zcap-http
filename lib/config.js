/*
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const {config} = bedrock;
//const path = require('path');
require('bedrock-validation');

const namespace = 'zcap-storage-http';
const cfg = config[namespace] = {};

const baseURL = '/zcaps';
cfg.routes = {
  baseURL,
  capabilities: `${baseURL}/capabilities`,
};

// common validation schemas
// config.validation.schema.paths.push(
//   path.join(__dirname, '..', 'schemas'));
