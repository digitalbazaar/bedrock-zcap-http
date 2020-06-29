/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config, util: {uuid}} = require('bedrock');
const {httpsAgent} = require('bedrock-https-agent');
const {create} = require('apisauce');
const {zcap, actors} = require('./mock-data');
const {stubPassport} = require('./helpers');

const cfg = config['zcap-storage-http'];
const {routes} = cfg;

const api = create({
  baseURL: `${config.server.baseUri}${routes.capabilities}`,
  httpsAgent,
  timeout: 1000
});

const actor = actors.alpha;

describe('capabilties API', function() {
  let capability, stubs = null;
  before(function() {
    stubs = stubPassport({actor});
  });
  beforeEach(function() {
    capability = zcap();
  });
  after(function() {
    stubs.optionallyAuthenticated.restore();
    stubs.ensureAuthenticated.restore();
  });
  describe('insert API', function() {
    it('should insert a capability', async function() {
      capability.controller = actor.id;
      const result = await api.post('', {controller: actor.id, capability});
      should.exist(result);
      result.status.should.equal(204);
    });
    it('should not insert a capability if the actor is not the controller',
      async function() {
        const result = await api.post(
          '', {controller: 'did:key:non-controller', capability});
        should.exist(result);
        result.status.should.equal(400);
      });
  });
  describe('get API', function() {
    it('should get a zcap by id', async function() {
      capability.controller = actor.id;
      const id = `urn:zcap:${uuid()}`;
      capability.id = id;
      capability.referenceId = id;
      const insertResult = await api.post(
        '', {controller: actor.id, capability});
      should.exist(insertResult);
      insertResult.status.should.equal(204);
      const getResult = await api.get('', {controller: actor.id, id});
      should.exist(getResult);
      getResult.status.should.equal(200);
      getResult.data.should.deep.equal(capability);
    });
    it('should get a zcap by referenceId', async function() {
      capability.controller = actor.id;
      const id = `urn:zcap:${uuid()}`;
      const referenceId = 'test-ref-id';
      capability.id = id;
      capability.referenceId = referenceId;
      const insertResult = await api.post(
        '', {controller: actor.id, capability});
      should.exist(insertResult);
      insertResult.status.should.equal(204);
      const getResult = await api.get('', {controller: actor.id, referenceId});
      should.exist(getResult);
      getResult.status.should.equal(200);
      getResult.data.should.deep.equal(capability);
    });
  });
  describe('delete API', function() {
    it('should delete a zcap by id', async function() {
      capability.controller = actor.id;
      const id = `urn:zcap:${uuid()}`;
      capability.id = id;
      capability.referenceId = id;
      const insertResult = await api.post(
        '', {controller: actor.id, capability});
      should.exist(insertResult);
      insertResult.status.should.equal(204);
      const deleteResult = await api.delete('', {controller: actor.id, id});
      should.exist(deleteResult);
      deleteResult.status.should.equal(204);
      const getResult = await api.get('', {controller: actor.id, id});
      should.exist(getResult);
      getResult.status.should.equal(404);
    });
    it('should delete a zcap by referenceId', async function() {
      capability.controller = actor.id;
      const id = `urn:zcap:${uuid()}`;
      const referenceId = 'test-delete-ref-id';
      capability.id = id;
      capability.referenceId = referenceId;
      const insertResult = await api.post(
        '', {controller: actor.id, capability});
      should.exist(insertResult);
      insertResult.status.should.equal(204);
      const deleteResult = await api.delete(
        '', {controller: actor.id, referenceId});
      deleteResult.status.should.equal(204);
      const getResult = await api.get('', {controller: actor.id, referenceId});
      should.exist(getResult);
      getResult.status.should.equal(404);
    });
  });
});
