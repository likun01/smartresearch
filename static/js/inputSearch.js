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
    console.log(_this.inpEle.val());
    _this.inpValue = _this.inpEle.val();
    if (_this.inpValue) {
      _this.inpEle.data('val', _this.inpValue);
      $.ajax({
        // 百度搜索关键词 请求 接口API
        url: _this.opts.url,
        type: 'GET',
        data: { // 向后台发送数据
          wd: _this.inpValue, // 查询关键词
          json: 1
        },
        dataType: 'jsonp', // 跨域请求  只要http协议，端口，域名任意一项不同就是跨域
        jsonp: 'cb', // 指定函数名 cb(result)
        success: function (result) {
          if (result.g) { // 从百度搜索得到的数据有一个g的属性,保存着搜索信息 是对象的格式（q st t 属性，q存着检索的信息，st是一个object，t是一个字符串）
            _this.opts.bindData(result.g);
            _this.listAll = $(_this.listStr);
            _this.lastInd = _this.listAll.length - 1; // 元素数组最后一个索引
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
    var reg = /(<\w+>)|<\/\w+>/g;
    _this.inpEle.val(e.target.innerHTML.replace(reg, ''));
    _this.opts.searchRes();
    _this.listCont.hide();
  });
};

// 键盘事件
InputSearch.prototype.keyCodeChange = function () {
  var _this = this;
  this.inpEle.on('keydown', function (e) {
    if (_this.listAll && _this.listAll.length) { // 只有渲染出列表的时候再判断keycode
      if (e.keyCode === 38) { // 上
        _this.count--;
        if (_this.count <= -2) {
          _this.count = _this.lastInd;
          _this.listAll.eq(_this.lastInd).addClass('select');
        } else if (_this.count === -1) {
          _this.listAll.removeClass('select');
          _this.inpEle.val($(_this.inpEle).data('val')); // 输入框中设置为最开始输入时的关键词
          return;
        } else {
          _this.listAll.eq(_this.count).addClass('select').siblings().removeClass('select');
        }
        var reg = /(<\w+>)|<\/\w+>/g;
        _this.word = _this.listAll.eq(_this.count).html().replace(reg, '');
        _this.inpEle.val(_this.word);


      } else if (e.keyCode === 40) { //下
        _this.count++;
        if (_this.count > _this.lastInd) {
          _this.count = -1;
          _this.listAll.removeClass('select');
          _this.inpEle.val($(_this.inpEle).data('val')); // 输入框中设置为最开始输入时的关键词
          return;
        }
        _this.listAll.eq(_this.count).addClass('select').siblings().removeClass('select');
        var reg = /(<\w+>)|<\/\w+>/g;
        _this.word = _this.listAll.eq(_this.count).html().replace(reg, '');
        _this.inpEle.val(_this.word);
      } else if (e.keyCode === 13) {
        console.log(_this.opts.searchRes);
        _this.listCont.hide();
        // enter 键后开始请求搜索内容对应数据
        _this.opts.searchRes();
      }
    }
  })
};

// 事件触发
InputSearch.prototype.init = function () {
  this.inputChange();
  this.keyCodeChange();
  this.clickChoose();
};

window.InputSearch = InputSearch;
