(function ($, win, doc, unde) {
  $.fn.pageFun = function (options) {
    var that = $(this);
    var defaults = {
      pageDiv: $(this).find(".pageDiv"),
      pageDivLi: $(this).find(".pageDiv li"),
      page: $(this).find(".page"),
      pageMenu: $(this).find(".pageMenu"),
      pageMenuLi: $(this).find(".pageDiv li"),
      firstPage: $(this).find(".firstPage"),
      prevPage: $(this).find(".prevPage"),
      pageNum: $(this).find(".pageNum"),
      nextPage: $(this).find(".nextPage"),
      pageObj: $(this).find(".pageObj"),
      pageObjLi: $(this).find(".pageObj li"),
      lastPage: $(this).find(".lastPage"),
      notContent: $(this).find(".notContent"),
      totalPage: $(this).find(".totalPage"),
      pNum: 1, // 总页数
      cacheNum: 1, // 当前页
      min: 0, // 显示页码最左边的数
      res: null, // 请求到的数据
      start: 0 // offset 偏移值  ，  pageSize=limit
    };
    var opts = $.extend({}, defaults, options); // 合并参数

    var Method = {
      init: function () {
        Method.getData();
        /*请求接口获得数据*/
        Method.handleEvent();
        /*事件处理*/
      },


      getData: function () {
        $.ajax({
          url: opts.interFace,
          type: 'GET',
          // data: {start: (opts.cacheNum - 1) * opts.pageSize, length: opts.pageSize},
          data:{
            page:opts.cacheNum
          },
          dataType: 'json',
          success: function (res) {
              opts.res = res.results;
              opts.pNum = Math.ceil(res.count / opts.pageSize);
              if (res.total <= 0) { // 没数据 数据，页码隐藏
                opts.notContent.removeClass("hide");
                opts.firstPage.addClass("disabled");
                opts.prevPage.addClass("disabled");
                opts.lastPage.addClass("disabled");
                opts.nextPage.addClass("disabled");
                opts.firstPage.off("click");
                opts.lastPage.off("click");
                opts.prevPage.off("click");
                opts.nextPage.off("click");
                return;
              } else if (opts.pNum === 1) { // 只有一页数据，上一页下一页不可点
                opts.pageSize = opts.res.length;
                opts.lastPage.addClass("disabled");
                opts.nextPage.addClass("disabled");
                opts.firstPage.off("click");
                opts.lastPage.off("click");
                opts.prevPage.off("click");
                opts.nextPage.off("click");
                opts.notContent.addClass("hide");
              }
              // 数据渲染
              for (var i = 0; i < opts.res.length; i++) {
                opts.pageDiv.append(opts.dataFun(opts.res[i]));
              }
            console.log(opts.pageDiv);

            // 页码渲染
              for (var i = 0; i < opts.pNum; i++) {
                opts.pageObj.append(opts.pageFun(i + 1));
              }

              opts.firstPage.addClass("disabled");
              opts.prevPage.addClass("disabled");
              opts.pageObj.find("li:first-child").addClass("active");
              opts.totalPage.text(opts.pNum);
              Method.showPageindex(0, opts.maxPage, 0);
            }

        })
      },

      // 点击页码切换
      handleEvent: function () {
        opts.pageObj.on("click", "li", function () {
          $(this).addClass("active");
          $(this).siblings("li").removeClass("active");
          opts.cacheNum = $(this).text();
          if ($(this).text() == 1) {
            opts.firstPage.addClass("disabled");
            opts.prevPage.addClass("disabled");
            opts.lastPage.removeClass("disabled");
            opts.nextPage.removeClass("disabled");
            if (opts.pNum == 1) {
              opts.lastPage.addClass("disabled");
              opts.nextPage.addClass("disabled");
              Method.initHTML();
              return;
            }
          } else if ($(this).text() == opts.pNum) {
            opts.firstPage.removeClass("disabled");
            opts.prevPage.removeClass("disabled");
            opts.lastPage.addClass("disabled");
            opts.nextPage.addClass("disabled");

            if (opts.res.length < (opts.pageSize * opts.pNum)) {
              Method.initHTML();
              return;
            }
          } else {
            opts.firstPage.removeClass("disabled");
            opts.prevPage.removeClass("disabled");
            opts.lastPage.removeClass("disabled");
            opts.nextPage.removeClass("disabled");
          }
          Method.showPageindex(0, opts.maxPage, $(this).text());
          Method.initHTML();
        });

        // 点击上页
        opts.prevPage.on("click", function () {
          if (opts.cacheNum == 1) {
            return;
          }
          if (opts.cacheNum == 2) {
            opts.firstPage.addClass("disabled");
            opts.prevPage.addClass("disabled");
          }
          opts.cacheNum--;
          opts.lastPage.removeClass("disabled");
          opts.nextPage.removeClass("disabled");
          that.find(".pageObj li").eq(opts.cacheNum - 1).addClass("active");
          that.find(".pageObj li").eq(opts.cacheNum - 1).siblings("li").removeClass("active");
          Method.initHTML();
          Method.showPageindex(0, opts.maxPage, opts.cacheNum);
        });

        // 点击下页
        opts.nextPage.on("click", function () {
          if (opts.cacheNum == opts.pNum) {
            return;
          }
          opts.cacheNum++;
          opts.firstPage.removeClass("disabled");
          opts.prevPage.removeClass("disabled");
          that.find(".pageObj li").eq(opts.cacheNum - 1).addClass("active");
          that.find(".pageObj li").eq(opts.cacheNum - 1).siblings("li").removeClass("active");
          if (opts.cacheNum == opts.pNum) {
            opts.lastPage.addClass("disabled");
            opts.nextPage.addClass("disabled");
            Method.initHTML();
          } else {
            Method.initHTML();
          }
          Method.showPageindex(0, opts.maxPage, opts.cacheNum);
        });

        // 点击首页
        opts.firstPage.on("click", function () {
          opts.firstPage.addClass("disabled");
          opts.prevPage.addClass("disabled");
          opts.lastPage.removeClass("disabled");
          opts.nextPage.removeClass("disabled");
          that.find(".pageObj li").eq(0).addClass("active");
          that.find(".pageObj li").eq(0).siblings("li").removeClass("active");
          Method.initHTML();
          opts.cacheNum = 1;
          Method.showPageindex(0, opts.maxPage, 0);
        });

        // 点击尾页
        opts.lastPage.on("click", function () {
          opts.firstPage.removeClass("disabled");
          opts.prevPage.removeClass("disabled");
          opts.lastPage.addClass("disabled");
          opts.nextPage.addClass("disabled");
          that.find(".pageObj li").eq(opts.pNum - 1).addClass("active");
          that.find(".pageObj li").eq(opts.pNum - 1).siblings("li").removeClass("active");
          opts.cacheNum = opts.pNum;
          Method.initHTML();
          Method.showPageindex(0, opts.maxPage, opts.pNum);
        });
      },

      // 每次请求数据进行渲染
      initHTML: function () {
        $.ajax({
          url: opts.interFace,
          type: 'GET',
          // data: {start: (opts.cacheNum - 1) * opts.pageSize, length: opts.pageSize},
          data:{
            page:opts.cacheNum
          },
          success: function (res) {

              opts.res = res.results;
              var domStr = [];
              for (var i = 0; i < opts.res.length; i++) {
                domStr.push(opts.dataFun(opts.res[i]));
              }
            opts.pageDiv.html(domStr.join(''));
          }
        });
      },

      // 计算每一次的页码列表
      showPageindex: function (min, max, index) {
        if (index <= Math.ceil(max / 2)) {
          min = 0;
          max = max;
        }
        else if (opts.pNum - index < Math.ceil(max / 2)) {
          min = opts.pNum - max;
          max = opts.pNum;
        }
        else {
          min = Math.round(index - max / 2) - 1;
          max = Math.round(Number(index) + Number(max / 2)) - 1;

        }
        that.find(".pageObj li").hide();
        for (var i = min; i < max; i++) {
          that.find(".pageObj li").eq(i).show();
        }
      }
    };

    Method.init();
  }
})(jQuery, window, document, undefined);