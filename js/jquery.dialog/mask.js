(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('jquery'));
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory(root.jQuery);
    }
}(this, function(jquery) {

    var win = $(window),
        doc = $(document),
        ua = (window.navigator.userAgent || "").toLowerCase(),
        isIE = ua.indexOf("msie") !== -1,
        isIE6 = ua.indexOf("msie 6") !== -1;

    function mask(opts){
        opts = $.extend({
            element: null,
            className: 'ui-mask',
            defaultStyle: {
                position: isIE6 ? 'absolute' : 'fixed',
                top: 0,
                left: 0,
                width: isIE6 ? doc.outerWidth(true) : '100%',
                height: isIE6 ? doc.outerHeight(true) : '100%',
            },
            maskStyle: {
                backgroundColor: '#000',
                opacity: 0.2
            }
        }, opts, true);
        opts.element.addClass(opts.className).css(opts.defaultStyle).css(opts.maskStyle);
    }

    return mask;

}));