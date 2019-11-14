var XhrFilter = (function () {

  function XhrFilter() {
    this.plugins = [];
    this.init();
  }

  XhrFilter.prototype.use = function (plugin) {
    var context = this;
    context
      .plugins
      .push(plugin)
  }

  XhrFilter.prototype.init = function () {

    var context = this;
    var conditions = Object.assign({}, {
      pendingRequestUrl: {},
      pendingData: {},
      xhrTime: {},
      url: ""
    })

    var ajaxPreFilter = function (funs) {
      window.soucexhr = window.soucexhr || window.XMLHttpRequest;
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
          var args = []
            .slice
            .call(arguments);
          // 钩子方法返回 true，则不执行后续的原始xhr方法
          if (funs[fun] && funs[fun].call(this, args, this.xhr)) {
            return;
          }
          return this
            .xhr[fun]
            .apply(this.xhr, args);
        }
      }

      function getProperty(attr) {
        return function () {
          return this.hasOwnProperty(attr + '_')
            ? this[attr + "_"]
            : this.xhr[attr]
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
            xhr[attr] = function () {
              funs[attr](that) || f.apply(xhr, arguments)
            }
          } else {
            xhr[attr] = f;
          }
        }
      }

      return window.soucexhr

    }

    ajaxPreFilter({

      open: function (arg, xhr) {
        conditions.url = arg[1];
      },

      onload: function (xhr) {
        var url = conditions.url;
        conditions.pendingRequestUrl[url] = null;
        conditions.pendingData[url] = null;
      },

      send: function (arg, xhr) {
        try {
          // 运行钩子，增加自定义逻辑
          for (var i = 0; i < context.plugins.length; i++) {
            var result = context
              .plugins[i]
              .call(this, context, arg, xhr, conditions);
            if (result) {
              return result
            }
          }
        } catch (error) {
          console.error(error);
        }

      }

    })
  }

  return XhrFilter

})()

export {XhrFilter}