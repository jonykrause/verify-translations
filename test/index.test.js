var test = require('tape');
var path = require('path');
var verifyTranslationsIntegrity = require('../index');

var DIR = path.resolve(__dirname, 'fixtures');


test('should throw when passed wrong/missing arguments', function(t) {
  var shouldThrow1 = verifyTranslationsIntegrity.bind(null, DIR);
  var shouldThrow2 = verifyTranslationsIntegrity.bind(null, DIR, {});
  var shouldThrow3 = verifyTranslationsIntegrity.bind(null, DIR, []);
  t.plan(3);
  t.throws(shouldThrow1);
  t.throws(shouldThrow2);
  t.throws(shouldThrow3);
});


test('should throw when supported language is missing', function(t) {
  var areSupported = ['en-valid', 'de-valid', 'cz-missing'];
  var shouldThrow = verifyTranslationsIntegrity.bind(null, DIR, areSupported);
  t.plan(1);
  t.throws(shouldThrow);
});


test('should throw when there are invalid translations', function(t) {
  var areSupported = ['en-valid', 'de-valid', 'invalid'];
  var shouldThrow = verifyTranslationsIntegrity.bind(null, DIR, areSupported);
  t.plan(1);
  t.throws(shouldThrow);
});

test('should return true when given valid translations', function(t) {
  var areSupported = ['en-valid', 'de-valid'];
  var shouldBeTrue = verifyTranslationsIntegrity.bind(null, DIR, areSupported);
  t.plan(3);
  t.doesNotThrow(shouldBeTrue);
  t.ok(shouldBeTrue());
  t.equal(shouldBeTrue(), true)
});


test('should support deeply nested json', function(t) {
  var areSupported = ['en-valid-nested', 'de-valid-nested'];
  var shouldBeTrue = verifyTranslationsIntegrity.bind(null, DIR, areSupported);
  t.plan(3);
  t.doesNotThrow(shouldBeTrue);
  t.ok(shouldBeTrue());
  t.equal(shouldBeTrue(), true)
});


test('should throw when translations schema is not the same', function(t) {
  var areSupported = ['en-valid', 'de-valid', 'en-valid-nested'];
  var shouldThrow = verifyTranslationsIntegrity.bind(null, DIR, areSupported);
  t.plan(1);
  t.throws(shouldThrow);
});


test('should only use json', function(t) {
  var areSupported = ['en-valid', 'de-valid', 'es-valid'];
  var shouldThrow = verifyTranslationsIntegrity.bind(null, DIR, areSupported);
  t.plan(1);
  t.throws(shouldThrow);
});

