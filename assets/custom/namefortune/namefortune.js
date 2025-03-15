/***** name fortune *****/

let NameFortune;

$(document).ready(function() {
  let game = NameFortune();
  game.init(`.game-wrap`);
});

(NameFortune = NameFortune || function() {
  const K = {
    head: [
			"ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ",
			"ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
			"ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ",
			"ㅋ", "ㅌ", "ㅍ", "ㅎ"
		],

    vowel: [
			"ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ",
			"ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ",
			"ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ",
			"ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ",
			"ㅣ"
		],

    tail: [
			"", "ㄱ", "ㄲ", "ㄳ", "ㄴ",
			"ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ",
			"ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ",
			"ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ",
			"ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ",
			"ㅌ", "ㅍ", "ㅎ"
		],

    getCode: function(_v) {
      if(_v == "") return null;

      let id = _v.charCodeAt(0) - 44032;
      if(id<0 || id > 19*21*28) return null;

      let head = Math.floor(id/(21*28));
      let temp = id - head*(21*28);
      let vowel = Math.floor(temp/28);
      let tail = temp%28;

      return [head, vowel, tail];
    }
  }

  const V = {
    head: [
      2, 4, 2, 3, 6,
      5, 4, 4, 8, 2,
      4, 1, 3, 6, 4,
      3, 4, 4, 3
    ],

    vowel: [
      2, 3, 3, 4, 2,
      3, 3, 4, 2, 4,
      5, 3, 3, 2, 4,
      5, 3, 3, 1, 2,
      1
    ],

    tail: [
      0, 2, 4, 4, 2,
      5, 3, 3, 5, 7,
      9, 9, 7, 9, 9,
      8, 4, 4, 6, 2,
      4, 1, 3, 4, 3,
      4, 4, 3
    ]
  }

  let $wrap, $from, $to, $btnSubmit, $btnReset;
  let $viewWrap;

  function init(_$wrap) {
    const owner = this;

    $wrap = $(_$wrap);
    $from = $wrap.find(`#name-from`);
    $to = $wrap.find(`#name-to`);
    $btnSubmit = $wrap.find(`.btn-submit`);
    $btnSwap = $wrap.find(`.btn-swap`);
    $btnReset = $wrap.find(`.btn-reset`);

    $viewWrap = $wrap.find(`.view-wrap`);

    // event handler
    $btnSubmit.off("click").on("click", function(e) {
      start.call(owner);
    });

    $btnSwap.off("click").on("click", function(e) {
      let temp = $from.val();
      $from.val($.trim($to.val()));
      $to.val($.trim(temp));
      $viewWrap.empty();
    })

    $btnReset.off("click").on("click", function(e) {
      reset.call(owner);
    });
  }

  function start() {
    let from = $from.val().replace(/\ /g, '');
    let to = $to.val().replace(/\ /g, '');

    if(from.length <= 0) {
      return;
    }
    
    if(to.length <= 0) {
      return;
    }

    // game
    let source = [];
    let values = [];
    let length = Math.max(from.length, to.length);
    
    let code = `<div class="row names">`;
    for(let i=0; i<length; ++i) {
      if(from.length > i) {
        source.push(from.charAt(i));
        code += `<div class="cell from"><span class="value">${from.charAt(i)}</span></div>`;
      }
      
      if(to.length > i) {
        source.push(to.charAt(i));
        code += `<div class="cell to"><span class="value">${to.charAt(i)}</span></div>`;
      }
    }
    
    code += `</div>`;

    for(let i=0; i<source.length; ++i) {
      values.push(_getSum(K.getCode(source[i])));
    }

    $viewWrap.empty();
    $viewWrap.append(code);
    while(values.length>1) {
      let t = [];
      for(let i=0; i<values.length-1; ++i) t.push((parseInt(values[i])+parseInt(values[i+1]))%100);
      $viewWrap.append(_append(t));
      values = t;
    }
    $viewWrap.find(`.row:last-child>.cell`).append(`<span class="unit">%</span>`);
    
    $viewWrap.append(`<div class="result-line"><span class="from">${$.trim($from.val())}</span> <span class="text">loves</span> <span class="to">${$.trim($to.val())}</span> in <span class="result">${values[0]}%</span> <span class="text">~♥</span></div>`);


    // inner method
    function _getSum(_t) {
      let v = 0;
      if(_t == null || _t.length <= 0) return v;
      v += V.head[_t[0]];
      if(_t.length <= 1) return v;
      v += V.vowel[_t[1]];
      if(_t.length <= 2) return v;
      v += V.tail[_t[2]];
      return v;
    }

    function _append(_t) {
      let code = `<div class="row">`;
      for(let i=0; i<_t.length; ++i) code += `<div class="cell"><span class="value">${_t[i]}</span></div>`;
      code += `</div>`;
      return code;
    }
  }

  function reset() {
    $viewWrap.html();
  }

  return {
    init: init,
    start: start,
    reset: reset
  }
})();