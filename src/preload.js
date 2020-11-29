const VarConv = require('./var-conv.js');

function getSetList(var_name, searchWord, not_loop) {
    let var_conv = new VarConv(var_name || searchWord || ''),
        list = [];
    searchWord = searchWord || false;
    not_loop = not_loop || false;

    for (let name in var_conv.maps) {
        let full_search = var_conv.maps[name].search + var_conv.maps[name].title,
            sort = 255;
        // 检查搜索关键词
        if (!searchWord || (sort = full_search.indexOf(searchWord)) >= 0) {
            console.log(searchWord, full_search, sort)
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
    return list.sort(function (a, b) { return a.sort - b.sort });
}

window.exports = {
    "to": {
        mode: "list",
        args: {
            // 进入插件时调用（可选）
            enter: (action, callbackSetList) => {
                callbackSetList(getSetList(action.payload))
            },
            // 子输入框内容变化时被调用 可选 (未设置则无搜索)
            search: (action, searchWord, callbackSetList) => {
                callbackSetList(getSetList(action.payload, searchWord))
            },
            // 用户选择列表中某个条目时被调用
            select: (action, itemData, callbackSetList) => {
                enterText(itemData.title)
            },
            // 子输入框为空时的占位符，默认为字符串"搜索"
            placeholder: "类型"
        }
    }
}

function enterText(text) {
    // 复制到剪贴板
    utools.copyText(text)

    utools.hideMainWindow();
    utools.setSubInputValue('');
    utools.outPlugin();

    // 区分系统 触发粘贴键
    if (utools.isMacOs()) {
        utools.simulateKeyboardTap('v', 'command')
    } else {
        utools.simulateKeyboardTap('v', 'ctrl')
    }
}