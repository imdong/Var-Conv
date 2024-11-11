const config = require('./config.js');

/**
 * 解析字符串
 * 
 * @param str 原始字符串
 */
function parseString(str) {
    let var_split = [];
    
    // 拆分方式
    if (config.get('split_mode')) {
        // 所有特殊符号都用来拆分
        var_split = str.split(/[^a-zA-Z0-9]/);
    } else {
        // 识别到第一个特殊符号进行拆分
        ['-', '_', ' ', '\\', '/'].forEach((splitter) => {
            if (str.indexOf(splitter) > 0) {
                var_split = str.split(splitter);
            }
        });
    }

    // 不行就 正则表达式 大小写拆
    if (var_split.length <= 0) {
        var_split = var_name.match(/(^[A-Z]|^|[A-Z])([a-z]+)?/g);
    }

    this.var_split = var_split
        // 删除空字段
        .filter(item => item !== null && item !== undefined && item !== "")
        // 全部转小写
        .join('\x00').toLocaleLowerCase().split('\x00');
}



// 解析对象
let VarConv = function (var_name) {
    // 保留原始字符串
    this.origin_var_name = var_name;

    // 默认连接字符
    this.separator = '-';

    // 尝试拆分
    let var_split = [];


}

/**
 *
 * @param {string} var_name
 * @param {string=} searchWord
 * @param {string=}not_loop 为了避免递归调用
 * @returns {*|*[]}
 */
VarConv.getSetList = function (var_name, searchWord, not_loop) {
    let var_conv = new VarConv(var_name || searchWord || ''),
        list = [];
    searchWord = searchWord || false;
    not_loop = not_loop || false;

    for (let name in var_conv.maps) {
        let full_search = var_conv.maps[name].search + var_conv.maps[name].title,
            sort = 255;
        // 检查搜索关键词
        if (!searchWord || (sort = full_search.indexOf(searchWord.toLocaleLowerCase())) >= 0) {
            list.push({
                title: var_conv['to' + name](),
                description: var_conv.maps[name].title,
                sort: sort
            })
        }
    }

    // 没有合适的匹配 就 把当前输入作为变量名 重新处理
    if (list.length <= 0 && !not_loop) {
        return getSetList(searchWord, false, true);
    }

    // 排序
    return list.sort(function (a, b) {
        return a.sort - b.sort
    });
}


VarConv.prototype.maps = {
    UpperCamelCase: {title: '大驼峰写法 (帕斯卡命名法)', search: 'dtf,datuofeng,psk,pasika,ucc,uppercamelcase'},
    CamelCase: {title: '小驼峰写法 (驼峰命名法)', search: 'xtf,xiaotuofeng,cc,camelcase'},
    Snake: {title: '蛇形写法 (下划线命名法)', search: 'sx,shexing,xhx,xiahuaxian,snake,_'},
    Hyphen: {title: '连字符写法 (中划线、烤串命名法)', search: 'l,h,lzf,lianzifu,zhx,zhonghuaxian,hyphen,-'},
    Const: {title: '常量名', search: 'clm,changliangming,const'},
    LocaleLowerCase: {title: '全小写', search: 'qxx,quanxiaoxie,llc,localelowercase'},
    LocaleUpperCase: {title: '全大写', search: 'qdx,quandaxie,luc,localeuppercase'},
    SpaceUpperCase: {title: '空格 全大写', search: ' dx, qdx,kdx,kqd,kgqdx,kongquandaxie,konggequandaxie'},
    SpaceLowerCase: {title: '空格 全小写', search: ' xx, qxx,kxx,kqx,kgqxx,kongquanxiao,konggequanxiaoxie'},
    SpaceUpperCamelCase: {title: '空格 大驼峰', search: ' dtf,kdtf,kgdtf,kongdatuofeng,konggedatuofeng'},
    SpaceCamelCase: {title: '空格 小驼峰', search: ' xtf,kxtf,kongxiaotuofeng,konggexiaotuofeng'},
    TitleCase: {title: '标题格式', search: 'btgs,biaotigeshi'},
}

// 大驼峰写法 (帕斯卡命名法) UserName
VarConv.prototype.toUpperCamelCase = function (separator) {
    let vars = [];
    this.var_split.forEach(item => {
        item = item.replace(/(^[a-z])/, (match) => {
            return match.toLocaleUpperCase()
        });
        vars.push(item)
    });
    return vars.join(separator || '');
}

// 小驼峰写法 (驼峰命名法) userName
VarConv.prototype.toCamelCase = function (separator) {
    let vars = [];
    this.var_split.forEach((item, index) => {
        if (index != 0) {
            item = item.replace(/(^[a-z])/, (match) => {
                return match.toLocaleUpperCase()
            });
        }
        vars.push(item)
    });
    return vars.join(separator || '');
}

// 蛇形写法 (下划线) user_name
VarConv.prototype.toSnake = function () {
    return this.var_split.join('_');
}

// 连字符 user-name
VarConv.prototype.toHyphen = function () {
    return this.var_split.join('-');
}

// 常量写法 (全大写下划线) USER_NAME
VarConv.prototype.toConst = function () {
    return this.var_split.join('_').toLocaleUpperCase();
}

// 全小写
VarConv.prototype.toLocaleLowerCase = function () {
    return this.origin_var_name.toLocaleLowerCase();
}

// 全大写
VarConv.prototype.toLocaleUpperCase = function () {
    return this.origin_var_name.toLocaleUpperCase();
}

// 空格 全小写
VarConv.prototype.toSpaceLowerCase = function () {
    return this.var_split.join(' ').toLocaleLowerCase();
}
// 空格 全大写
VarConv.prototype.toSpaceUpperCase = function () {
    return this.var_split.join(' ').toLocaleUpperCase();
}
// 空格 大驼峰
VarConv.prototype.toSpaceUpperCamelCase = function () {
    return this.toUpperCamelCase(' ');
}

// 空格 小驼峰写法
VarConv.prototype.toSpaceCamelCase = function () {
    return this.toCamelCase(' ');
}

// 标题格式 EXPLORING THE CONCEPT OF SEISMIC RESILIENCE FOR ACUTE CARE FACILITIES
// Exploring the Concept of Seismic Resilience for Acute Care Facilities
// Exploring the Concept of Seismic Resilience for Acute Care Facilities
const smallWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'with', 'in', 'of'];
VarConv.prototype.toTitleCase = function () {
    return this.var_split.map((word, index) => {
        console.log(word, index)
        if (index === 0 || !smallWords.includes(word)) {
            word = word.replace(/(^[a-z])/, (match) => {
                return match.toLocaleUpperCase()
            });
        }

        console.log(word)
        return word;
    }).join(' ');
}

module.exports = VarConv;