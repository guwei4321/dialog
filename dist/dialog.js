define(['jquery', 'simpletpl', 'position'],function(jquery, tpl, Position) {
    function Dialog(config) {
        this.config = $.extend({}, {
            title: '', // 弹窗标题
            body: '', // 弹窗主体
            footer: '', // 弹窗底部
            closeBtn: true, // 左上角关闭按钮
            hasMask: true, // 是否显示遮罩层
            mask: null, // 遮罩层
            maskClick: true, // 遮罩层是否可点击
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
                content: '<div class="ui-dialog-header">'+
                            '<div class="ui-dialog-title">{{d.title}}</div>'+
                            '{{# if(d.closeBtn) { }}'+
                            '<div class="ui-dialog-close"><a class="ui-icon-dialog-close" href="javascript:;" title="关闭">X</a></div>'+
                            '{{#} }}'+
                        '</div>'+
                        '<div class="ui-dialog-body">{{d.body}}</div>'+
                        '<div class="ui-dialog-footer">{{d.footer}}</div>'
            }
        }, config);
    }
    $.extend(Dialog.prototype, {
        create: function(){

            var _config = this.config,
                _tpl = _config.tpl,
                _mask = _tpl.mask,
                _content = tpl(_tpl.content).render(_config);


            if (_config.hasMask){
                _config.mask = $(_mask);
                _config.mask.appendTo(_config.container);
            }

            _config.wrap = $('<div class="' + _config.classWrap + '"></div>');
            $(_content).appendTo(_config.wrap.appendTo(_config.container));

            if ( _config.isFixed ) {
                Position({
                    baseElement: _config.wrap,
                    baseAlign: _config.align.baseAlign, //
                    parentAlign: _config.align.parentAlign, //
                    isSticky: true
                });
            } else {
                Position({
                    baseElement: _config.wrap,
                    baseAlign: _config.align.baseAlign, //
                    parentAlign: _config.align.parentAlign //
                });
            }

        },
        show: function(){
            var _config = this.config;
            _config.hasMask &&  _config.mask.css('display','block');
            _config.wrap.css('display','block');
        },
        hide: function(){
            var _config = this.config;

            _config.hasMask &&  _config.mask.css('display','none');
            _config.wrap.css('display','none');
        },
        destory: function(){

        }
    })
    return Dialog;
})