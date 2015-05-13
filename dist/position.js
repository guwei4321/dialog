define(['jquery'], function(jquery) {

    // Default settings.
    var defaults = {
        my: 'center',
        at: 'center',
        of: null
    };



    // Normalize the my/at option value.
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

    function getOffsetParent (){

    }

    function Position(opts){
        opts = $.extend({}, {
            of: document.body
        }, opts);
        var $my = $(opts.son);
        var $at = $(opts.of);
        var $offsetParent = $my.offsetParent();
        var myW = $my.outerWidth();
        var myH = $my.outerHeight();
        var atW = $at.outerWidth();
        var atH = $at.outerHeight();
        var atPos = $at.offset();
        var offsetParentPos = $offsetParent.offset();
        var atOffset = posConverter(posSerialize(opts.at), atW, atH);
        var myOffset = posConverter(posSerialize(opts.my), myW, myH);

        console.log( offsetParentPos )
        console.log( atPos )
        $my.css({
            position: 'absolute',
            left: atOffset[0] - myOffset[0] + atPos.left - offsetParentPos.left,
            top: atOffset[1] - myOffset[1] + atPos.top - offsetParentPos.top
        });
    }

    return Position;

})
