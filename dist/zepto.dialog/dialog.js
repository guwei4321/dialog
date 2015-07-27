(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['zepto', 'simpletpl', 'position', 'mask'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory(require('zepto'), require('simpletpl'), require('position'), require('mask'));
    } else {
        // 浏览器全局变量(root 即 window)
        root.returnExports = factory(root.Zepto, root.tpl, root.position, root.mask);
    }
}(this, function(zepto, tpl, position, mask) {
    function Dialog(config) {
        this.config = $.extend({}, {
            hasMask: true, // 是否显示遮罩层
            mask: null, // 遮罩层
            maskStyle: {
                backgroundColor: '#000',
                opacity: 0.3
            },
            closeBtn: true, // 左上角关闭按钮
            classWrap: '', // 弹窗样式类名
            width: 'auto', // 弹窗宽度
            height: 'auto', // 弹窗高度
            parentNode: $('body'), // 插入区域
            isFixed: false, // 是否固定定位
            align: {
                baseAlign: '50% 50%',
                parentAlign: '50% 50%'
            },
            title: '',
            content: '',
            footer: '',
            tplMask: '<div class="ui-mask"></div>',
            tplWrap: '<div class="ui-dialog">{{d._content}}</div>',
            tplHeader: '{{# if(d.closeBtn || d.title ) { }}' +
                        '<div class="ui-dialog-header">' +
                            '{{# if(d.title) { }}'+
                                '<div class="ui-dialog-title">{{d.title}}</div>' +
                            '{{#} }}' +
                            '{{# if(d.closeBtn) { }}' +
                                '<div class="ui-dialog-close"><a class="ui-icon-dialog-close" href="javascript:;" title="关闭">X</a></div>' +
                            '{{#} }}' +
                        '</div>' +
                        '{{#} }}',
            tplContent: '{{# if(d.content) { }}'+
                            '<div class="ui-dialog-body">{{d.content}}</div>' +
                        '{{#} }}',
            tplFooter: '{{# if(d.footer) { }}'+
                            '<div class="ui-dialog-footer">{{d.footer}}</div>' +
                        '{{#} }}'
        }, config);
    }
    $.extend(Dialog.prototype, {
        setup: function() {

            var _config = this.config,
                btns = [],
                _mask = _config.tplMask,
                _content = tpl(_config.tplHeader+_config.tplContent+_config.tplFooter).render(_config),
                _wrap = tpl(_config.tplWrap).render({_content:_content});

            this.$mask = $(_mask);
            this.$wrap = $(_wrap);

            _config.classWrap && $(_wrap).addClass(_config.classWrap);

            if (_config.hasMask) {
                this.$mask = $(_mask);
                this.$mask.appendTo(_config.parentNode);
            }

            this.$wrap.appendTo(_config.parentNode)

            _config.hasMask && mask({element:this.$mask,maskStyle:_config.maskStyle});

            this.show();

        },
        show: function() {
            var _config = this.config;

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

            $('html').addClass('alpha');
            _config.hasMask && this.$mask.css('display', 'block');
            this.$wrap.css('display', 'block');
        },
        hide: function() {
            var _config = this.config;

            $('html').removeClass('alpha');
            _config.hasMask && this.$mask.css('display', 'none');
            this.$wrap.css('display', 'none');
        },
        destory: function() {
            var _config = this.config;

            $('html').removeClass('alpha');
            _config.hasMask && this.$mask.remove();
            this.$wrap.remove();
        }
    })
    return Dialog;

}));
