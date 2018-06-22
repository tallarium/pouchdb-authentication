'use strict';

import { AuthError, doFetch, getBasicAuthHeaders, getSessionUrl } from './utils';

import { assign, toPromise } from 'pouchdb-utils';

var logIn = toPromise(function (username, password, opts, callback) {
  var db = this;
  if (typeof callback === 'undefined') {
    callback = opts;
    opts = {};
  }
  if (['http', 'https'].indexOf(db.type()) === -1) {
    return callback(new AuthError('this plugin only works for the http/https adapter'));
  }

  if (!username) {
    return callback(new AuthError('you must provide a username'));
  } else if (!password) {
    return callback(new AuthError('you must provide a password'));
  }

  var url = getSessionUrl(db);
  var ajaxOpts = assign({
    method: 'POST',
    headers: assign({'Content-Type': 'application/json'}, getBasicAuthHeaders(db)),
    body: {name: username, password: password},
  }, opts.ajax || {});

  return doFetch(url, ajaxOpts, callback);
});

var logOut = toPromise(function (opts, callback) {
  var db = this;
  if (typeof callback === 'undefined') {
    callback = opts;
    opts = {};
  }

  var url = getSessionUrl(db);
  var ajaxOpts = assign({
    method: 'DELETE',
    headers: getBasicAuthHeaders(db),
  }, opts.ajax || {});

  return doFetch(url, ajaxOpts, callback);
});

var getSession = toPromise(function (opts, callback) {
  var db = this;
  if (typeof callback === 'undefined') {
    callback = opts;
    opts = {};
  }

  var url = getSessionUrl(db);
  var ajaxOpts = assign({
    method: 'GET',
    headers: getBasicAuthHeaders(db),
  }, opts.ajax || {});

  return doFetch(url, ajaxOpts, callback);
});

export { logIn, logOut, getSession };
