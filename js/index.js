/* ------------------------------------------------------------------------------
 * settings
------------------------------------------------------------------------------ */

var today = new Date();
// アプリ登録して取得
var CONSUMER = {
  key: 'FEJXJJbzC9XE4W1GnHKbyzSue',
  secret: 'ArbbpqCaOxKAEQ6xbb7P9WDxgx8yukDAeXdiPN2l1PKYTqbQSE'
};
// ユーザの自前アカウントで取ってきてもらってもいいし、アプリ固有のを埋め込んでもいい
var ACCESS = {
    token: '42576285-MwtV2XLgxr5d1NRjCiJci7SCVEitY4jkZEMjKByR3',
    secret: '2C08RqPUiCVBPwWX70jerlqOIv5EacF2WQLKVGTDVDXN1'
};

var imgDirBase = {
  recommendContents: '/img/recommend_contents/',
  contentsNews: '/img/contents_news/',
  header: '/img/gtop/header/',
  special: '/img/gtop/special/',
  topics: '/img/gtop/topics/',
  program: '/img/program/'
}
var urlList = {
  weather: '/rss/tenki.xml',// 既存のrss。
  webnews: '/rss/webnews.xml',// 既存のrss。
  frontendData: '/js/frontend_data.json', // frontendで作成するデータ
	contentsNews: '/data/gtop/contents_news.json', // コンテンツニュース用データ
	programName: '/data/gtop/epg_program_name.json', // 番組の名前とidの紐付け
	programInfo: '/data/gtop/program_info.json', // 番組詳細情報
	programList: '/data/gtop/programList.json', // 番組情報
	endProgram: '/data/gtop/program_broadcast_end.json', // 終了コンテンツ
	recommendContents: '/data/gtop/recommend_contents.json' // おすすめコンテンツ
}
var masterCode = {
	producer: [
		{
			id: 1,
			name:'朝日放送',
			url: 'http://www.asahi.co.jp/'
		},{
			id: 2,
			name:'テレビ朝日',
			url: 'http://www.tv-asahi.co.jp/'
		},{
			id: 3,
			name:'メ～テレ',
			url: 'http://www.nagoyatv.com/'
		}
	],
	genre: [
		{
			id: 1,
			name: '報道・情報'
		},{
			id: 2,
			name: 'バラエティ・音楽'
		},{
			id: 3,
			name: 'ドラマ・映画 '
		},{
			id: 4,
			name: 'アニメ・ヒーロー'
		},{
			id: 5,
			name: '料理・旅・暮らし'
		},{
			id: 6,
			name: 'ナイト枠'
		},
	],
	days: [
		{
			id: 1,
			name: 'SP'
		},{
			id: 2,
			name: '月'
		},{
			id: 3,
			name: '火'
		},{
			id: 4,
			name: '水'
		},{
			id: 5,
			name: '木'
		},{
			id: 6,
			name: '金'
		},{
			id: 7,
			name: '土'
		},{
			id: 8,
			name: '日'
		},
	],
	timeRange: [
		{
			id: 1,
			name: '朝'
		},{
			id: 2,
			name: '昼'
		},{
			id: 3,
			name: '夜'
		},{
			id: 4,
			name: '深夜'
		},
	],
	sitePlace: [
		{
			id: 1,
			name: '番組一覧'
		},
		{
			id: 2,
			name: '終了番組'
		}
	],
	outerService: [
		{
			id: 1,
			name: 'YouTube',
			type: 1
		},{
			id: 2,
			name: 'Twitter',
			type: 2
		},{
			id: 3,
			name: 'Facebook',
			type: 2
		},{
			id: 4,
			name: 'Instagram',
			type: 2
		},{
			id: 5,
			name: 'LINE',
			type: 2
		},{
			id: 6,
			name: 'USTREAM',
			type: 1
		},{
			id: 7,
			name: 'ニコニコチャンネル',
			type: 1
		},{
			id: 8,
			name: 'TVer',
			type: 1
		},
	],
	sitemapGroup: [
		{
			id: 1,
			name: 'プリキュア'
		},{
			id: 2,
			name: 'ABCお笑いグランプリ'
		}
	],
	category: [
		{
			id: 1,
			name: '動画'
		},{
			id: 2,
			name: 'エビシー'
		},{
			id: 3,
			name: 'アナウンサー'
		},{
			id: 4,
			name: 'プレゼント・募集'
		},{
			id: 5,
			name: 'イベント・試写会'
		}
	]
};
var contentsData = [],
  dayList = ['日', '月', '火', '水', '木', '金', '土'];

  var twapi = new TwitterAPIonBrowser({
    consumerKey: CONSUMER.key,
    consumerSecret: CONSUMER.secret,
    accessToken: ACCESS.token,
    accessTokenSecret: ACCESS.secret
  });


var noImg = 'img/dummy-thumb.png';

function makeList(data){
	return data.program_id;
}

function date2date(dateSet) {
	var editDate = Number(dateSet.getFullYear() + ("0"+(dateSet.getMonth() + 1)).slice(-2) + ("0"+dateSet.getDate()).slice(-2) + ("0"+dateSet.getHours()).slice(-2) + ("0"+dateSet.getMinutes()).slice(-2) + ("0"+dateSet.getSeconds()).slice(-2));
	return editDate;
}
var urlParaDate = date2date(today);

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min );
}

$(function () {
  // ajax settings
  function getData(url, type, data) {
    return $.ajax({
      url: url,
      data: data? data: null,
      type: type? type : 'GET'
    });
  }

  function videoControl(action, targetFrame) {
    var $playerWindow = $(targetFrame)[0].contentWindow;
    $playerWindow.postMessage('{"event":"command","func":"' + action + '","args":""}', '*');
  }

/* ------------------------------------------------------------------------------
 * slideArea settings
------------------------------------------------------------------------------ */
  function itemSlide(data) {
    var $slideAreaFrame = $('[data-func="contentsSlide"]'),
      $slideTarget = $('<ul data-object="slideList" />'),
      $slideItem = $('<li />'),
      itemWidth = 482,
      itemHeight = 270,
      slideData = data,
      $btnPrev = $('<span class="js-slider-btn prev" />'),
      $btnNext = $('<span class="js-slider-btn next" />'),
      $indexList = $('<ul class="js-slider-thumb" />'),
      delay = 3000,
      timer;

    // DOM準備
    function settingDom() {
      for (var i = 0; i < slideData.length; i++) {
        var $li = $slideItem.clone(),
          $thumb = $slideItem.clone();
        if(slideData[i].movie){// movieの場合
          var $img = $('<iframe height='+ itemHeight +' width='+ itemWidth +' src="https://www.youtube.com/embed/'+ slideData[i].id +'?rel=0&enablejsapi=1" frameborder="0" allowfullscreen" />');
          $li.attr('data-second', slideData[i].second);
          $li.attr('data-id', slideData[i].id);
          $li.attr('data-count', i);
          $li.attr('alt', slideData[i].title);
          $li.append($img);
        } else {// リンクの場合
          var $link = $('<a href='+ slideData[i].url +'>')
          $img = $('<img src='+ slideData[i].img +' alt='+ slideData[i].title +'>');
          $link.append($img);
          $li.append($link);
          $li.attr('data-count', i);
        }
        $thumb.attr('data-index', i);
        $thumb.text('●')
        $indexList.append($thumb);
        $slideTarget.append($li);
        $slideTarget.attr('data-current', 0);
        if(i == 0){
          $thumb.addClass('current')
        }
      }
    }

    // 画像降ってくるやつ
    // function startingAnimation() {
    //   var $targetItems = $slideTarget.find('li');
    //   $slideTarget.css({
    //     perspective: 400,
    //     perspectiveOrigin: '150px -100px',
    //     transformStyle: 'preserve-3d',
    //     transform: 'translateX(0px)'
    //   })
    //   $targetItems.css({
    //     top: - itemHeight,
    //     left: itemWidth,
    //     position: 'absolute',
    //     transform: 'rotateY(60deg) scale3d( .7, .7, 1) skewX(-20deg) skewY(20deg)'
    //   })
		//
    //   $targetItems.each(function(i, item){
    //     $(item).animate({
    //       top: 0,
    //       left: ($targetItems.index(item) * 30 + 60) + 'px'
    //     }, i * 100)
    //   })
    // }

    // 並べる
    function setListMenu() {
      var delayTime = 3000;
      $slideTarget.css({
        // perspective: '0px',
        // perspectiveOrigin: '0 0',
        transform: 'translateX('+ itemWidth * 1 / 4 +'px)'
      })

      $slideTarget.find('li').each(function(j, li){
        $(li).css({
          left: itemWidth * .25 + (itemWidth + 15) * j,
          transform: 'rotateY(0deg) skew(0, 0)'
        })
      })
      var fixListPos = function(){
        $slideTarget.css({
          width: (itemWidth + 15) * $slideTarget.find('li').length,
          transform: 'translateX('+ itemWidth * 1 / 4 +'px)'
        })
        $slideTarget.find('li').css({
          position: 'static'
        })
        if($slideTarget.find('li').eq(0).attr('data-second')){
          delayTime = $slideTarget.find('li').eq(0).attr('data-second');
        }
        timer = setTimeout(moveItem, delayTime, 1)
        $slideAreaFrame.append($btnPrev).append($btnNext);
      }
      setTimeout(fixListPos, 1000)
      $indexList.find('li').on('click', function(e){
        var index = $(this).attr('data-index');
        moveItem(+ index);
      })
      $('[data-func="slide-wrap"]').append($indexList);
    }

    // うごかす
    function moveItem(index) {
      if (timer) clearTimeout(timer);
      var $targetList = $('[data-object="slideList"]'),
        $thumbList = $('.js-slider-thumb'),
        currentIndex = $targetList.attr('data-current'),
        $currentItem = $('[data-count='+ currentIndex +']'),
        $targetItem = $('[data-count='+ index +']'),
        nextIndex = 0,
        delayTime = $targetItem.attr('data-second') ? $targetItem.attr('data-second') * 1000 : delay;

      if($currentItem.attr('data-second')){
        videoControl('stopVideo', $currentItem.find('iframe'))
      }
      $targetList.css({
        transform: 'translateX(' + - ( itemWidth * parseInt(index, 10) + 15 * parseInt(index, 10) - itemWidth / 4) + 'px)'
      });
      $targetList.attr('data-current', index);
      if( index < $targetList.find('li').length - 1){
        nextIndex = index + 1;
      } else {
      }
      if($targetItem.attr('data-second')){
        videoControl('playVideo', $targetItem.find('iframe'))
      }
      $thumbList.find('.current').removeClass('current');
      $thumbList.find('[data-index='+ index +']').addClass('current');
      timer = setTimeout(moveItem, delayTime, nextIndex);
    }

    $btnPrev.on('click', function(){
      $btnPrev.off('click');
      var currentIndex = $('[data-object="slideList"]').attr('data-current');
      if(currentIndex > 0){
        moveItem(parseInt(currentIndex, 10) - 1);
      } else {
        moveItem($('[data-object="slideList"]').find('li').length - 1);
      }
    })

    $btnNext.on('click', function(){
      $btnNext.off('click');
      var currentIndex = $('[data-object="slideList"]').attr('data-current');
      if(currentIndex < $('[data-object="slideList"]').find('li').length - 1){
        moveItem(parseInt(currentIndex, 10) + 1);
      } else {
        moveItem(0);
      }
    })
    settingDom ()
    $slideAreaFrame.append($slideTarget);
    // startingAnimation();
    setListMenu();
  }

  /* ------------------------------------------------------------------------------
   * abciee animation settings
  ------------------------------------------------------------------------------ */

  var $abciee = $('[data-func="abciee"]'),
  // 各コマの秒数
    timeline = [1.5, .2, .2, .2, .2, .2, .2, .2, .2, .2, .2, .1, .1, .1, .2, .2, .2, .2, 1.5, .2, .2, .2, .2, .2],
    count = timeline.length,
    abcieeAnimation;

  var settingAbcieeClass = function(num){
    var next = num + 1;
    if(num == count - 1){
      next = 0;
    }
    $abciee.removeClass();
    $abciee.addClass('abciee-num' + num);

    abcieeAnimation = setTimeout(settingAbcieeClass, timeline[num] * 1000, next);
  }
  settingAbcieeClass(0);

/* ------------------------------------------------------------------------------
 * background contents
------------------------------------------------------------------------------ */
  function settingBg (data){
    var $bgArea = $('[data-func="bg"]'),
      bgTimeLine = data.bgChangeTime,
      contentsWidth = 1000,
      bgWidth = 1460,
      bgTitleWidth = 231,
      bgContentsWidth = 182,
      windowWidth,
      bgTopPos = [30, 180, 330];


    function setTimeData (today){// 時間でのデータ切り替え
      var hour = today.getHours(),
        minute = today.getMinutes(),
        bgTargetTime;
      Object.keys(bgTimeLine).forEach(function(key, i, keys){
        var timelineHour = key.split(':')[0],
        timelineMinute = key.split(':')[1];

        if(hour > timelineHour && minute > timelineMinute){
          bgTargetTime = bgTimeLine[key];
        }
      });
      return data[bgTargetTime];
    }
    function contentsLeftPos (windowWidth){// windowサイズで出す場所を設定
      var diffBase = (bgWidth - contentsWidth) / 2,
        windowDiff = (windowWidth - contentsWidth) / 2,
        leftPos = {
          title: windowDiff - diffBase + (diffBase - bgTitleWidth) / 2,
          leftContents: windowDiff - diffBase + (diffBase - bgContentsWidth) / 2,
          rightContents: windowDiff + contentsWidth + (diffBase - bgContentsWidth) / 2
        };
      return {
        title: {left: leftPos.title, top: bgTopPos[0]},
        contents: [
          {left: leftPos.leftContents, top: bgTopPos[1]},
          {left: leftPos.leftContents, top: bgTopPos[2]},
          {left: leftPos.rightContents, top: bgTopPos[0]},
          {left: leftPos.rightContents, top: bgTopPos[1]},
          {left: leftPos.rightContents, top: bgTopPos[2]}
        ]
      }

    }

    function positionData() {// window幅によって出したり出さなかったり
      windowWidth = $(window).width();
      var pos = contentsLeftPos(windowWidth),
        bgData = setTimeData(today),
        contentsData = bgData.contents,
        contentsLen = contentsData.length;

      if(windowWidth < contentsWidth){
        // 1000px未満の場合は設定削除
        $bgArea.css('background', '');
        if($('.js-bg-title').length > 0){
          $('.js-bg-title').remove();
          $('.js-bg-contents').remove();
        }

      } else if(windowWidth < bgWidth){
        // contents全部入らなかったら背景処理
        if($('.js-bg-title').length){
          // contentsあったら削除
          $('.js-bg-title').remove();
          $('.js-bg-contents').remove();
        }

        var bgText = '',
          bgTextBase = 'url(@) $1px $2px no-repeat,';

        for (var i = contentsLen - 1; i >=0; i--) {
          var text = bgTextBase.replace('@', contentsData[i].img)
                                .replace('$1', pos.contents[i].left)
                                .replace('$2', pos.contents[i].top);
          bgText += text;
        }
        bgText += bgTextBase.replace('@', bgData.title)
                            .replace('$1', pos.title.left)
                            .replace('$2', pos.title.top);

        bgText += 'url('+ bgData.bg +') top repeat-x';
        $bgArea.css('background', bgText);
      } else {
        // contents全部入るようだったらobjectにして配置
        // contentsなかったら入れる
        if(!$('.js-bg-title').length){
          var $title = $('<h2 class="js-bg-title" />')
          $contentsBase = $('<p class="js-bg-contents"><a /></p>'),
          contentsList = [];

          $title.append('<img src='+ bgData.title +'>');
          contentsList.push($title);
          $title.css({
            top: pos.title.top,
            left: pos.title.left
          })
          $bgArea.css('background', 'url('+ bgData.bg +') top repeat-x');
          for (var i = contentsLen - 1; i >=0; i--) {
            var $content = $contentsBase.clone();
            $content.find('a').append('<img src='+ contentsData[i].img +'>');
            $content.attr('data-num', i);
            $content.find('a').attr('href', contentsData[i].url);
            $content.css({
              top: pos.contents[i].top,
              left: pos.contents[i].left
            })
            contentsList.push($content);
          }
          $bgArea.append(contentsList);
        } else {
          // contentsあったら位置だけセット
          $('.js-bg-title').css({
            top: pos.title.top,
            left: pos.title.left
          });
          $('.js-bg-contents').each(function(i, content){
            var $content = $(content),
              index = parseInt($content.attr('data-num'));

            $content.css({
              top: pos.contents[index].top,
              left: pos.contents[index].left
            });
          });

        }
      }
    }
    // setTimeData()
    positionData();
    $(window).on('resize', positionData)
  }

  /* ------------------------------------------------------------------------------
   * get twitter data
  ------------------------------------------------------------------------------ */
var options = {
    method: "GET",
    apiURL: "https://api.twitter.com/1.1/friends/list.json",
    count: 10,
    consumerKey: "FEJXJJbzC9XE4W1GnHKbyzSue",
    consumerSecret: "ArbbpqCaOxKAEQ6xbb7P9WDxgx8yukDAeXdiPN2l1PKYTqbQSE",
    accessToken: "42576285-MwtV2XLgxr5d1NRjCiJci7SCVEitY4jkZEMjKByR3",
    tokenSecret: "2C08RqPUiCVBPwWX70jerlqOIv5EacF2WQLKVGTDVDXN1"
};
function getResult(data){
  console.log('data', data)
}
function getTwitter() {

    var accessor = {
        consumerSecret: options.consumerSecret,
        tokenSecret: options.tokenSecret
    };

    var message = {
        method: options.method,
        action: options.apiURL,
        parameters: {
            count: 1,
            oauth_version: "1.0",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: options.consumerKey,
            oauth_token: options.accessToken,
            callback: "getResult",
        }
    };
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var url = OAuth.addToURL(message.action, message.parameters);

    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      jsonp: 'jsoncallback',
      cache: true,
      url: url
    });
}



  getTwitter()
  /* ------------------------------------------------------------------------------
   * display calendar
  ------------------------------------------------------------------------------ */
  function setToday() {
    var $calendarTarget = $('[data-func="displayToday"]'),
      $dayBase = $('<span class="text-day" />')
      month = today.getMonth() + 1,
      date = today.getDate(),
      dayList = ['日', '月', '火', '水', '木', '金', '土'],
      day = dayList[today.getDay()],
      dayText = month + '/' + date;
    $calendarTarget.text(dayText);
    $dayBase.text(day);
    $calendarTarget.append($dayBase);
  }

  /* ------------------------------------------------------------------------------
   * get weather data
  ------------------------------------------------------------------------------ */
  function getWeatherData($data) {
    // console.log('data', $data)
    var $targetDom = $('[data-func="displayWeather"]'),
      weatherList = {},//あとで
      str = $data.find('description').text();
    $targetDom.text(str);
  }
  /* ------------------------------------------------------------------------------
   * display recommend contents
  ------------------------------------------------------------------------------ */
  // 表示
  function displayRecommendContents(tabId){
    var $targetArea = $('[data-contents="recommendContents"]'),
      $tmpl = $('#recommend-contents-tmpl'),
      tab = tabId ? tabId : 0,
      displayMax = 6;

    targetData = {};
    if(!contentsData[tab]) {
      targetData.recommendData = [];
    } else if(contentsData[tab].length < 10){
      targetData.recommendData = contentsData[tab]
    } else {
      targetData.recommendData = contentsData[tab].slice(0, 10);
    }
    $targetArea.fadeOut(200,function(){
      $targetArea.html('');
      $tmpl.tmpl(targetData).appendTo($targetArea);
      $targetArea.fadeIn(200);

      var $targetLi = $targetArea.find('li'),
      $moreBtn = $targetArea.find('.contents-more');
      // 画像のloadとli自体の表示
      $targetLi.each(function(i, li){
        var $li = $(li),
        $img = $li.find('img');
        if(i < displayMax){
          $img.attr('src', $img.attr('data-src')).removeAttr('data-src');
        } else {
          $li.hide();
        }
      })
      // ボタンの表示とclick動作
      if($targetLi.length >= displayMax) {
        $moreBtn.on('click', function(e){
          e.preventDefault();
          var $hiddenList = $targetLi.find('[data-src]');
          $hiddenList.each(function(i, img){
            var $img = $(img);
            $img.attr('src', $img.attr('data-src')).removeAttr('data-src');
          })
          $targetLi.slideDown();
          $moreBtn.remove();
        });
      } else {
        $moreBtn.remove();
      }
    })
  }

  // お勧めコンテンツのデータを取得
  function setRecommendData(recommendContnts){
    var displayContents = {};
    recommendContnts.forEach(function(data, i){
      var start = {
        year: data.display_date_from_year,
        month: parseInt(data.display_date_from_month, 10) - 1,
        day: data.display_date_from_day,
        hour: data.display_time_from_hour,
        minute: data.display_time_from_minute
      },
      end = {
        year: data.display_date_to_year,
        month: parseInt(data.display_date_to_month, 10) - 1,
        day: data.display_date_to_day,
        hour: data.display_time_to_hour,
        minute: data.display_time_to_minute
      },
      startDay = new Date(start.year, start.month, start.day, start.hour,start.minute),
      endDay = new Date(end.year, end.month, end.day, end.hour, end.minute),
      formatData = {},
      thumb = function(){
        if(data.contents_image){
          return imgDirBase.recommendContents + data.contents_image_dir + data.contents_image;
        } else {
          return imgDirBase.program + data.program_image_dir + data.program_logo_image;
        }
      },
      url = function(){
        if(data.contents_url){
          return data.contents_image;
        } else if(data.program_site_url) {
          return data.program_site_url;
        } else {
          return false;
        }
      };

      // 該当するものだけ送ってくれるそう。
      // if(today >= startDay && today <= endDay){
      // カテゴリごとに配列にして突っ込む。
      if(!contentsData[data.contents_category_id]){
        contentsData[data.contents_category_id] = [];
      }
      formatData.startyear = startDay.getFullYear();
      formatData.startmonth = startDay.getMonth() + 1;
      formatData.startdate = startDay.getDate();
      formatData.startday = dayList[startDay.getDate()];
      formatData.starthour = startDay.getHours();
      formatData.startminute = startDay.getMinutes();
      formatData.title = data.contents_title;
      formatData.description = data.contents_description;
      formatData.url = url;
      formatData.thumb = thumb;
      // contentsDataに突っ込む。1originなので0には書き込みしない。
      contentsData[data.contents_category_id].push(formatData);
    });
    displayRecommendContents();
  }

  // webnewsのデータを取得
  function setWebnewsData(webnews){
    var webnewsData = [];
    $(webnews).find('item').each(function(i, item){
      var $news = $(item),
        data = {},
        startDay = new Date($news.find('date').text());
      if($news.find('GENRE').text() !== 'other'){
        data.startyear = startDay.getFullYear();
        data.startmonth = startDay.getMonth() + 1;
        data.startdate = startDay.getDate();
        data.startday = dayList[startDay.getDay()];
        data.starthour = startDay.getHours();
        data.startminute = startDay.getMinutes();
        data.title = $news.find('title').text();
        data.url = $news.find('link').text();
        data.thumb = $news.find('image').text();
        webnewsData.push(data);
      }
    })
    // contentsDataの[0]に突っ込む。
    contentsData[0] = webnewsData;

  }
  /* ------------------------------------------------------------------------------
   * display contents news
  ------------------------------------------------------------------------------ */
  function displayContentsNews(contentsNews){
    var $targetArea = $('[data-contents="contentsNews"]'),
      $tmpl = $('#contents-news-tmpl'),
      data = {},
      newsData = [];
    // order通りに並べ替え
    var setNew = function(updateDay){
      var limit = new Date(updateDay.getFullYear(), updateDay.getMonth(), updateDay.getDate() + 7);
      if(today <= limit){
        return 'new';
      } else {
        return false;
      }
    },
    setMonth = function(updateDay){
      return updateDay.getMonth() + 1;
    },
    setUrl = function(data){
      if(data.contents_url){
        return data.contents_url;
      } else if(data.program_site_url){
        return data.program_site_url;
      } else {
        return false;
      }
    },
    setImg = function(data){
      if(data.contents_image){
        return data.contents_image;
      } else if(data.program_logo_image){
        return data.program_logo_image;
      } else {
        return noImg;
      }
    };
    contentsNews.forEach(function(item, i){
      newsData[item.display_order] = item;
    });
    // data内の画像データ・URLの整理整頓
    newsData.forEach(function(data, i){
      // console.log('data', data)
      var content = {},
        updateDay = new Date(data.update_date_year, data.update_date_month - 1, data.update_date_day);
      if(today < updateDay){
        newsData[i] = false;

      } else {
        content.title = data.contents_title;
        content.isNew = setNew(updateDay);
        content.upateYear = data.update_date_year;
        content.upateMonth = setMonth(updateDay);
        content.updateDate = data.update_date_day;
        content.updateDay = dayList[updateDay.getDay()];
        content.linkUrl = setUrl(data);
        content.image = setImg(data);
        content.title = data.contents_title;
        content.description = data.contents_description;
        newsData[i] = content;
      }
    })
    // array内のfalseを取り除く
    data.newsData = _.compact(newsData);
    $tmpl.tmpl(data).appendTo($targetArea);
  }
	/* ------------------------------------------------------------------------------
	 * abciee area
	------------------------------------------------------------------------------ */
	function setBgAbciee($targetArea, diffW) {
		var maxRatio = 8,
			minRatio = 3,
			$abcieeImgBase = $('<div class="js-img-bubble"><img /></>'),
			abcieeCount = 8,
			targetTop = 200,
			maxBubble = 187,
			targetHeight = $targetArea.height() - targetTop;
		if(diffW < maxBubble){
			maxBubble = diffW;
		}
		for (var i = 1; i <= abcieeCount; i++) {
			var $abcieeImg = $abcieeImgBase.clone(),
				abcieeSize = Math.floor(maxBubble * (getRandom(minRatio, maxRatio) / 10)),
				topCount = Math.floor(i / 2) + i % 2,
				top = getRandom((targetHeight / (abcieeCount / 2)) * (topCount - 1) + (abcieeSize), (targetHeight / (abcieeCount / 2)) * topCount - (abcieeSize)),
				left = getRandom( diffW - maxBubble, (diffW - abcieeSize) / 2);

			$abcieeImg.find('img').attr('src', 'img/bubble-abciee' +i+ '.png');
			$abcieeImg.css({
				position: 'absolute',
				top: targetTop + top,
				width: abcieeSize,
				height: abcieeSize
			});
			if(i % 2){
				$abcieeImg.css({
					left: left
				})
			} else {
				$abcieeImg.css({
					right: left
				})
			}
			$targetArea.append($abcieeImg);
		}
	}

	/* ------------------------------------------------------------------------------
	 * bubbleup abciee
	------------------------------------------------------------------------------ */
	function bubbleupAbciee(diffW, num){
		var $baseImg = $('<div class="js-bubbleup"><img src="img/bubble-abciee'+ num +'.png"></div>'),
			lr = getRandom(100, 0) % 2,
			minRatio = 5,
			maxRatio = 5,
			maxBubble = 187,
			size = Math.floor(diffW * (getRandom(minRatio, maxRatio) / 10)),
			left = getRandom(diffW - maxBubble, (diffW - size) / 2);
		if(diffW > maxBubble){
			size = Math.floor(maxBubble * (getRandom(minRatio, maxRatio) / 10));
		}
		$baseImg.css({
			width: size,
			height: size,
			top: $(window).height()
		})
		if(lr){
			$baseImg.css({
				left: left
			})
		} else {
			$baseImg.css({
				right: left
			})
		}
		$baseImg.on('click', function(e){
			sparkBubble($(this), e)
		});
		$('body').append($baseImg);

		var bubbleTime = getRandom(300, 3) * 1000;// 再度設定。
		setTimeout(bubbleupAbciee, bubbleTime, ($targetAbcieeArea.width() - $targetMainArea.width()) / 2, 1)
	}
	function sparkBubble(target, e){
		var $target = $(target),
			$scrollToTarget = $('[data-func="bg-abciee"]'),
			pos = {
				x: e.clientX,
				y: e.clientY - 30
			},
			$sparticleBase = $('<span class="js-spark" />');
			particleCount = getRandom(30, 20),
			sparkSize = 50,
			count = particleCount;
		$sparticleBase.css({
			top: pos.y + 'px',
			left: pos.x + 'px',
		})

		for (var i = 0; i < particleCount; i++) {
			var $particle = $sparticleBase.clone(),
			deg = getRandom(360, 0),
			particleSize = getRandom(15, 5),
			rad = deg * (Math.PI / 180),
			cos = Math.cos(rad),
			sin = Math.sin(rad);

			$particle.attr({
				'data-end-x': pos.x + Math.floor(cos * sparkSize),
				'data-end-y': pos.y + Math.floor(sin * sparkSize),
				'data-size': particleSize
			});
			$('body').append($particle);
			$target.animate({
				opacity: 0
			}, 300, function(){
				$(this).remove();
			});
		}
		setTimeout(function(){
			$('.js-spark').each(function(i, particle){
				$(particle).css({
					left: $(particle).attr('data-end-x') + 'px',
					top: $(particle).attr('data-end-y') + 'px',
					width: $(particle).attr('data-size'),
					height: $(particle).attr('data-size'),
					opacity: 0
				});

			})
			setTimeout(function(){
				$('.js-spark').remove();
				// $('body').animate({scrollTop: $scrollToTarget.offset().top})
			}, 500)
		}, 100)
	}
  ////////////////////////    load    ////////////////////////////
  getData(urlList.frontendData).done(function(data){
    itemSlide(data.slideArea);
    settingBg(data.bgArea);
  }).fail(function(error){
    alert('ページが読み込めませんでした。再度読み込みしてください。')
  })
  getData(urlList.weather).done(function(data){
    // getWeatherData()
    var $item = $(data).find('item'), $target;
    $item.each(function(i, item){
      var stringArray = $(item).find('title').text();
      if(stringArray === '大阪'){
        $target = $(item);
      }
    })
    getWeatherData($target);
  }).fail(function(error){
    // 代替コンテンツへのリンクでも貼ろうかね。
  })

  // まず番組とIDの紐付けを呼び出し
  getData(urlList.programName).done(function(nameId){
    var nameId = _.indexBy(nameId, makeList);
    // console.log(nameId[105])
    getData(urlList.programInfo).done(function(programInfo){
    })

    // webnewsを先に呼び出してデータを捕獲。
    getData(urlList.webnews).done(function(webnews){
      setWebnewsData(webnews);
      // おすすめコンテンツデータを呼び出してデータを捕獲。
      getData(urlList.recommendContents).done(function(recommendContents){
        // データがそろそろ一本化されてるので表示にまわす。
        setRecommendData(recommendContents);
      }).fail(function(error){});
    }).fail(function(error){});

    // コンテンツニュースを呼び出して表示にまわす。
		getData(urlList.contentsNews).done(function(contentsNews){
			displayContentsNews(contentsNews);
		}).fail(function(error){});
  }).fail(function(error){
    console.log(error)
  })

  setToday();
  $('.recommend-category').on('click', function(e){
    e.preventDefault();
    var index = $('.recommend-category').index(this);
    $('.recommend-category.current').removeClass('current');
    displayRecommendContents(index);
    $(this).addClass('curernt');

  })
	/* ------------------------------------------------------------------------------
	 * mouse over
	------------------------------------------------------------------------------ */
  $('.js-hover-on').on({
    mouseover: function(){
      $(this).find('img').attr('src', $(this).find('img').attr('src').replace('.png', '-on.png'))
    },
    mouseout: function(){
      $(this).find('img').attr('src', $(this).find('img').attr('src').replace('-on.png', '.png'))
    }
  })

	/* ------------------------------------------------------------------------------
	 * settings bubble abciee
	------------------------------------------------------------------------------ */
	var $targetAbcieeArea = $('[data-func="bg-abciee"]'),
		$targetMainArea = $targetAbcieeArea.find('.wrap-contents'),
		targetTopPos = $targetAbcieeArea.offset().top,
		hasBubble = false;

	$(window).on('scroll', function(e){
		var scrollbottom = $('body').scrollTop() + $(window).height(),
			diffW = ($targetAbcieeArea.width() - $targetMainArea.width()) / 2;
		if(scrollbottom > targetTopPos && diffW > 100 && !hasBubble){
			setBgAbciee($targetAbcieeArea, diffW)
			hasBubble = true;
		}

	})

	var bubbleTime = getRandom(300, 3) * 1000;// 仮
	console.log('bubbleTime', bubbleTime)
	setTimeout(bubbleupAbciee, bubbleTime, ($targetAbcieeArea.width() - $targetMainArea.width()) / 2, 1)

})
