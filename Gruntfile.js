module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        name: 'client',
        context_name: '<%= name %>##<%= pkg.version %>-<%= grunt.template.today("yyyymmddHHMM")%>',
        lib_scripts: [
            'www/bower_components/jquery/dist/jquery.js',
            'www/bower_components/angular/angular.js',
            'www/bower_components/angular-route/angular-route.js',
            'www/bower_components/angular-resource/angular-resource.js',
            'www/bower_components/angular-local-storage/dist/angular-local-storage.js',
            'www/bower_components/angular-translate/angular-translate.js',
            'www/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'www/bower_components/angular-simple-logger/dist/angular-simple-logger.js',
            'www/bower_components/angular-sanitize/angular-sanitize.js',
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
            'www/bower_components/ui-leaflet/dist/ui-leaflet.js',
            'www/bower_components/smalot-bootstrap-datetimepicker/js/bootstrap-datetimepicker.js',
            'www/bower_components/ng-table/dist/ng-table.js',
            'www/bower_components/xslt/dist/xslt.js'
        ],
        lib_ie9_scripts: [
            'www/bower_components/n52-sensorweb-client-core/src/js/IE9/*.js'
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
        core_scripts: [
            'www/bower_components/n52-sensorweb-client-core/src/js/Map/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Map/controller/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Map/directives/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Phenomenon/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Phenomenon/controller/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Provider/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Provider/controller/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Time/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Time/controller/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Time/directives/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Legend/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Legend/controller/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Legend/directives/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Styling/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Styling/controller/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Styling/directives/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Chart/controller/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Chart/directives/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Chart/flotlib/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Favorite/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Favorite/controller/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Favorite/directives/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Loading/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Loading/directives/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Table/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Table/controller/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Table/directives/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Settings/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Settings/controller/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Settings/directives/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/ListSelection/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/ListSelection/controller/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/ListSelection/directives/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/flotlib/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Menu/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Menu/controller/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Metadata/metadata.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Metadata/directives/procedureRawData.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Metadata/directives/procedureMetadata.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Metadata/directives/sosUrl.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/Metadata/directives/timeseriesRawData.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/services/startup/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/services/startup/parameterServices/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/services/**/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/helper/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/helper/controller/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/helper/service/*.js',
            'www/bower_components/n52-sensorweb-client-core/src/js/plugins/extendedGetTsData.js'
        ],
        app_js: [
            'www/app.js',
            'www/js/*.js',
            'www/js/*/*.js'
        ],
        app_styles: [
            'www/css/*/*.css'
        ],
        copy_files: [
            'settings.json',
            'templates/**/*.html',
            'i18n/*.json',
            'images/*',
            'css/images/*',
            'xslt/**.*'
        ],
        tags: {
            options: {
                scriptTemplate: '<script src="{{ path }}" type="text/javascript"></script>',
                linkTemplate: '<link href="{{ path }}" rel="stylesheet" type="text/css"/>'
            },
            build_lib_scripts: {
                options: {
                    openTag: '<!-- start lib script tags -->',
                    closeTag: '<!-- end lib script tags -->'
                },
                src: ['<%= lib_scripts %>'],
                dest: 'www/index.html'
            },
            build_client_scripts: {
                options: {
                    openTag: '<!-- start client script tags -->',
                    closeTag: '<!-- end client script tags -->'
                },
                src: ['<%= app_js %>'],
                dest: 'www/index.html'
            },
            build_core_scripts: {
                options: {
                    openTag: '<!-- start core script tags -->',
                    closeTag: '<!-- end core script tags -->'
                },
                src: ['<%= core_scripts %>'],
                dest: 'www/index.html'
            },
            build_lib_styles: {
                options: {
                    openTag: '<!-- start lib style tags -->',
                    closeTag: '<!-- end lib style tags -->'
                },
                src: ['<%= lib_styles %>'],
                dest: 'www/index.html'
            },
            build_client_styles: {
                options: {
                    openTag: '<!-- start client style tags -->',
                    closeTag: '<!-- end client style tags -->'
                },
                src: ['<%= app_styles %>'],
                dest: 'www/index.html'
            }
        },
        concat: {
            //core: {
            //    src: 'www/js/**/*.js',
            //    dest: 'dist/js/<%= name %>.js'
            //},
            libs: {
                src: ['<%= lib_scripts %>', '<%= core_scripts %>'],
                dest: 'dist/js/deps.<%= name %>.js'
            },
            app: {
                src: '<%= app_js %>',
                dest: 'dist/js/app.js'
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
                    'dist/app.js': ['<%= concat.app.dest %>']
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
                    war_dist_folder: 'build/',
                    war_name: '<%= context_name %>',
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
    grunt.loadNpmTasks('grunt-script-link-tags');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-war');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('env-build', ['tags']);
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy', 'processhtml']);

    grunt.registerTask('buildWar', ['test', 'default', 'war']);
};
