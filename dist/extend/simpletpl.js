define(function() {

    var config = {
            open: '{{',
            close: '}}'
        },
        tool = {
            exp: function(str) {
                return new RegExp(str, 'g');
            },
            //匹配满足规则内容
            query: function(type, _, __) {
                var types = [
                    '#([\\s\\S])+?',
                    '([^{#}])*?'
                ][type || 0];
                return exp((_ || '') + config.open + types + config.close + (__ || ''));
            },
            error: function(e, tplog){
                var error = 'Laytpl Error：';
                typeof console === 'object' && console.error(error + e + '\n'+ (tplog || ''));
                return error + e;
            }
        },
        exp = tool.exp;

    /**
     * [Tpl 模板引擎]
     * @param {[string]} tpl [description]
     */
    function Tpl(tpl) {
        this.tpl = tpl;
        this.cache_tpl = null;
    };

    Tpl.prototype.render = function(data, callback) {
        var _this = this,
            _html;
        if (!data) return tool.error('no data');
        try {
            if ( this.cache_tpl === null  ) {
                this.cache_tpl = new Function('d', _parse(_this.tpl)); // function 参数字符串，直接编译代码
            }
            _html = this.cache_tpl(data);
            if (!callback) return _html;
            callback(_html);
        } catch (e) {
            delete _this.cache_tpl;
            return tool.error(e, this.tpl);
        }
    };

    /**
     * [_parse  将模板字符串解析成执行字符串]
     * @param  {[string]} tpl  [模板]
     */
    function _parse(tpl) {
        var _open = exp('^' + config.open + '#', ''),
            _close = exp(config.close + '$', '');
        tpl = tpl.replace(exp(config.open+'#'), config.open+'# ')
            .replace(exp(config.close + '}'), '} ' + config.close).replace(/\\/g, '\\\\').replace(/(?="|')/g, '\\')
            .replace(tool.query(), function(str) {
                str = str.replace(_open, '').replace(_close, '');
                return '";' + str.replace(/\\/g, '') + '; view+="';
            }).replace(tool.query(1), function(str) {
                var start = '"+(';
                if (str.replace(/\s/g, '') === config.open + config.close) {
                    return '';
                }
                str = str.replace(exp(config.open + '|' + config.close), '');
                return start + str.replace(/\\/g, '') + ')+"';
            });
        return 'var view = "' + tpl + '";return view;';
    };

    var tpl = function(tpl) {
        return new Tpl(tpl);
    };

    return tpl;

});
