/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config, util: {clone}} = require('bedrock');
const {httpsAgent} = require('bedrock-https-agent');
const {create} = require('apisauce');

const cfg = config['zcap-storage-http'];
const {routes} = cfg;

const api = create({
  baseURL: `${config.server.baseUri}${routes.capabilities}`,
  httpsAgent,
  timeout: 1000
});

describe('capabilties API', function() {
  describe('insert API', function() {
    it('should insert a capability', async function() {

    });
  });
  describe('get API', function() {
    it('should work', async function() {

    });
  });
  describe('delete API', function() {
    it('should work', async function() {

    });
  });
});
