(function () {
  var util = {
    setCookie: function (c_name, value, expiremMinutes) {
      var exdate = new Date();
      exdate.setTime(exdate.getTime() + expiremMinutes * 60 * 1000);
      document.cookie = c_name + "=" + escape(value) + ((expiremMinutes == null) ? "" : ";expires=" + exdate.toGMTString()) + ';path=/';
    },

    // 读取cookie
    getCookie: function (c_name) {
      if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
          c_start = c_start + c_name.length + 1;
          var c_end = document.cookie.indexOf(";", c_start);
          if (c_end == -1)
            c_end = document.cookie.length;
          return unescape(document.cookie.substring(c_start, c_end))
        }
      }
      return ""
    },

    // 删除cookie
    delCookie: function (c_name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = this.getCookie(c_name);
      if (cval != null) {
        document.cookie = c_name + "=" + cval + ";expires=" + exp.toGMTString();
      }
    },

    setSessionSto: function (s_name, s_val) {
      window.sessionStorage.setItem(s_name, s_val);
    },
    getSessionSto: function (s_name) {
      window.sessionStorage.getItem(s_name);
    },
    delSessionSto: function (s_name) {
      window.sessionStorage.setItem(s_name, null)
    },
    getExplore:function(context, color) {
      var Sys = {};
      var ua = navigator.userAgent.toLowerCase();
      var s;
      (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d\.]+)/)) ? Sys.ie = s[1] :
          (s = ua.match(/edge\/([\d\.]+)/)) ? Sys.edge = s[1] :
            (s = ua.match(/firefox\/([\d\.]+)/)) ? Sys.firefox = s[1] :
              (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? Sys.opera = s[1] :
                (s = ua.match(/chrome\/([\d\.]+)/)) ? Sys.chrome = s[1] :
                  (s = ua.match(/version\/([\d\.]+).*safari/)) ? Sys.safari = s[1] : 0;
      // 根据关系进行判断
      var obj = {};
      if (Sys.ie) obj = {Browser: 'IE', version: Sys.ie, cur: 'IE ' + Sys.ie};
      if (Sys.edge) obj = {Browser: 'EDGE', version: Sys.edge, cur: 'EDGE ' + Sys.edge};
      if (Sys.firefox) obj = {Browser: 'Firefox', version: Sys.firefox, cur: 'Firefox ' + Sys.firefox};
      if (Sys.chrome) obj = {Browser: 'Chrome', version: Sys.chrome, cur: 'Chrome ' + Sys.chrome};
      if (Sys.opera) obj = {Browser: 'Opera', version: Sys.opera, cur: 'Opera ' + Sys.opera};
      if (Sys.safari) obj = {Browser: 'Safari', version: Sys.safari, cur: 'Safari ' + Sys.safari};
      if (obj.Browser === 'IE' && Number(obj.version) < 9) {
        var domStr = '<div style="width: 80%;margin: 200px auto;font-size: 20px;' +
          'font-weight: 600;text-align: center;color:' + color + '"><p>当前浏览器：' + obj.cur + '</p><p>推荐使用谷歌浏览器</p><p>请使用谷歌、火狐、IE 9.0及以上、Safari等</p></div>';
        document.querySelector('.'+context).innerHTML=domStr;
      }
      return obj;
    }
  };


  window.util = util;
})();