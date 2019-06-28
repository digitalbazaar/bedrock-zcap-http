/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const asyncHandler = require('express-async-handler');
const bedrock = require('bedrock');
const brPassport = require('bedrock-passport');
const brZCapStorage = require('bedrock-zcap-storage');
const {config} = bedrock;
const database = require('bedrock-mongodb');
require('bedrock-express');
const {
  ensureAuthenticated
} = brPassport;
const {util: {BedrockError}} = bedrock;

// load config defaults
require('./config');

// module API
const api = {};
module.exports = api;

bedrock.events.on('bedrock-express.configure.routes', app => {
  const cfg = config['zcap-storage-http'];
  const {routes} = cfg;

  // insert a zcap
  app.post(
    routes.zcaps,
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
    routes.zcaps,
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
    routes.zcaps,
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
