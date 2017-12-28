/**
 * Created by LUYUE on 2017/10/18.
 */
(function () {
  function Pagination(opts) {
    // context容器的ID, pageSize一页含几条数据, total数据总数, callBack 请求某页数据
    this.context = document.getElementById(opts.context);
    this.contStr = opts.context;
    this.total = opts.total || 0;
    this.pageSize = opts.pageSize || 10;
    this.curPage = 0;
    this.allPage = null;
    this.callback = opts.callBack;
    this.numBtn = null;
    this.callBack = opts.callBack;
    this.callBack(this.curPage, this.pageSize);
    this.init();
  }

  // 总的页数
  Pagination.prototype.initTotal = function () {
    this.allPage = Math.ceil(this.total / this.pageSize);
  };

  // 生成数字选项
  Pagination.prototype.initSpan = function () {
    if (this.total > 0&&this.allPage>1) {
      var spanStr = '';
      for (var i = 0; i < this.allPage; i++) {
        spanStr += i === 0 ? '<span class="page-num selected">' + (i + 1) + '</span>' : '<span class="page-num">' + (i + 1) + '</span>';
      }
      this.context.innerHTML = spanStr;
    }
  };

  // 绑定事件
  Pagination.prototype.bindEvent = function () {
    this.numBtn = $('#' + this.contStr + ' .page-num');
    var jump = null;
    var _this = this;

    // 修改当前页样式
    function changeCurStyle(ind) {
      for (var i = 0; i < _this.numBtn.length; i++) {
        var curLi = _this.numBtn[i];
        i === ind ? $(curLi).addClass('selected') : $(curLi).removeClass('selected');
      }
    }

    // 点击跳转到指定页
    $.each(this.numBtn, function (index, item) {
      item.onclick = function (e) {
        _this.curPage = Number(e.target.innerHTML) - 1;
        changeCurStyle(_this.curPage);
        _this.callBack(_this.curPage, _this.pageSize);
      }
    });
  };

  // 触发器
  Pagination.prototype.init = function () {
    this.initTotal();
    this.initSpan();
    this.bindEvent();
  };
  window.Pagination = Pagination;
})();
