module.exports = function(grunt) {

    // All upfront config goes in a massive nested object.
    grunt.initConfig({
        // You can set arbitrary key-value pairs.
        distFolder: 'dist',
        // You can also set the value of a key as parsed JSON.
        // Allows us to reference properties we declared in package.json.
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: ["src/main/webapp/resources/email/emailApp-dist.min.js", "src/main/webapp/resources/lib/libraries.min.js", "temp/"]
            }
        },
        // Grunt tasks are associated with specific properties.
        // these names generally match their npm package name.
        concat: {
            // Specify some options, usually specific to each plugin.
            options: {
                // Specifies string to be inserted between concatenated files.
                separator: ';\n'
            },
            // 'dist' is what is called a "target."
            // It's a way of specifying different sub-tasks or modes.
            dist: {
                // The files to concatenate:
                // Notice the wildcard, which is automatically expanded.
                src: ["src/main/webapp/resources/lib/jquery/dist/jquery.min.js",
                    "src/main/webapp/resources/lib/angular/angular.min.js",
                    "src/main/webapp/resources/lib/angular-route/angular-route.min.js",
                    "src/main/webapp/resources/lib/angular-sanitize/angular-sanitize.min.js"],
                // The destination file:
                // Notice the angle-bracketed ERB-like templating,
                // which allows you to reference other properties.
                // This is equivalent to 'dist/main.js'.
                dest: 'src/main/webapp/resources/lib/libraries.min.js'
                // You can reference any grunt config property you want.
                // Ex: '<%= concat.options.separator %>' instead of ';'
            }
        },
        browserify: {
            dist: {
                src: ['src/main/webapp/resources/email/**/*.js'],
                dest: 'temp/emailApp-dist.js'
            },
            test: {
                src: [ 'src/main/webapp/resources/email/**/*.js','src/test/javascript/email/*-test.js'],
                dest: 'temp/jasmine-specs.js'
            }
        },
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! Minified on <%= grunt.template.today("MM/dd/yyyy HH:mm:ss") %> */\n',
                mangle: false,
                beautify: true
            },
            dist: {
                files: {
                    'src/main/webapp/resources/email/emailApp-dist.min.js': 'temp/emailApp-dist.js'
                }
            }
        },
        jasmine: {
            all: {
                src: [
                    'src/main/webapp/resources/email/**/*.js',
                    '!src/main/webapp/resources/email/app.js',
                    '!src/main/webapp/resources/email/emailApp-dist.min.js'
                ],
                options: {
                    helpers: [
                        'src/main/webapp/resources/lib/libraries.min.js',
                        'src/main/webapp/resources/lib/angular-mocks/angular-mocks.js',
                        'src/main/webapp/resources/lib/bardjs/dist/bard.js',
                        'src/main/webapp/resources/lib/sinon/*.js',
                        'src/main/webapp/resources/email/emailApp-dist.min.js'
                    ],
                    specs: 'temp/jasmine-specs.js',
                    keepRunner: true
                }
            }
        }
    }); // The end of grunt.initConfig


    // We've set up each task's configuration.
    // Now actually load the tasks.
    // This will do a lookup similar to node's require() function.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-browserify');

    // Register our own custom task alias.
    grunt.registerTask('build', ['clean', 'concat', 'browserify', 'uglify', 'jasmine:all']);
    grunt.registerTask('default',['build']);
};