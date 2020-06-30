/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {util: {clone}} = require('bedrock');

const mocks = {};
module.exports = mocks;

const zcap = {
  id: 'urn:zcap:076a866b-1a9b-49d9-989b-e86757ad7fd2',
  allowedAction: ['test'],
  controller: 'did:key:foo',
  '@context': 'did:content:foo',
  parentCapability: 'urn:zcap:bar',
  invocationTarget: 'urn:test:055283db-2c39-466a-a1b8-b0c12007b25e',
  referenceId: 'did:test:foo',
  // TODO is this necessary?
  // removing the invoker causes a failure in
  // bedrock-zcap-storage/lib/storage.js:245:10
  // AssertionError [ERR_ASSERTION]: capability.invoker (string) is required
  // this is with both controller and invoker set
  invoker: 'did:key:invoker'
};

mocks.zcap = () => clone(zcap);

const actors = mocks.actors = {};

actors.alpha = {
  id: 'urn:uuid:ec6bcc36-e7ab-46e9-aebb-ab57caee4fbe'
};

actors.beta = {
  id: 'urn:uuid:df29c22a-9c68-448c-a04b-345383aaf8ff'
};
