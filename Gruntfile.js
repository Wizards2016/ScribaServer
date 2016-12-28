module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      target: ['**/*.js', '!Gruntfile.js', '!node_modules/**/*.js']
    },
    tslint: {
      files: {
        src: ['**/*.ts', '!node_modules/*', '!node_modules/**/*.ts']
      }
    },
    watch: {
      scripts: {
        files: ['**/*.js', '**/*.ts', '!Gruntfile.js', '!node_modules/**/*.js', '!node_modules/**/*.ts'],
        tasks: ['eslint', 'tslint']
      }
    }
  });

  // loading modules
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // additional tasks
  grunt.registerTask('default', ['eslint', 'tslint', 'watch']);
  grunt.registerTask('test', ['eslint', 'tslint']);
};
