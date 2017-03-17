module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        name: 'client',
        context_name: '<%= name %>##<%= pkg.version %>-<%= grunt.template.today("yyyymmddHHMM")%>',
        lib_scripts: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-route/angular-route.js',
            'node_modules/angular-resource/angular-resource.js',
            'node_modules/angular-local-storage/dist/angular-local-storage.js',
            'node_modules/angular-translate/dist/angular-translate.js',
            'node_modules/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'node_modules/angular-simple-logger/dist/angular-simple-logger.js',
            'node_modules/angular-sanitize/angular-sanitize.js',
            'node_modules/moment/min/moment.min.js',
            'node_modules/Flot/jquery.flot.js',
            'node_modules/Flot/jquery.flot.time.js',
            'node_modules/Flot/jquery.flot.crosshair.js',
            'node_modules/flot-downsample/jquery.flot.downsample.js',
            'node_modules/leaflet/dist/leaflet.js',
            'node_modules/leaflet.markercluster/dist/leaflet.markercluster.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
            'node_modules/angular-ui-notification/dist/angular-ui-notification.min.js',
            'node_modules/qr-js/qr.js',
            'node_modules/ui-leaflet/dist/ui-leaflet.js',
            'node_modules/bootstrap-datetime-picker/js/bootstrap-datetimepicker.js',
            'node_modules/ng-table/dist/ng-table.js',
            'node_modules/xslt/dist/xslt.js'
        ],
        lib_ie9_scripts: [
            'node_modules/n52-sensorweb-client-core/src/js/IE9/*.js'
        ],
        lib_styles: [
            'node_modules/bootstrap-datetime-picker/css/bootstrap-datetimepicker.css',
            'node_modules/ng-table/dist/ng-table.css',
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/leaflet/dist/leaflet.css',
            'node_modules/leaflet.markercluster/dist/MarkerCluster.css',
            'node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
            'node_modules/angular-ui-notification/dist/angular-ui-notification.min.css'
        ],
        core_scripts: [
            'node_modules/n52-sensorweb-client-core/src/js/Map/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Map/**/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Phenomenon/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Phenomenon/controller/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Provider/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Provider/controller/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Time/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Time/controller/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Time/directives/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Legend/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Legend/components/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Legend/controller/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Legend/directives/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Styling/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Styling/controller/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Styling/directives/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Chart/*/*Mdul.js',
            'node_modules/n52-sensorweb-client-core/src/js/Chart/*/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Favorite/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Favorite/controller/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Favorite/directives/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Loading/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Loading/directives/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Table/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Table/controller/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Table/directives/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Settings/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Settings/controller/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Settings/directives/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/ListSelection/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/ListSelection/controller/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/ListSelection/directives/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/ListSelection/components/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/flotlib/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Menu/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Menu/controller/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/Metadata/metadata.js',
            'node_modules/n52-sensorweb-client-core/src/js/Metadata/directives/procedureRawData.js',
            'node_modules/n52-sensorweb-client-core/src/js/Metadata/directives/procedureMetadata.js',
            'node_modules/n52-sensorweb-client-core/src/js/Metadata/directives/sosUrl.js',
            'node_modules/n52-sensorweb-client-core/src/js/Metadata/directives/timeseriesRawData.js',
            'node_modules/n52-sensorweb-client-core/src/js/SeriesInterface/*MDUL.js',
            'node_modules/n52-sensorweb-client-core/src/js/SeriesInterface/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/base/module.js',
            'node_modules/n52-sensorweb-client-core/src/js/base/**/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/startup/module.js',
            'node_modules/n52-sensorweb-client-core/src/js/startup/**/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/helper/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/helper/controller/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/helper/service/*.js',
            'node_modules/n52-sensorweb-client-core/src/js/plugins/extendedGetTsData.js'
        ],
        app_js: [
            'www/app.js',
            'www/js/*.js',
            'www/js/*/*.js'
        ],
        app_styles: [
            'www/css/**/*.css'
        ],
        copy_files: [
            'settings.json',
            'templates/**/*.html',
            'templates/*.json',
            'i18n/*.json',
            'images/*',
            'css/images/*',
            'xslt/**.*'
        ],
        clean: ["dist/"],
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
        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015-script']
            },
            libs: {
                src: '<%= concat.libs.dest %>',
                dest: 'dist/js/deps.<%= name %>.min.js'
            },
            app: {
                src: '<%= concat.app.dest %>',
                dest: 'dist/app.js'
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
                    'dist/js/deps.<%= name %>.min.js': ['<%= babel.libs.dest %>']
                }
            },
            appJs: {
                files: {
                    'dist/app.js': ['<%= babel.app.dest %>']
                }
            }
        },
        cssmin: {
            options: {},
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
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['node_modules/bootstrap/dist/fonts/*'],
                    dest: 'dist/fonts/',
                    filter: 'isFile'
                }]
            },
            locals: {
                files: [{
                    expand: true,
                    flatten: false,
                    cwd: 'www/',
                    src: '<%= copy_files %>',
                    dest: 'dist/',
                    filter: 'isFile'
                }]
            }
        },
        jshint: {
            files: ['gruntfile.js', 'www/js/**/*.js', 'test/**/*.js'],
            options: {
                reporterOutput: "",
                jshintrc: true
            }
        },
        processhtml: {
            options: {
                data: {
                    message: '<%= name %> - version <%= pkg.version %> - build at <%= grunt.template.today("yyyy-mm-dd HH:MM") %>',
                    buildTime: '<%= grunt.template.today() %>'
                }
            },
            index: {
                files: {
                    'dist/index.html': ['www/index.html']
                }
            }
        },
        watch: {
            jshint: {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint']
            },
            less: {
                files: ['www/less/**/*.less'],
                tasks: ['less']
            }
        },
        less: {
            development: {
                options: {
                    paths: ['www/less/**/*.less']
                },
                files: {
                    'www/css/app.css': ['www/less/**/*.less']
                }
            }
        },
        war: {
            target: {
                options: {
                    war_dist_folder: 'build/',
                    war_name: '<%= context_name %>',
                    webxml_welcome: 'index.html',
                    webxml_display_name: '<%= name %> - version <%= pkg.version %> - build at <%= grunt.template.today("yyyy-mm-dd HH:MM") %>',
                    webxml_mime_mapping: [{
                        extension: 'woff',
                        mime_type: 'application/font-woff'
                    }]
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**'],
                    dest: ''
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-script-link-tags');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-war');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('env-build', ['tags']);
    grunt.registerTask('default', ['test', 'clean', 'less', 'concat', 'babel', 'uglify', 'cssmin', 'copy', 'processhtml']);

    grunt.registerTask('buildWar', ['default', 'war']);
};
