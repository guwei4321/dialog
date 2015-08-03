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
        this._instance = false;
        this.config = $.extend({}, {
            hasMask: true, // 是否显示遮罩层
            mask: null, // 遮罩层
            maskStyle: {
                //  css控制遮罩
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
                '{{# if(d.title) { }}' +
                '<div class="ui-dialog-title">{{d.title}}</div>' +
                '{{#} }}' +
                '{{# if(d.closeBtn) { }}' +
                '<div class="ui-dialog-close"><a class="ui-icon-dialog-close" href="javascript:;" title="关闭">X</a></div>' +
                '{{#} }}' +
                '</div>' +
                '{{#} }}',
            tplContent: '{{# if(d.content) { }}' +
                '<div class="ui-dialog-body">{{d.content}}</div>' +
                '{{#} }}',
            tplFooter: '{{# if(d.footer) { }}' +
                '<div class="ui-dialog-footer">{{d.footer}}</div>' +
                '{{#} }}'
        }, config);
        // 静态方法
        $.extend(this, {
            alert: function(config) {
                var _this = this,
                    _timer = null;

                _this.config = $.extend(_this.config, {
                    isFixed: true,
                    closeBtn: false,
                    title: '提示',
                    content: '内容',
                    footer: '确定',
                    classWrap: 'ui-dialog-alert',
                    tplFooter: '<div class="ui-dialog-footer"><span>{{d.footer}}</span></div>'
                }, config);

                _this.setup();
                _this.$wrap.addClass('scale');
                _timer = setTimeout(function() {
                    _animateFn('animate-out', 'animate-in');
                    clearTimeout(_timer);
                }, 100);

                _this.$wrap
                    .on('tap', 'span:first-child:last-child', function() {
                        $(this).addClass('active-state');
                        _animateFn('animate-in', 'animate-out');
                        _timer = setTimeout(function() {
                            _this.destory();
                            _this.$wrap.off('tap');
                            _this.$wrap.trigger('close');
                            clearTimeout(_timer);
                        }, 400);
                    })

                function _animateFn(animateIn, animateOut) {
                    _this.$wrap.removeClass(animateIn).addClass(animateOut);
                    _this.$mask.removeClass(animateIn).addClass(animateOut);
                }
            },
            confrim: function(config) {
                var _this = this,
                    _timer = null;

                _this.config = $.extend(_this.config, {
                    isFixed: true,
                    closeBtn: false,
                    title: '提示',
                    content: '内容',
                    footer: ['确定', '取消'],
                    classWrap: 'ui-dialog-confrim',
                    tplFooter: '<div class="ui-dialog-footer">{{# for(var i = 0; i < d.footer.length; i++){ }}' +
                        '<span>{{d.footer[i]}}</span>' +
                        '{{#} }}</div>'
                }, config);

                _this.setup();
                _this.$wrap.addClass('scale');
                _timer = setTimeout(function() {
                    _animateFn('animate-out', 'animate-in');
                    clearTimeout(_timer);
                }, 100);

                _this.$wrap
                    .on('tap', 'span:first-child', function() {
                        $(this).addClass('active-state');
                        _animateFn('animate-in', 'animate-out');

                        _timer = setTimeout(function() {
                            _this.destory();
                            _this.$wrap.off('tap');
                            _this.$wrap.trigger('closeLeft');
                            clearTimeout(_timer);
                        }, 400);
                    })
                    .on('tap', 'span:last-child', function() {
                        $(this).addClass('active-state');
                        _animateFn('animate-in', 'animate-out');

                        _timer = setTimeout(function() {
                            _this.destory();
                            _this.$wrap.off('tap');
                            _this.$wrap.trigger('closeRight');
                            clearTimeout(_timer);
                        }, 400);
                    })

                function _animateFn(animateIn, animateOut) {
                    _this.$wrap.removeClass(animateIn).addClass(animateOut);
                    _this.$mask.removeClass(animateIn).addClass(animateOut);
                }
            },
            popover: function(config, duration) {
                var _this = this,
                    _timer = null,
                    _duration = duration || 2100;

                _this.config = $.extend(_this.config, {
                    isFixed: true,
                    closeBtn: false,
                    content: '成功',
                    maskStyle: {
                        backgroundColor: 'rgba(0,0,0,0)'
                    },
                    classWrap: 'ui-dialog-popover'
                }, config);

                _this.setup();

                _timer = setTimeout(function() {
                    _this.$wrap.addClass('animate-in');
                    clearTimeout(_timer);
                }, 100);

                _this.$wrap.animate({opacity: 0}, 500, 'ease-out', function(){
                    _this.destory();
                }, _duration);

            }
        });
    }


    // 动态方法
    $.extend(Dialog.prototype, {
        /**
         * [setup 初始化组件]
         * @param  {[Object]} data [需要编译的数据]
         */
        setup: function(data) {
            this._render(data);
            if (this._instance === false) {
                this._appendModel();
            }
            this.show();
            this._instance = true;
        },
        /**
         * [destory 显示组件]
         */
        show: function() {
            var _config = this.config;

            _config.hasMask && this.$mask.css('display', 'block');
            this.$wrap.show('display', 'block');

            if (this._instance === false) {
                this._setPosition();
            }

            $('html').addClass('alpha');
        },
        /**
         * [refresh 父容器大小发生变化时，可以外部调用以修正。]
         * @return {[type]} [description]
         */
        refresh: function() {

        },
        /**
         * [destory 隐藏组件]
         */
        hide: function() {
            var _config = this.config;

            $('html').removeClass('alpha');
            _config.hasMask && this.$mask.css('display', 'none');
            this.$wrap.css('display', 'none');
        },
        /**
         * [destory 销毁组件]
         */
        destory: function() {
            var _config = this.config;

            $('html').removeClass('alpha');
            _config.hasMask && this.$mask.remove();
            this.$wrap.remove();
            this._instance = false;
        },
        /**
         * [_render 重编译模板数据]
         * @param  {[Object]} _data [需要编译的数据]
         */
        _render: function(_data) {
            var _config = this.config,
                _mask = _config.tplMask,
                _data = this._update(_data),
                _content = tpl(_config.tplHeader + _config.tplContent + _config.tplFooter).render(_data);

            if (this._instance === false) {
                this.$wrap = $(tpl(_config.tplWrap).render({
                    _content: _content
                }));
                if (_config.hasMask) {
                    this.$mask = $(_mask);
                }
            } else {
                this.$wrap.html(_content);
            }
        },
        /**
         * [_appendModel 插入组件到父容器]
         */
        _appendModel: function() {
            var _config = this.config;
            if (this.$mask) {
                this.$mask.appendTo(_config.parentNode);
                mask({
                    element: this.$mask,
                    maskStyle: _config.maskStyle
                });
            }
            this.$wrap.addClass(_config.classWrap).appendTo(_config.parentNode);
        },
        /**
         * [_setPosition 定位]
         */
        _setPosition: function() {
            var _config = this.config;
            if (_config.isFixed) {
                position({
                    baseElement: this.$wrap,
                    baseAlign: _config.align.baseAlign,
                    parentAlign: _config.align.parentAlign,
                    isSticky: true
                });
            } else {
                position({
                    baseElement: this.$wrap,
                    baseAlign: _config.align.baseAlign,
                    parentAlign: _config.align.parentAlign
                });
            }
        },
        /**
         * [_update 更新数据]
         * @param  {[Object]} _data [弹窗配置]
         * @return {[Object]}       [返回弹窗配置]
         */
        _update: function(_data) {
            var _data = $.extend(this.config, _data);
            return _data;
        }
    });

    return Dialog;

}));
