module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        name: 'client',
        lib_scripts: [
            'www/bower_components/jquery/dist/jquery.js',
            'www/bower_components/angular/angular.js',
            'www/bower_components/angular-route/angular-route.js',
            'www/bower_components/angular-resource/angular-resource.js',
            'www/bower_components/angular-local-storage/dist/angular-local-storage.js',
            'www/bower_components/angular-translate/angular-translate.js',
            'www/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'www/bower_components/angular-simple-logger/dist/index.js',
            'www/bower_components/moment/min/moment.min.js',
            'www/bower_components/xhr-xdr-adapter/src/xhr-xdr-adapter.js',
            'www/bower_components/flot/jquery.flot.js',
            'www/bower_components/flot/jquery.flot.time.js',
            'www/bower_components/flot/jquery.flot.crosshair.js',
            'www/bower_components/flot-downsample/jquery.flot.downsample.js',
            'www/bower_components/leaflet/dist/leaflet.js',
            'www/bower_components/leaflet.markercluster/dist/leaflet.markercluster.js',
            'www/bower_components/L.GeoSearch/src/js/l.control.geosearch.js',
            'www/bower_components/L.GeoSearch/src/js/l.geosearch.provider.openstreetmap.js',
            'www/bower_components/bootstrap/dist/js/bootstrap.js',
            'www/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'www/bower_components/angular-ui-notification/dist/angular-ui-notification.min.js',
            'www/bower_components/qr-js/qr.min.js',
            'www/bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.js',
            'www/bower_components/smalot-bootstrap-datetimepicker/js/bootstrap-datetimepicker.js',
            'www/bower_components/ng-table/dist/ng-table.js',
            'www/bower_components/js-client-core/dist/*.min.js',
            'www/libs/jquery.flot.navigate.js'
        ],
        lib_ie9_scripts: [
            'www/bower_components/js-client-core/dist/IE9/*.min.js'
        ],
        lib_styles: [
            'www/bower_components/L.GeoSearch/src/css/l.geosearch.css',
            'www/bower_components/smalot-bootstrap-datetimepicker/css/bootstrap-datetimepicker.css',
            'www/bower_components/ng-table/dist/ng-table.css',
            'www/bower_components/bootstrap/dist/css/bootstrap.min.css',
            'www/bower_components/leaflet/dist/leaflet.css',
            'www/bower_components/leaflet.markercluster/dist/MarkerCluster.css',
            'www/bower_components/leaflet.markercluster/dist/MarkerCluster.Default.css',
            'www/bower_components/angular-ui-notification/dist/angular-ui-notification.min.css'
        ],
        app_js: [
            'www/app.js'
        ],
        copy_files: [
            'settings.json',
            'templates/**/*.html',
            'i18n/*.json',
            'images/*',
            'css/images/*'
        ],
        dist: {
            js: {
                lib: {
                }
            }
        },
        concat: {
            //core: {
            //    src: 'www/js/**/*.js',
            //    dest: 'dist/js/<%= name %>.js'
            //},
            libs: {
                src: '<%= lib_scripts %>',
                dest: 'dist/js/deps.<%= name %>.js'
            },
            styles: {
                src: 'www/css/**/*.css',
                dest: 'dist/css/<%= name %>.css'
            },
            libStyles: {
                src: '<%= lib_styles %>',
                dest: 'dist/css/deps.<%= name %>.css'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= name %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
            },
            //core: {
            //    files: {
            //        'dist/js/<%= name %>.min.js': ['<%= concat.core.dest %>']
            //    }
            //},
            libIe9: {
                files: {
                    'dist/js/favoriteIE9ImExportCore.min.js': ['<%= lib_ie9_scripts %>']
                }
            },
            libs: {
                files: {
                    'dist/js/deps.<%= name %>.min.js': ['<%= concat.libs.dest %>']
                }
            },
            appJs: {
                files: {
                    'dist/app.js': ['www/app.js']
                }
            }
        },
        cssmin: {
            options: {
            },
            styles: {
                files: {
                    'dist/css/<%= name %>.min.css': ['<%= concat.styles.dest %>']
                }
            },
            depStyles: {
                files: {
                    'dist/css/deps.<%= name %>.min.css': ['<%= concat.libStyles.dest %>']
                }
            }
        },
        copy: {
            depStyles: {
                files: [
                    {expand: true, flatten: true, src: ['www/bower_components/bootstrap/dist/fonts/*'], dest: 'dist/fonts/', filter: 'isFile'}
                ]
            },
            locals: {
                files: [
                    {expand: true, flatten: false, cwd: 'www/', src: '<%= copy_files %>', dest: 'dist/', filter: 'isFile'}
                ]
            }
        },
        jshint: {
            files: ['gruntfile.js', 'www/js/**/*.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        processhtml: {
            options: {
                data: {
                    message: '<%= name %> - version <%= pkg.version %> - build at <%= grunt.template.today("yyyy-mm-dd HH:MM") %>'
                }
            },
            index: {
                files: {
                    'dist/index.html': ['www/index.html']
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },
        war: {
            target: {
                options: {
                    war_dist_folder: 'war/',
                    war_name: '<%= name %>',
                    webxml_welcome: 'index.html',
                    webxml_display_name: '<%= name %> - version <%= pkg.version %> - build at <%= grunt.template.today("yyyy-mm-dd HH:MM") %>',
                    webxml_mime_mapping: [
                        {
                            extension: 'woff',
                            mime_type: 'application/font-woff'
                        }]
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['**'],
                        dest: ''
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-war');

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy', 'processhtml']);

    grunt.registerTask('buildWar', ['test', 'default', 'war']);
};