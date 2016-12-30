module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      target: ['**/*.js', '!Gruntfile.js', '!node_modules/**/*.js']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          noFail: false
        },
        src: ['tests/**/*.js']
      }
    }
  });

  // loading modules
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  // additional tasks
  grunt.registerTask('default', () => {
    grunt.log.write(`Options:
                    grunt lint: eslint
                    grunt test: eslint, mochaTest`);
  });
  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', ['eslint', 'mochaTest']);
};
