'use strict';

var verifyTranslationsIntegrity = require('../../index');

module.exports = function(grunt) {
  grunt.registerMultiTask( 'verifytranslations', 'verify translations', function() {
    var dir = this.data[0]; 
    var options = this.options();
    return verifyTranslationsIntegrity(dir, options.supported);
  });
};


