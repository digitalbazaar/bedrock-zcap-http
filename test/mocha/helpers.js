/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const brPassport = require('bedrock-passport');
const sinon = require('sinon');

exports.stubPassport = ({actor}) => {
  const stubs = {
    optionallyAuthenticated: sinon.stub(brPassport, 'optionallyAuthenticated'),
    ensureAuthenticated: sinon.stub(brPassport, 'ensureAuthenticated')
  };
  const fakeAuth = (req, res, next) => {
    req.user = {
      account: {},
      actor,
    };
    next();
  };
  stubs.optionallyAuthenticated.callsFake(fakeAuth);
  stubs.ensureAuthenticated.callsFake(fakeAuth);
  return stubs;
};
