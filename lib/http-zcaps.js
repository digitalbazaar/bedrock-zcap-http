/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {asyncHandler} = require('bedrock-express');
const bedrock = require('bedrock');
const {config, util: {BedrockError}} = bedrock;
const brPassport = require('bedrock-passport');
const brZCapStorage = require('bedrock-zcap-storage');
const database = require('bedrock-mongodb');
const {ensureAuthenticated} = brPassport;

bedrock.events.on('bedrock-express.configure.routes', app => {
  const cfg = config['zcap-storage-http'];
  const {routes} = cfg;

  // insert a zcap
  app.post(
    routes.capabilities,
    ensureAuthenticated,
    // TODO: add zcap validator
    //validate('bedrock-zcap-storage-http.zcap'),
    asyncHandler(async (req, res) => {
      // TODO: consider invoking the `account` as a zcap here ... and add
      // `invoker` and `delegator` to the account to avoid having a permission
      // based model here; automatically add an admin account as an invoker
      // whenever the account is retrieved that can't be removed
      const {actor} = req.user;
      const {controller, capability} = req.body;
      const referenceId = req.body.referenceId || capability.referenceId;
      if(actor.id !== controller) {
        throw new BedrockError(
          'Permission denied.',
          'NotAllowedError', {httpStatusCode: 400, public: true});
      }
      await brZCapStorage.zcaps.insert({controller, referenceId, capability});
      res.status(204).end();
    }));

  // get one or more zcaps
  app.get(
    routes.capabilities,
    ensureAuthenticated,
    // TODO: validate query
    asyncHandler(async (req, res) => {
      // TODO: consider invoking the `account` as a zcap here ... and add
      // `invoker` and `delegator` to the account to avoid having a permission
      // based model here; automatically add an admin account as an invoker
      // whenever the account is retrieved that can't be removed
      const {actor} = req.user;
      const {controller, id, referenceId} = req.query;
      if(actor.id !== controller) {
        throw new BedrockError(
          'Permission denied.',
          'NotAllowedError', {httpStatusCode: 400, public: true});
      }
      if(id || referenceId) {
        const {capability} = await brZCapStorage.zcaps.get(
          {controller, id, referenceId});
        res.json(capability);
      } else {
        const query = {controller: database.hash(controller)};
        const results = await brZCapStorage.zcaps.find(
          {query, fields: {_id: 0, capability: 1}});
        res.json(results.map(r => r.capability));
      }
    }));

  // delete a zcap
  app.delete(
    routes.capabilities,
    ensureAuthenticated,
    // TODO: validate query
    asyncHandler(async (req, res) => {
      // TODO: consider invoking the `account` as a zcap here ... and add
      // `invoker` and `delegator` to the account to avoid having a permission
      // based model here; automatically add an admin account as an invoker
      // whenever the account is retrieved that can't be removed
      const {actor} = req.user;
      const {controller, id, referenceId} = req.query;
      if(actor.id !== controller) {
        throw new BedrockError(
          'Permission denied.',
          'NotAllowedError', {httpStatusCode: 400, public: true});
      }
      const removed = await brZCapStorage.zcaps.remove(
        {controller, id, referenceId});
      if(removed) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    }));
});
