const VarConv = require('./var-conv.js');
const config = require('./config.js');

// 注入获取与保存配置能力
config.db(utools.db)



window.exports = {
    "to": {
        mode: "list",
        args: {
            // 进入插件时调用（可选）
            enter: (action, callbackSetList) => {
                callbackSetList(VarConv.getSetList(action.payload))
            },
            // 子输入框内容变化时被调用 可选 (未设置则无搜索)
            search: (action, searchWord, callbackSetList) => {
                callbackSetList(VarConv.getSetList(action.payload, searchWord))
            },
            // 用户选择列表中某个条目时被调用
            select: (action, itemData, callbackSetList) => {
                enterText(itemData.title)
            },
            // 子输入框为空时的占位符，默认为字符串"搜索"
            placeholder: "目标类型 or 新变量名"
        }
    },
    "form": {
        mode: "list",
        args: {
            // 子输入框内容变化时被调用 可选 (未设置则无搜索)
            search: (action, searchWord, callbackSetList) => {
                callbackSetList(VarConv.getSetList(searchWord))
            },
            // 用户选择列表中某个条目时被调用
            select: (action, itemData, callbackSetList) => {
                enterText(itemData.title)
            },
            // 子输入框为空时的占位符，默认为字符串"搜索"
            placeholder: "输入变量名"
        }
    },
    "setting": {
        mode: "list",
        args: {
            // 进入插件时调用（可选）
            enter: (action, callbackSetList) => {
                callbackSetList(config.getList())
            },
            // 子输入框内容变化时被调用 可选 (未设置则无搜索)
            search: (action, searchWord, callbackSetList) => {
                callbackSetList(config.getList(searchWord))
            },
            // 用户选择列表中某个条目时被调用
            select: (action, itemData, callbackSetList) => {
                // 反转设置
                config.set(itemData.name, !itemData.value)

                // 更新列表
                callbackSetList(config.getList())
            },
        }
    }
}

/**
 * 模拟粘贴文本
 *
 * @param text
 */
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