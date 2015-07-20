requirejs.config({
    baseUrl: './dist',
    paths: {
        simpletpl: 'extend/simpletpl',
        position: 'jquery.dialog/position',
        mask: 'jquery.dialog/mask',
        dialog: 'jquery.dialog/dialog'
    }
})


// requirejs.config({
//     baseUrl: 'js',
//     paths: {
//         zepto: 'lib/zepto',
//         underscore: 'lib/underscore',
//         backbone: 'lib/backbobe',
//         text: 'lib/text',
//         json2: 'lib/json2',
//         handlebars: 'lib/handlebars',
//         av: 'lib/av-core',
//         app: 'app'
//     },
//     shim: {
//         underscore: {
//             exports: '_'
//         },
//         handlebars: {
//             exports: 'handlebars'
//         },
//         zepto: {
//             exports: '$'
//         },
//         av: {
//             exports: av
//         },
//         backbobe: {
//             exports: 'backbobe'
//         }
//     }
// });