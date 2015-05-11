define(function() {
    function Dialog(config) {
        this.config = $.extend(true, {
            tilte: null,
            content: null,
            closeBtn: true,
            mask: true,
            width: 'auto',
            height: 'auto',
            maskClick: null,
            callbcakElement: null
        })
    }
    $.extend(Dialog.prototype, {

    })
})