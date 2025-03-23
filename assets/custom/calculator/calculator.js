var Calc = Calc || (
  function () {
    const _Const = {
      //pi: { key: "π", value: "Math.PI" }
    };

    const _C = {
      _root: "#calculator",
      view_wrap: ".view-wrap",
      container: ".container",
      button_wrap: ".button-wrap",
      input_wrap: ".input-wrap",
      btn_input: ".btn-input",
      history_wrap: ".history-wrap",
      alert_wrap: ".alert-wrap",
      item: ".item",
      bracket: ".bracket",
      operator: ".operator",
      answer: ".answer",
      large: ".large",

      id: function (_c) {
        return "#" + _c;
      },
      x: function (_key) {
        if (typeof _key !== "string") return _key;
        _key = String(_key).replace(/(^\s*)|(\s*$)/g, "");
        return String(_key).charAt(0) == "." || String(_key).charAt(0) == "#"
          ? _key.substring(1)
          : _key;
      }
    }

    const _E = {
      click: "click",
      update: "update",
      keyup: "keyup",
      close: "close",
      alert: "alert"
    };

    const _Alert = {
      tooLarge: "너무 큰 수",
      duplicateOperator: "연산자 중복",
      duplicateNegative: "빼기 연산자 중복",
      noValues: "처리할 내용이 없음",
      incompleteFormula: "식이 완전치 않음",
      operatorAtTheEnd: "마지막이 연산자로 종료",
      emptyBracket: "빈 괄호 발생",
      incompleteBracket: "괄호가 짝이 맞지 않음",
      checkBracketOrder: "괄호 순서 오류",
      copyToClipboard: "수식을 클립보드에 복사하였습니다.",
      inputDisabled: "입력 안됨",
      errorPoint: "소숫점 갯수 오류",
      errorCalculator: "연산 중 오류 발생",
      errorClipboard: "수식 복사 중 에러 발생"
    }

    const _Util = {
      isBackButton: function(_$m) { return (typeof _$m == "string" ? _$m : _$m.val()).charAt(0).toLowerCase() == "b"; },
			isClearButton: function(_$m) { return (typeof _$m == "string" ? _$m : _$m.val()).charAt(0).toLowerCase() == "c"; }
    };

    function init(_option) {
      const owner = this;

      let enableKey = false;
      let enableInput = true;
      let enableCopy = true;

      if (_option != null) {
        if (_option.root != null) _C._root = _option.root;
        if (_option.enableKey != null) enableKey = Boolean(_option.enableKey);
        if (_option.enableCopy != null) enableCopy = Boolean(_option.enableCopy);
        if (_option.enableHistory != null) owner._Config.enableHistory = Boolean(_option.enableHistory);
      }

      reset.call(owner);
      updateHistory.call(owner);

      $(`${_C.button_wrap} button`, _C._root).off(_E.click).on(_E.click, function (e) {
        if (_Util.isClearButton($(this))) reset.call(owner);
        else if (_Util.isBackButton($(this))) {
          owner.isCalculated = false;
          back.call(owner);
        }
        else {
          if (owner.isCalculated) {
            if ($(this).val() == "=") return;
            reset.call(owner);
          }

          input.call(owner, $(this).val());
        }
      });

      if (enableCopy) {
        $(_C.view_wrap, _C._root).off(_E.click).on(_E.click, function (e) {
          let t = owner.dataList.join("").replace(/\*/g, "×").replace(/\//g, "÷");

          if ($(this).find(".item.answer").length > 0) {
            t += ` ${$(this).find(".item.answer").text()}`;
          }

          navigator.clipboard.writeText(t)
            .then(() => {
              owner.alert(_Alert.copyToClipboard);
            })
            .catch(error => {
              owner.alert(_Alert.errorClipboard);
            });
        });
      }

      // keyboard event 허용
      if (enableKey) {
        $(document).off(_E.keyup).on(_E.keyup, function (e) {
          switch (e.keyCode) {
            case 48:
            case 96: _number("0"); break;

            case 49:
            case 97: _number("1"); break;

            case 50:
            case 98: _number("2"); break;

            case 51:
            case 99: _number("3"); break;

            case 52:
            case 100: _number("4"); break;

            case 53:
            case 101: _number("5"); break;

            case 54:
            case 102: _number("6"); break;

            case 55:
            case 103: _number("7"); break;

            case 56:
            case 104: _number("8"); break;

            case 57:
            case 105: _number("9"); break;

            case 110: _number("."); break;

            case 107: _operator("+"); break;
            case 109: _operator("-"); break;
            case 106: _operator("*"); break;
            case 111: _operator("/"); break;

            case 8:
            case 46: back.call(owner); break;

            case 67: reset.call(owner); break;

            case 13: calculate.call(owner); break;
          }
        });
      }

      // input
      if (enableInput) {
        let $input = $(_C.input_wrap, _C._root);
        $(_C.btn_input, $input).off(_E.click).on(_E.click, function (e) {
          input.call(owner, $("input", $input).val());
        });
      }
    }

    function input(_v) {
      const owner = this;

      if (_Const != null) {
        for (let k in _Const) _v = _v.replaceAll(k, _Const[k].key);
      }

      if (_v.length == 1) _do(String(_v));
      else if (_v.length > 1) {
        reset.call(owner);
        for (let i = 0; i < _v.length; ++i) _do(_v.charAt(i));
      }

      // inner method
      function _do(_v) {
        if (!owner.enable && !_Util.isBackButton(_v) && !_Util.isClearButton(_v)) {
          owner.alert(_Alert.inputDisabled);
          return false;
        }

        let key = checkConst.call(owner, _v, true);

        if (key != null) {
          _number(key.key);
        }
        else if ((/[0-9]/g).test(_v)) _number(_v);
        else {
          switch (_v) {
            case ".":
              _number(_v);
              break;

            case "+":
            case "/":
            case "*":
              _operator(_v);
              break;

            case "x":
              _operator("*");
              break;

            case "-":
              owner._Config.enableNegative ? _negative() : _operator("-");
              break;

            case "(":
            case ")":
              _bracket(_v);
              break;

            case "=":
              calculate.call(owner);
              break;
          }
        }
      }

      function _number(_n) {
        let id = Math.max(owner.dataList.length - 1, 0);

        if (checkConst.call(owner, owner.dataList[id], true) != null) id = __pushNew();
        else if (owner.dataList[id] == "(") id = __pushNew();
        else if (owner.dataList[id] == ")") {
          owner.dataList.push("*");
          id = __pushNew();
        }
        else if (isOperator.call(owner, owner.dataList[id])) {
          if (owner._Config.enableNegative) {
            if (owner.dataList[id] == "-") {
              if (id <= 0 || !isOperator.call(owner, owner.dataList[id - 1])) id = __pushNew();
            }
            else id = __pushNew();
          }
          else id = __pushNew();
        }

        let t = owner.dataList[id];
        if (t == null) t = "";
        if (_n == ".") {
          if (t.indexOf(".") >= 0) {
            owner.alert(_Alert.errorPoint);
            return;
          }

          if (t == "") t = "0";
          else if (owner._Config.enableNegative && t == "-") t = "-0";
        }
        else if (t.length >= owner._Config.limit) {
          owner.alert(_Alert.tooLarge)
          return;
        }
        else {
          if (t == "0") t = "";
          else if (t == "-0") t = "-";
        }
        owner.dataList[id] = String(t) + String(_n);
        update.call(owner);

        // inner method
        function __pushNew() {
          owner.dataList.push("");
          return owner.dataList.length-1;
        }
      }

      function _negative() {
        let id = Math.max(owner.dataList.length - 1, 0);
        if (isOperator.call(owner, owner.dataList[id])) {
          if (id > 0 && isOperator.call(owner, owner.dataList[id - 1])) {
            owner.alert(_Alert.duplicateNegative);
            return;
          }
        }

        owner.dataList.push("-");
        update.call(owner);
      }

      function _operator(_n) {
        if (owner.dataList.length == 0) owner.dataList[0] = isPlusMinus.call(owner, _n) ? "0" : "1";

        let id = Math.max(owner.dataList.length - 1, 0);
        if (isOperator.call(owner, owner.dataList[id])) {
          owner.alert(_Alert.duplicateOperator);
          return;
        }

        owner.dataList.push(_n);
        update.call(owner);
      }

      function _bracket(_n) {
        let t = owner.dataList;

        if (t.length > 0) {
          if (_n == "(" && !isOperator.call(owner, t[t.length - 1])) owner.dataList.push("*");
          if (_n == ")" && t[t.length - 1] == "(") {
            owner.alert(_Alert.emptyBracket);
            return;
          }
        }

        let count = 0;

        if (t != null && t.length > 0) {
          for (let i = 0; i < t.length; ++i) {
            if (t[i] == "(") ++count;
            else if (t[i] == ")") --count;
          }
        }

        if (_n == ")" && count <= 0) {
          owner.alert(_Alert.checkBracketOrder);
          return;
        }

        owner.dataList.push(_n);
        update.call(owner);
      }
    }

    function update(_add) {
      const owner = this;
      
      $(_C.view_wrap, _C._root).empty().append(`<div class="${_C.x(_C.container)}"></div>`);
      const $wrap = $(`${_C.view_wrap} ${_C.container}`, _C._root);
      $wrap.empty();

      let t = [];

      if (owner.dataList.length <= 0) t.push(_code("0", 0));
      else {
        for (let i = 0; i < owner.dataList.length; ++i) {
          let o = owner.dataList[i];
          t.push(_code(o, i));
        }
      }

      if (t.length > 0) {
        for (let i = 0; i < t.length; ++i) $wrap.append(t[i]);
        $wrap.children().each(function (_idx, _m) {
          _resize($(this), $wrap.width());
        });
      }

      if (_add != null) $wrap.append(_add);

      $wrap.css("top", ($wrap.height() >= $wrap.parent().height() ? Math.floor($wrap.parent().height() - $wrap.height()) : 0));
      $(_C._root).trigger(_E.update);

      // inner method
      function _code(_v, _i) {
        // class
        let c = [_C.x(_C.item)];
        if (isOperator.call(owner, _v)) c.push(_C.x(_C.operator));
        if (_v == "(" || _v == ")") c.push(_C.x(_C.bracket));

        // washing value
        if (_v == "/") _v = "÷";
        if (_v == "*" || _v == "x") _v = "×";
        if (!(_add == null && _i >= owner.dataList.length - 1) && _v.charAt(_v.length - 1) == ".") _v = _v.slice(0, -1);

        return `<span class="${c.join(" ")}">${String(_v)}</span>`;
      }

      function _resize(_$m, _w) {
        if (_$m.width() > _w) _$m.addClass(_C.x(_C.large));
      }
    }

    function calculate() {
      const owner = this;

      // 형식이 완전치 않음
      if (owner.dataList == null || owner.dataList.length <= 2) {
        owner.alert(_Alert.incompleteFormula);
        return null;
      }

      // 괄호 갯수 오류
      if (!_checkBracket(owner.dataList)) {
        owner.alert(_Alert.incompleteBracket);
        return null;
      }

      owner.enable = false;

      let o = owner.dataList.toString().replace(" ", "");

      // 대표값 처리
      if (_Const != null) {
        for (let k in _Const) {
          let r = new RegExp(_Const[k].key, "g");
          o = o.replace(r, _Const[k].value);
        }
      }

      // 코드 구성
      try {
        let output = _isDeep(o) ? _deep(o) : _simple(o);
        if (output == null) update.call(owner);
        else {
          update.call(owner, `<span class="${[_C.x(_C.item), _C.x(_C.answer)].join(" ")}">= ${output}</span>`);
          addHistory.call(owner, owner.dataList, output);
          owner.isCalculated = true;
        }
      }
      catch (error) { owner.alert(_Alert.errorCalculator); }

      // inner method
      function _isDeep(_o) {
        return owner._Config.enableNegative;
      }

      function _deep(_o) {
        //console.log("[CAL:0]", _o)

        // 음수 선처리
        if (owner._Config.enableNegative) {
          if (_o.indexOf("-,") == 0) _o = "_" + _o.slice(2);
          _o = _o.replace(/([+\-\*\/\(])\,-/g, (match, _p) => `${_p},_`);
          _o = _o.replace(/_\,/g, "_");
        }

        //console.log("[CAL:1]", _o)

        // 부호 처리
        _o = _o.replace(/\(\,/g, "[").replace(/\,\)/g, "]").replace(/\*/g, `"*"`).replace(/\//g, `"/"`).replace(/\+/g, `"+"`).replace(/\-/g, `"-"`);

        // 음수 처리 마무리
        if (owner._Config.enableNegative) _o = _o.replace(/_/g, `-`);

        //console.log("[CAL:9]", _o)

        //return _do(_order(eval(`[${_o}]`)));
        try { return _do(_order(JSON.parse(`[${_o}]`))); }
        catch(err) { return null; }
      }

      function _simple(_o) {
        return eval(_o.split(",").join(""));
      }

      function _do(_t) {
        if (_t == null || _t.length <= 0) {
          owner.alert(_Alert.noValues);
          return null;
        }

        if (isPlusMinus.call(owner, _t[0])) _t.unshift("0");
        else if (isTimes.call(owner, _t[0])) _t.unshift("1");

        if (isOperator.call(owner, _t[_t.length - 1])) _t.pop();

        let output = Array.isArray(_t[0]) ? _do(_t[0]) : parseFloat(_t[0]);
        for (let i = 1; i < _t.length; ++i) {
          let o = _t[i];

          if (Array.isArray(o)) _t[i] = _do(o);
          else if (isOperator.call(owner, o)) {
            if (i >= _t.length - 1) {
              owner.alert(_Alert.operatorAtTheEnd);
              return null;
            }

            let n = _t[i + 1];
            if (Array.isArray(n)) n = _do(n);
            else if (isOperator.call(owner, n)) {
              owner.alert(_Alert.duplicateOperator, { value: n, index: i+1 });
              return null;
            }

            switch (o.toLowerCase()) {
              case "+":
                output += parseFloat(n);
                break;

              case "-":
                output -= parseFloat(n);
                break;

              case "*":
                output *= parseFloat(n);
                break;

              case "/":
                output /= parseFloat(n);
                break;
            }
            ++i;
          }
        }

        return output;
      }

      function _order(_t) {
        if (_t == null || _t.length <= 0) return _t;

        let o = [];
        let id = 0;

        for (let i = 0; i < _t.length; ++i) {
          if (Array.isArray(_t[i])) _t[i] = _order(_t[i]);
          if (isPlusMinus.call(owner, _t[i]) || i >= _t.length - 1) {
            // 앞에 한 자리
            if (i - id == 1) o.push(_t[id]);
            else {
              let d = [];
              for (let j = id; j < i; ++j) {
                d.push(_t[j]);
              }

              // 
              let isCut = i >= _t.length - 1 && isTimes.call(owner, _t[i - 1]);
              if (isCut) d.push(_t[i])
              if (d.length > 0) o.push(d);
              if (isCut) return o;
            }

            o.push(_t[i]);

            id = i + 1;
          }
        }

        return o;
      }

      function _checkBracket(_t) {
        let count = 0;
        if (_t != null && _t.length > 0) {
          for (let i = 0; i < _t.length; ++i) {
            if (_t[i] == "(") ++count;
            else if (_t[i] == ")") --count;
          }
        }
        return count == 0;
      }
    }

    function back() {
      this.enable = true;

      if (this.dataList == null || this.dataList.length <= 0) return;
      if (isOperator.call(this, this.dataList[this.dataList.length - 1])) this.dataList.pop();
      else this.dataList[this.dataList.length - 1] = this.dataList[this.dataList.length - 1].slice(0, -1);

      if (this.dataList[this.dataList.length - 1] == "") this.dataList.pop();

      update.call(this);
    }

    function reset() {
      this.isCalculated = false;
      this.enable = true;
      this.dataList = [];

      $(_C.view_wrap, _C._root).empty().append(`<div class="${_C.x(_C.container)}"></div>`);
      update.call(this);
    }

    function close() {
      $(_C._root).trigger(_E.close);
    }

    // alert
    function alert(_v, _o) {
      $(_C._root).trigger(_E.alert,
        _o == null ? _v : $.extend(_o, {text: _v})
      );
    }

    // history
    function addHistory(_exp, _answer) {
      if (!this._Config.enableHistory) return;

      if (this.historyList == null) this.historyList = [];

      if (this.historyList.length > 0 && this.historyList[this.historyList.length - 1].exp.toString() == _exp.toString()) return;

      this.historyList.push({ exp: _exp, answer: _answer });
      updateHistory.call(this);
    }

    function updateHistory() {
      if (!this._Config.enableHistory) return;

      const owner = this;

      let $wrap = $(_C.history_wrap, _C._root);
      $wrap.empty();

      if (owner.historyList != null && owner.historyList.length > 0) {
        $wrap.append(`<ul class="list"></ul>`);
        $(owner.historyList).each(function (_idx, _o) {
          if (_o != null && _o.exp != null) {
            let code = `<span class="exp">${_toString(_o.exp)}</span>`;
            if (_o.answer != null) code += `<span class="answer">= ${_o.answer}</span>`;
            $("ul.list", $wrap).prepend(`<li class="item" value="${_o.exp.join(",")}">${code}</li>`);
          }
        });

        $("ul.list>li.item", $wrap).off(_E.click).on(_E.click, function (e) {
          let id = $("ul.list>li.item", $wrap).length - $(this).index() - 1;
          owner.historyList.push(owner.historyList.splice(id, 1)[0]);
          updateHistory.call(owner);
          input.call(owner, String($(this).attr("value")).split(",").join(""));
        });
      }

      // inner method
      function _toString(_o) {
        return _o.join("").replace(/\*/g, "×").replace(/\//g, "÷");
      }
    }

    // local methods
    function isPlusMinus(_n) {
      if (_n == null || _n == "") return false;

      switch (String(_n).split("").pop().toLowerCase()) {
        case "+":
        case "-":
          return true;

        default:
          return false;
      }
    }

    function isTimes(_n) {
      if (_n == null || _n == "") return false;

      switch (String(_n).split("").pop().toLowerCase()) {
        case "*":
        case "/":
          return true;

        default:
          return false;
      }
    }

    function isOperator(_n) {
      return isPlusMinus.call(this, _n) || isTimes.call(this, _n);
    }

    function checkConst(_n, _useKey) {
      if (_Const == null) return null;
      for (let k in _Const) {
        if (_useKey) {
          if (_Const[k].key == _n) return _Const[k];
        }
        else if (k == _n.toLowerCase()) return _Const[k];
      }
      return null;
    }

    return {
      _Config: {
        limit: 20,
        enableNegative: true,
        enableHistory: false
      },

      historyList: [],
      dataList: [],
      enable: true,
      isCalculated: false,
      
      init: init,
      input: input,
      update: update,

      calculate: calculate,
      back: back,

      reset: reset,
      close: close,
      alert: alert,

      addHistory: addHistory,
      updateHistory: updateHistory
    }
  }
)();