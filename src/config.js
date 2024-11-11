
const Config = {
    items: {
        "split_mode": {
            "title": "拆断方式",
            getTitle: function (){
                return `${Config.items.split_mode.title}: [${Config.items.split_mode.value ? '开' : '关'}]`
            },
            "desc": "是否允许使用所有符号进行拆分",
            "search":"cdfs,chaiduanfangshi,cf,chaifen",
            "value": true
        },
        ""
    },
    dbGet: () => {},
    dbPut: () => {},
    /**
     * 数据库能力
     * @param get
     * @param put
     */
    db: function (get, put) {
        Config.dbGet = get;
        Config.dbPut = put;
    },
    getList: function (search) {
        let list = [];

        for (const name in Config.items) {
            const item = Config.items[name];

            if (!search || name.indexOf(search) >= 0 || item.title.indexOf(search) >= 0 || item.desc.indexOf(search) >= 0) {
                list.push({
                    name: name,
                    title: item.getTitle(),
                    description: item.desc,
                    value: item.value,
                })
            }
        }

        return list;
    },
    set: function (key, value) {
        Config.items[key].value = value;
    },
    get: function (key) {
        return Config.items[key].value;
    }
}


module.exports = Config;