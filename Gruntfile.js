module.exports = function(grunt) {

    // 自动分析package.json文件，自动加载所找到的grunt模块
    require('load-grunt-tasks')(grunt);

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            compass: {
                files: ['./sass/{*,*/}*.scss'],
                tasks: ['compass:main']
            }
        },
        compass: {
            main: {
                options: {
                    http_path: "/",
                    sassDir: 'sass',
                    cssDir: 'css',
                    imagesDir: 'images',
                    relativeAssets: true,
                    noLineComments: true,
                    assetCacheBuster: false
                }
            }
        },
        requirejs: {
            options: {
                baseUrl: 'dist/',
                mainConfigFile: "dist/common.js",
                banner: '/*! @Description:<%= pkg.name %> @Author:<%= pkg.author %> @Update:<%= grunt.template.today("yyyy-mm-dd") %> */\n',
                wrap: true,
                beautify: false, // 是否漂亮格式
                mangle: false, // 是否短化变量
                compress: true, // 是否压缩格式
                optimize: 'uglify', // 压缩的方式 默认：uglify  其他：none
                uglify: {
                    toplevel: true,
                    ascii_only: true,
                    beautify: false,
                    max_line_length: 1000,
                    defines: {
                        DEBUG: ['name', 'false']
                    },
                    no_mangle: true
                },
                sourceMap: ''
            },
            jqueryDialog: {
                options: {
                    mainConfigFile: "dist/jquery.dialog/common.js",
                    name: "dialog",
                    exclude: ["jquery"],
                    include: ["jquery.dialog/common.js", "position", "mask", 'simpletpl', 'dialog'],
                    out: "build/static/jquery-dialog.js"
                }
            },
            zeptoDialog: {
                options: {
                    mainConfigFile: "dist/zepto.dialog/common.js",
                    name: "dialog",
                    exclude: ["zepto"],
                    include: ["zepto.dialog/common.js", "position", "mask", 'simpletpl', 'dialog'],
                    out: "build/static/zepto-dialog.js"
                }
            }
        }
    });

    grunt.registerTask('default', ['watch']);
};