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
    }

  };


  window.util = util;
})();