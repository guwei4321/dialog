(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'simpletpl', 'position', 'mask'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('jquery'), require('simpletpl'), require('position'), require('mask'));
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory(root.jQuery, root.tpl, root.position, root.mask);
    }
}(this, function(jquery, tpl, position, mask) {
    function Dialog(config) {
        this.config = $.extend({}, {
            title: '', // 弹窗标题
            body: '', // 弹窗主体
            footer: '', // 弹窗底部
            closeBtn: true, // 左上角关闭按钮
            hasMask: true, // 是否显示遮罩层
            mask: null, // 遮罩层
            maskClick: true, // 遮罩层是否可点击
            maskStyle: {
                backgroundColor: '#000',
                opacity: 0.3
            },
            wrap: null, // 弹窗主体外层节点
            classWrap: 'ui-dialog', // 弹窗样式类名
            width: 'auto', // 弹窗宽度
            height: 'auto', // 弹窗高度
            buttons: null, // 回调函数
            container: $('body'), // 插入区域
            isFixed: false, // 是否固定定位
            align: {
                baseAlign: '50% 50%',
                parentAlign: '50% 50%'
            },
            tpl: {
                mask: '<div class="ui-mask"></div>',
                content: '<div class="ui-dialog-header">' +
                    '<div class="ui-dialog-title">{{d.title}}</div>' +
                    '{{# if(d.closeBtn) { }}' +
                    '<div class="ui-dialog-close"><a class="ui-icon-dialog-close" href="javascript:;" title="关闭">X</a></div>' +
                    '{{#} }}' +
                    '</div>' +
                    '<div class="ui-dialog-body">{{d.body}}</div>' +
                    '<div class="ui-dialog-footer">{{d.footer}}</div>'
            }
        }, config);
    }
    $.extend(Dialog.prototype, {
        setup: function() {

            var _config = this.config,
                btns = [],
                _tpl = _config.tpl,
                _mask = _tpl.mask,
                _content = tpl(_tpl.content).render(_config);

            this.$mask = _mask;
            this.$wrap = $('<div class="' + _config.classWrap + '"></div>');

            if (_config.hasMask) {
                this.$mask = $(_mask);
                this.$mask.appendTo(_config.container);
            }

            $(_content).appendTo(this.$wrap.appendTo(_config.container));

            mask({element:this.$mask,maskStyle:_config.maskStyle});


            // _config.buttons && $.each(_config.buttons, function(key){
            //     btns.push({
            //         index: ++i,
            //         text: key,
            //         key: key
            //     });
            // });


            if (_config.isFixed) {
                position({
                    baseElement: this.$wrap,
                    baseAlign: _config.align.baseAlign, //
                    parentAlign: _config.align.parentAlign, //
                    isSticky: true
                });
            } else {
                position({
                    baseElement: this.$wrap,
                    baseAlign: _config.align.baseAlign, //
                    parentAlign: _config.align.parentAlign //
                });
            }

        },
        show: function() {
            var _config = this.config;
            _config.hasMask && this.$mask.css('display', 'block');
            this.$wrap.css('display', 'block');
        },
        hide: function() {
            var _config = this.config;

            _config.hasMask && this.$mask.css('display', 'none');
            this.$wrap.css('display', 'none');
        },
        destory: function() {

        }
    })
    return Dialog;

}));
