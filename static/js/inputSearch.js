function InputSearch(inpEle, listCont, listAll, opts) {
  // inpEle  输入文本元素的id    listCont列表外层框元素的id   listAll列表的每一项 例如: #search-container li     opts请求的参数  url , bindData
  // 被选中的样式名为  select
  this.inpEle = $(inpEle);
  this.listCont = $(listCont);
  this.listStr = listAll;
  this.listAll = ''; // 初始化时没有值
  this.lastInd = 0; // this.listAll.length - 1 元素数组最后一个索引   初始化时没有值
  this.opts = opts;
  this.count = -1;
  this.init();
}

// input文本框内容改变检测
InputSearch.prototype.inputChange = function () {
  var _this = this;
  this.inpEle.on('input propertychange', function () {
    console.log('zhixing ----------------')
    _this.inpValue = _this.inpEle.val();
    if (_this.inpValue) {
      _this.inpEle.data('val', _this.inpValue);
      $.ajax({
        // 百度搜索关键词 请求 接口API
        url: _this.opts.url,
        type: 'GET',
        data: { // 向后台发送数据
          q: _this.inpValue,
          token: _this.opts.token
        },
        crossDomain: true == !(document.all),
        success: function (result) {
          if (result.results && result.results.length) {
            _this.opts.bindData(result.results);
            _this.listAll = $(_this.listStr);
            _this.lastInd = _this.listAll.length - 1; // 元素数组最后一个索引
          } else {
            _this.listCont.hide();
          }
        }
      })
    } else {
      _this.listCont.hide();
    }
  });
};

// 鼠标选择某一项
InputSearch.prototype.clickChoose = function () {
  var _this = this;
  this.listCont.on('click', function (e) {
    // var str = _this.listAll.eq(_this.count).find('td').eq(0).find('a').html();
    var str = _this.listAll.eq(_this.count).data('code');
    _this.word = str;
    _this.inpEle.val(_this.word);
    _this.listCont.hide();
  });
};

// 键盘事件
InputSearch.prototype.keyCodeChange = function () {
  var _this = this;
  this.inpEle.on('keydown', function (e) {
    if (_this.inpEle.val()) {
      if (e.keyCode === 13) {
        // enter 键后开始请求搜索内容对应数据
        var value = null;
        var code = '';
        if (_this.listAll && _this.listAll.length) {
          code = _this.listAll.eq(0).data('code');  // 鼠标没有选中项  默认进第一条
          _this.listAll.each(function (index, item) {
            if (item.style.backgroundColor === 'rgb(228, 238, 249)' || item.style.backgroundColor === '#FDFFFD') { // 鼠标有选中项  进选中条
              // code = _this.listAll.eq(index).find('td').eq(0).find('a').html();
              code = _this.listAll.eq(index).data('code');
            }
          });
        }

        if (_this.listCont.css('display') === 'none') {
          value = _this.inpEle.val();
        }
        _this.opts.searchRes(code,value);
        _this.inpEle.val('');
        _this.listCont.hide();
      }
    }
    if (_this.listAll && _this.listAll.length) { // 只有渲染出列表的时候再判断keycode
      if (e.keyCode === 38) { // 上
        _this.count--;
        if (_this.count <= -2) {
          _this.count = _this.lastInd;
          _this.listAll.eq(_this.lastInd).css('background', '#E4EEF9');
        } else if (_this.count === -1) {
          _this.inpEle.val($(_this.inpEle).data('val')); // 输入框中设置为最开始输入时的关键词
          _this.listAll.css('background', '#FDFFFD');
          return;
        } else {
          _this.listAll.eq(_this.count).css('background', '#E4EEF9').siblings().css('background', '#FDFFFD');
        }
        // var str = _this.listAll.eq(_this.count).find('td').eq(0).find('a').html();
        var str = _this.listAll.eq(_this.count).data('code');
        _this.word = str;
        _this.inpEle.val(_this.word);

      } else if (e.keyCode === 40) { //下
        _this.count++;
        if (_this.count > _this.lastInd) {
          _this.count = -1;
          _this.listAll.css('background', '#FDFFFD');
          _this.inpEle.val($(_this.inpEle).data('val')); // 输入框中设置为最开始输入时的关键词
          return;
        }
        _this.listAll.eq(_this.count).css('background', '#E4EEF9').siblings().css('background', '#FDFFFD');
        // var str = _this.listAll.eq(_this.count).find('td').eq(0).find('a').html();
        var str = _this.listAll.eq(_this.count).data('code');
        _this.word = str;
        _this.inpEle.val(_this.word);
      }
    }
  })
};

// 事件触发
InputSearch.prototype.init = function () {
  this.inputChange();
  this.keyCodeChange();
  // this.clickChoose();
};

window.InputSearch = InputSearch;
