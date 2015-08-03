(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['zepto'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('zepto'));
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory(root.Zepto);
    }
}(this, function(zepto) {
    var win = $(window),
        doc = $(document),
        ua = (window.navigator.userAgent || "").toLowerCase(),
        isIE = ua.indexOf("msie") !== -1,
        isIE6 = ua.indexOf("msie 6") !== -1;

    /**
     * [position 定位]
     * @param {[type]} opts [description]
     */
    function position(opts) {
        opts = $.extend({}, {
            baseAlign: '50% 50%', //
            parentAlign: '50% 50%', //
            isSticky: false,
            parentElement: document.body, // 父元素，若为空，则为 body
            baseElement: null // 需要定位的元素
        }, opts);

        var $elBase = $(opts.baseElement),
            $elParent = opts.isSticky === true ? win : $(opts.parentElement),
            parentElementOffset = posConverter(opts.parentAlign, $elParent.width(), $elParent.height()),
            baseElementOffset = posConverter(opts.baseAlign, $elBase.width(), $elBase.height())

        if (opts.isSticky === true) {
            if (isIE6) {

                _reset();
                win.on('scroll resize', debounce(function() {
                    var _timer = setTimeout(function() {
                        _reset();
                        clearTimeout(_timer);
                    }, 100);
                }))

                function _reset() {
                    $elBase.css({
                        position: 'absolute',
                        left: doc.scrollLeft() + parentElementOffset[0] - baseElementOffset[0],
                        top: doc.scrollTop() + parentElementOffset[1] - baseElementOffset[1]
                    });
                }
            } else {
                $elBase.css({
                    position: 'fixed',
                    left: parentElementOffset[0] - baseElementOffset[0],
                    top: parentElementOffset[1] - baseElementOffset[1]
                });
            }

        } else {
            var $elParentOffset = $elBase.offsetParent(), // 取得最近属性为 relative/absolute/fixed 的 祖先元素
                parentPos = $elParent.offset(),
                parentOffsetPos = $elParentOffset.offset();

            $elBase.css({
                position: 'absolute',
                left: parentElementOffset[0] - baseElementOffset[0] + parentPos.left - parentOffsetPos.left,
                top: parentElementOffset[1] - baseElementOffset[1] + parentPos.top - parentOffsetPos.top
            });
        }

    }

    function now() {
        Date.now || function() {
            return new Date().getTime();
        };
    }


    function insertCSS(rule) {
        if (document.styleSheets && document.styleSheets.length) {
            try {
                document.styleSheets[0].insertRule(rule, 0);
            } catch (ex) {
                // console.warn(ex.message, rule);
            }
        } else {
            var style = document.createElement("style");
            style.innerHTML = rule;
            document.head.appendChild(style);
        }
        return;
    }

    // 修正方位值
    // Examples:
    //   'center' => 'center center'
    //   'top' => 'center top'
    //   'left' => 'left center'
    function posSerialize(posItem) {
        var posItems = $.trim(posItem).split(/\s+/);

        if (!posItems[1]) {
            if (/top|bottom/.test(posItems[0])) {
                posItems[1] = posItems[0];
                posItems[0] = 'center';
            } else {
                posItems[1] = 'center';
            }
        }

        return posItems;
    }

    // 计算像素值
    function posConverter(posItems, width, height) {
        var pos = [0, 0],
            sizes = [width, height],
            posItemsSerialize = posSerialize(posItems);

        for (var i = 0; i < posItemsSerialize.length; i++) {

            if (/\w/.test(posItemsSerialize[i])) {
                posItemsSerialize[i] = posItemsSerialize[i].replace(/(?:top|left)/gi, '0%')
                    .replace(/center/gi, '50%')
                    .replace(/(?:bottom|right)/gi, '100%');
            }

            if (posItemsSerialize[i].indexOf('%') !== -1) {
                posItemsSerialize[i].replace(/(\d+(?:\.\d+)?)%/gi, function(match, p1) {
                    pos[i] += integerNumber(sizes[i] * toNumber(p1) / 100);
                });
            }
        }
        return pos;
    };

    function getElementTop(element){
        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while(current!==null){
            actualTop +=current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    }


    function toNumber(s) {
        return parseFloat(s, 10) || 0;
    }

    function integerNumber(n) {
        return Math.ceil(n, 1);
    }

    return position;

}));


    // define(['jquery'], function(jquery) {

    // return position;
    // })
