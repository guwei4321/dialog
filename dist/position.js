define(['jquery'], function(jquery) {

    /**
     * [Position 定位]
     * @param {[type]} opts [description]
     */
    function Position(opts){
        opts = $.extend({}, {
            baseAlign: '50% 50%', //
            parentAlign: '50% 50%', //
            parentElement: document.body, // 父元素，若为空，则为 body
            baseElement: null // 需要定位的元素
        }, opts);

        var $baseElement = $(opts.baseElement),
            $parentElement = $(opts.parentElement),
            $parentPosition = $baseElement.offsetParent(),
            parentElementPos = $parentElement.offset(),
            offsetParentPos = $parentPosition.offset(),
            parentElementOffset = posConverter(posSerialize(opts.parentAlign), $parentElement.outerWidth(), $parentElement.outerHeight()),
            baseElementOffset = posConverter(posSerialize(opts.baseAlign), $baseElement.outerWidth(), $baseElement.outerHeight());

        $baseElement.css({
            position: 'absolute',
            left: parentElementOffset[0] - baseElementOffset[0] + parentElementPos.left - offsetParentPos.left,
            top: parentElementOffset[1] - baseElementOffset[1] + parentElementPos.top - offsetParentPos.top
        });
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

            if ( posItems[i].indexOf('%') !== -1 ) {
                posItems[i].replace(/(\d+(?:\.\d+)?)%/gi, function(match, p1) {
                    pos[i] += integerNumber(sizes[i] * toNumber(p1) / 100);
                });
            }
        }
        return pos;
    };

    function toNumber(s){
        return parseFloat(s, 10) || 0;
    }

    function integerNumber (n){
        return Math.ceil(n, 1);
    }

    return Position;

})
