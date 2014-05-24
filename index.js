"use strict";

var fs = require('fs');
var path = require('path');
var deepEqual = require('deep-equal');


/**
 * Verifies JSON integrity given a path and an array of supported languages
 *
 * @param {String} path
 * @param {Array} supported
 * @return {Boolean}
 */
module.exports = function(path, supported) {
  if (!path || !Array.isArray(supported) || !supported.length) throw new Error('path and supported array required');
  return isValid(concatJSON(path, supported), supported);
};

/**
 * Check object according to constraints given an object and an array of supported languages
 *
 * @param {Object} obj
 * @param {Array} supported
 * @return {Boolean}
 */
function isValid(obj, supported) {
  return hasEveryLanguage(obj, supported) && hasOnlyValidTranslations(obj);
};

/**
 * Check if every supported language is available given an object and an array of supported languages
 *
 * @param {Object} obj
 * @param {Array} supported
 */
function hasEveryLanguage(obj, supported) {
  var keys = Object.keys(obj);
  return keys.length === supported.length
    && supported.every(function(lang) {
      return ~supported.indexOf(lang)
    })
    ? true
    : throwError('Missing supported language, comparing:\n Given: ' + JSON.stringify(keys, null, 2) + '\n Supported: ' +JSON.stringify(supported, null, 2));
};

/**
 * Check/Compare normalized language translations given an object
 *
 * @param {Object} obj
 */
function hasOnlyValidTranslations(obj) {
  var resetObj = resetValuesToBools(obj);
  var keys = Object.keys(resetObj);
  return keys.reduce(function(prev, curr, i) {
    prev = resetObj[prev], curr = resetObj[curr];
    return deepEqual(prev, curr, {strict: true}) 
      ? true 
      : throwError('Invalid translations, comparing: ' + keys[i-1] + '/' + keys[i] + ' ' + JSON.stringify([resetObj[keys[i-1]], resetObj[keys[i]]], null, 2));
  });
};

/**
 * Normalize values of object to Booleans by recursively traversing a given object
 *
 * @param {Object} obj
 * @return {Object} obj
 */
function resetValuesToBools(obj) {
  Object.keys(obj).forEach(function(key) {
    var value = obj[key];
    if (value instanceof Object) {
      return resetValuesToBools(value);
    } else {
      obj[key] = obj[key] && obj[key].length ? true : false;
    }
  });
  return obj;
};

/**
 * Require translation json synchronously, concat according to supported languages
 *
 * @param {String} path
 * @param {Array} supported
 * @return {Object} obj
 */
function concatJSON(dir, supported) {
  var obj = {};
  fs.readdirSync(dir).forEach(function(file) {
    var lang = file.split('.')[0];
    if (isIn(file, '.json') && isIn(supported, lang)) return obj[lang] = require(path.resolve(dir, file));
  });
  return obj;
};

// In string or array helper
function isIn(container, value) {
  return ~container.indexOf(value);
};

// Error message helper
function throwError(message) {
  throw new Error(message);
};

