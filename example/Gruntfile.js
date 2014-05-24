module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    verifytranslations: {
      src: ['./translations'],
      options: {
        supported: ['de', 'en']
      }
    }
  });

  grunt.loadTasks('./grunt-tasks');
  grunt.registerTask('default', ['verifytranslations']);

};
