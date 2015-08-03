module.exports = function(grunt) {

    // 自动分析package.json文件，自动加载所找到的grunt模块
    require('load-grunt-tasks')(grunt);

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            src: ['src'],
        },
        requirejs: {
            options: {
                baseUrl: 'js/'
            },
            jqueryDialog: {
                options: {
                    mainConfigFile: "js/jquery.dialog/common.js",
                    name: "dialog",
                    exclude: ["jquery"],
                    include: ["jquery.dialog/common.js", "position", "mask", 'simpletpl', 'dialog'],
                    out: "src/jquery-dialog.js"
                }
            },
            zeptoDialog: {
                options: {
                    mainConfigFile: "js/zepto.dialog/common.js",
                    name: "dialog",
                    exclude: ["zepto"],
                    include: ["zepto.dialog/common.js", "position", "mask", 'simpletpl', 'dialog'],
                    out: "src/zepto-dialog.js"
                }
            }
        }
    });

    grunt.registerTask('build', [
        'clean:src',
        'requirejs'
    ]);

};