!function(){
    var ajaxPreFilter = function (funs) {

        window.soucexhr = window.soucexhr || window.XMLHttpRequest;

        window.pendingRequestUrl = {};

        window.pendingData = {};

        window.xhrTime = {};

        //代理xhr对象
        window.XMLHttpRequest = function () {
            this.xhr = new window.soucexhr();
            for (var attr in this.xhr) {
                var type = typeof this.xhr[attr];
                if (type === 'function') {
                    this[attr] = preFilter(attr)
                } else {
                    Object.defineProperty(this, attr, {
                        get: getProperty(attr),
                        set: setProperty(attr)
                    })
                }

            }
        }

        //拦截xhr方法，添加钩子方法
        function preFilter(fun) {
            return function () {
                var args = [].slice.call(arguments);
                // 钩子方法返回 true，则不执行后续的原始xhr方法
                if (funs[fun] && funs[fun].call(this, args, this.xhr)) {
                    return;
                }
                return this.xhr[fun].apply(this.xhr, args);
            }
        }


        function getProperty(attr) {
            return function () {
                return this.hasOwnProperty(attr + '_') ? this[attr + "_"] : this.xhr[attr]
            }
        }

        function setProperty(attr) {
            return function (f) {
                var xhr = this.xhr;
                var that = this;
                if (attr.indexOf("on") !== 0) {
                    this[attr + "_"] = f;
                    return
                }
                if (funs[attr]) {
                    xhr[attr] = function(){
                        funs[attr](that) || f.apply(xhr, arguments)
                    }
                } else {
                    xhr[attr] = f;
                }
            }
        }

        return window.soucexhr

    }

    var unPreFilter = function () {
        if (window.soucexhr) {
            XMLHttpRequest = window.soucexhr;
        }
        window.soucexhr = undefined;
    }

    // 判断数据是否为空
    function isNotEmpty(value) {
        if(value == null) {
            return false
        }
        if(typeof value == "object") {
            return Object.keys(value).length != 0
        }
        return value.length != 0;
    }

    // 判断两个对象的值是否相等
    function isObjectValueEqual(a, b) {
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);
    
        if (aProps.length != bProps.length) {
            return false;
        }
    
        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            if(isObj(a[propName])){
                if(!isObj(b[propName])) return false;
                isObjectValueEqual(a[propName],b[propName])
            }else{
                if (a[propName] !== b[propName]) {
                    return false;
                }
            }
            
        }
        return true;
    }

    function isObj(obj) {
        return Object.prototype.toString.call(obj) == '[object Object]'
    }

    var url = '' , interval = 500;


    ajaxPreFilter({

        open: function (arg, xhr) {
            url = arg[1];
        },

        onload: function (xhr) {
            pendingRequestUrl[url] = null;
            pendingData[url] = null;
        },

        send: function(arg, xhr) {
            var timeNow = Date.now();
            sendData = arg[0];
            if(!xhrTime[url]){
                xhrTime[url] = Date.now();
            }else{
                if(timeNow - xhrTime[url] <= interval){
                    xhrTime[url] = Date.now();
                    return true
                }else{
                    xhrTime[url] = Date.now();
                }
            }

            // 相同url且相同数据请求则取消此次请求
            if(isNotEmpty(sendData)){
                if(!pendingData[url]){
                    pendingData[url] = sendData;
                }else{
                    if(isObjectValueEqual(sendData, pendingData[url]) && pendingRequestUrl[url]){
                        pendingRequestUrl[url].abort()
                    }
                }
            }else{
                if(pendingRequestUrl[url]){
                    pendingRequestUrl[url].abort()
                }else{
                    pendingRequestUrl[url] = xhr
                }
            }
        }

    })

}()
