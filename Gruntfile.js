module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      target: ['**/*.js', '!node_modules/**/*.js']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          noFail: false
        },
        src: ['tests/**/*.js']
      }
    },
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
    shell: {
      database: {
        command: [
          'mysql.server start',
          'mysql -u root -e "drop database scribadb; create database scribadb"'
        ].join('&&')
      },
      seed: {
        command: 'node seed.js'
      }
    }
  });

  // loading modules
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-shell');
  // additional tasks
  grunt.registerTask('default', () => {
    grunt.log.write(`Options:
                    grunt lint: Run eslint
                    grunt test: Run eslint, run server and database tests
                    grunt db: Drop and create database scribadb`);
  });
  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', ['eslint', 'mochaTest']);
  grunt.registerTask('db', ['shell:database']);
};
