define(['jquery'], function(jquery) {


    var win = $(window),
        doc = $(document),
        ua = (window.navigator.userAgent || "").toLowerCase(),
        isIE = ua.indexOf("msie") !== -1,
        isIE6 = ua.indexOf("msie 6") !== -1;

    /**
     * [Position 定位]
     * @param {[type]} opts [description]
     */
    function Position(opts) {
        opts = $.extend({}, {
            baseAlign: '50% 50%', //
            parentAlign: '50% 50%', //
            isSticky: false,
            parentElement: document.body, // 父元素，若为空，则为 body
            baseElement: null // 需要定位的元素
        }, opts);

        var $baseElement = $(opts.baseElement),
            $parentElement = opts.isSticky === true ? win : $(opts.parentElement),
            $parentPosition = $baseElement.offsetParent(),
            parentElementPos = $parentElement.offset(),
            offsetParentPos = $parentPosition.offset(),
            parentElementOffset = posConverter(posSerialize(opts.parentAlign), $parentElement.outerWidth(), $parentElement.outerHeight()),
            baseElementOffset = posConverter(posSerialize(opts.baseAlign), $baseElement.outerWidth(), $baseElement.outerHeight())


        if (opts.isSticky === true) {

            if (isIE6) {

                _reset();
                win.on('scroll resize', debounce(function() {
                    var _timer = setTimeout(function(){
                        _reset();
                        clearTimeout(_timer);
                    }, 100);
                }))
                function _reset (){
                    $baseElement.css({
                        position: 'absolute',
                        left: doc.scrollLeft() + parentElementOffset[0] - baseElementOffset[0],
                        top: doc.scrollTop() +  parentElementOffset[1] - baseElementOffset[1]
                    });
                }
            } else {
                $baseElement.css({
                    position: 'fixed',
                    left: parentElementOffset[0] - baseElementOffset[0],
                    top: parentElementOffset[1] - baseElementOffset[1]
                });
            }

        } else {
            $baseElement.css({
                position: 'absolute',
                left: parentElementOffset[0] - baseElementOffset[0] + parentElementPos.left - offsetParentPos.left,
                top: parentElementOffset[1] - baseElementOffset[1] + parentElementPos.top - offsetParentPos.top
            });
        }

    }

    function now(){
        Date.now || function() {
            return new Date().getTime();
        };
    }


    function insertCSS (rule) {
        if (document.styleSheets && document.styleSheets.length) {
            try {
             document.styleSheets[0].insertRule(rule, 0);
            }
            catch (ex) {
                // console.warn(ex.message, rule);
            }
        }
        else {
            var style = document.createElement("style");
            style.innerHTML = rule;
            document.head.appendChild(style);
        }
        return;
    }

    // 高频率防抖
    function debounce(func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function() {
            var last = now() - timestamp;

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };

        return function() {
            context = this;
            args = arguments;
            timestamp = now();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
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
            sizes = [width, height];

        for (var i = 0; i < posItems.length; i++) {

            if (/\w/.test(posItems[i])) {
                posItems[i] = posItems[i].replace(/(?:top|left)/gi, '0%')
                    .replace(/center/gi, '50%')
                    .replace(/(?:bottom|right)/gi, '100%');
            }

            if (posItems[i].indexOf('%') !== -1) {
                posItems[i].replace(/(\d+(?:\.\d+)?)%/gi, function(match, p1) {
                    pos[i] += integerNumber(sizes[i] * toNumber(p1) / 100);
                });
            }
        }
        return pos;
    };

    function toNumber(s) {
        return parseFloat(s, 10) || 0;
    }

    function integerNumber(n) {
        return Math.ceil(n, 1);
    }

    return Position;

})
