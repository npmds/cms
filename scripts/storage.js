$.storage = function(key,value,expires) {
    var Storage = function(){
        try {
            localStorage.setItem('storage','');
            localStorage.removeItem('storage');
            return localStorage;
        }
        catch(e) { // 浏览器隐私模式下，例如iphone的Safari默认情况下，localstorage无法使用，所以使用cookie来代替
            var cookies = document.cookie.split(";");
            return {
                length : function(){
                    return cookies.length;
                }(),
                key : function(i){
                    var parts = cookies[i].split('=');
                    var name = decodeURIComponent(parts.shift());
                    return name;
                },
                getItem : function(key) {
                    return $.cookie(key);
                },
                setItem : function(key,value) {
                    $.cookie(key,value,{expires:expires || 365*24*3600});
                },
                removeItem : function(key) {
                    $.cookie(key,null);
                },
                clear : function() {
                    $.cookie(null);
                }
            };
        }
    }();

    var data = {},time = parseInt((new Date()).getTime() / 1000);
    // 获取全部数据
    if(key === undefined) {
        var k;
        for(var i = 0;i < Storage.length;i ++) {
            k = Storage.key(i);
            value = $.kv(k);
            if(!value) continue;
            data[k] = value;
        }
        return data;
    }
    // clear
    else if(key === null) {
        Storage.clear();
    }
    // read
    else if(value === undefined) {
        data = Storage.getItem(key);
        if(!data) return false;

        data = JSON.parse(data);
        if(data.expires && time > data.expires) { // 如果过期
            $.kv(key,null);
            return false;
        }
        data = data.value;
        return data;
    }
    // delete
    else if(value === null) {
        Storage.removeItem(key);
    }
    // set:add or update
    else {
        data = {
            time: time,
            expires: expires ? time + expires : 0,
            value: value
        };
        data = JSON.stringify(data);

        Storage.setItem(key,data);
    }
}

//var values = $.storage(); // 获取全部数据
//$.storage(null); // 清空全部数据
//var value = $.storage('name'); // 获取键名为name的值
//$.storage('name',null); // 删除键名name的值
//$.storage('name','value'); // 添加或设置值
//$.storage('name','value',3600); // 在设置值的时候，给一个生命周期值