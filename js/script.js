var iOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/);
var UseCanLocalstorage = (typeof(Storage) !== "undefined") ? true : false;
var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || false;
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;

var source;

var wave_speed = 0;
var wave_height = 10;
var wid = 0;
var myAarray = new Array;
var myAarray2 = new Array;
var globCount=0.1;
var fbc_array = new Array;
var wave_front_fbc = wave_ship_fbc = wave_back_fbc = hotballoon_fbc= 0;
var canvas_wave, ctx_wave;
var canvas_wave_back, ctx_wave_back;
var canvas_flame, ctx_flame;


var gap = 0;
var prevscrollPos = 0;
var scrollPos = 0; //스크롤 값 가져오려고
var currentSection = 0; //현재 보고 있는 섹션값 정의 - 스크롤시 정의함
var sectionAnimate = new Array; //해당 섹션이 애니메이션 되고 있는지

var musicBuffer = new Array;
var context = new AudioContext();
var totalAudio = 1;
var loadedAudio = 0;
var soundPlayed = false;
var req = []; //애니메이션 프레임들을 담을 배열

var deviceGamma = 90;
function init(){
      $('#mainnav').hide();
      loadSoundFile({
            // mp3 : 'https://dl.dropbox.com/s/3hsmvmiu37c7txb/moonmoon.mp3',
            // m4a : 'https://dl.dropbox.com/s/xay5gbmy9hrdkhd/moonmoon.m4a',
            // ogg : 'https://dl.dropbox.com/s/vhwp9ur73juzemp/moonmoon.ogg'
            mp3ios : './audio/moonmoon_ios.mp3',
            mp3 : './audio/moonmoon_ios.mp3',
            m4a : './audio/moonmoon.m4a',
            ogg : './audio/moonmoon.ogg'
      }, 99);
      setCanvas();
}
init();

function setCanvas(){
      canvas_wave = document.getElementById("sea-front")
      ctx_wave = canvas_wave.getContext("2d");
      canvas_wave_back = document.getElementById("sea-back")
      ctx_wave_back = canvas_wave_back.getContext("2d");
      canvas_flame = document.getElementById("flame");
      ctx_flame = canvas_flame.getContext("2d");
      introLooper();
}

function clearLooper(arrayNum){
      for(var i=0; i < arrayNum.length; i++){
            // console.log(arrayNum[i])
            if(sectionAnimate[arrayNum[i]]){
                  window.cancelAnimationFrame(req[arrayNum[i]]);
                  sectionAnimate[arrayNum[i]] = false;
            }
      }
}

function loadSoundFile(url, index) {
      // sessionStorage.clear();
      var myAudio = document.createElement('audio');
      if (myAudio.canPlayType('audio/mpeg')) {
            var getAudio =  url.mp3;
            if(iOS && url.mp3ios){
                  getAudio =  url.mp3ios;
            }
      }else if (myAudio.canPlayType('audio/mp4')) {
            var getAudio =  url.m4a;
      }else if (myAudio.canPlayType('audio/ogg')) {
            var getAudio =  url.ogg;
      }else{
            var getAudio =  url.mp3;
      }
      source = context.createBufferSource();
      // var request = new XMLHttpRequest();
      // request.open('GET', getAudio, true);
      // request.responseType = 'arraybuffer';
      // console.log(localStorage.getItem("bgm").length)

      function loadAudio(){
            fetch(getAudio).then(function(res) {
                  return res.arrayBuffer();

            }).then(function(buffer){
                  context.decodeAudioData(buffer, function(decodedData) {
                        loadedAudio++;
                        musicBuffer[index] = decodedData;
                        $('#mainnav').show();
                  }, function(error){
                        console.log(error)
                  });
            });
      };
      //fn loadAudio

      if(UseCanLocalstorage){
             if(sessionStorage.getItem(String('sound'+index))){
                  //  $('#console').text('불러오기' + (String('sound'+index)));
                   var reReadItem = JSON.parse(sessionStorage.getItem(String('sound'+index)));
                   fetch(reReadItem.src).then(function(res) {
                        return res.arrayBuffer();
                  })
                  .then(function(buffer){
                        context.decodeAudioData(buffer, function(decodedData) {
                              // console.log(buffer)
                              loadedAudio++;
                              musicBuffer[index] = decodedData;
                              $('#mainnav').show();
                        }, function(error){
                              console.log(error)
                        });
                  });
            }else{
                  // $('#console').text('저장1 ' + getAudio);
                  loadAudio();
                  fetch(getAudio).then(function(res) {
                        res.blob().then(function(blob) {
                              var size = blob.size;
                              var type = blob.type;
                              var reader = new FileReader();
                              reader.addEventListener("loadend", function() {
                                    var base64FileData = reader.result.toString();
                                    var mediaFile = {
                                          fileUrl: getAudio,
                                          size: blob.size,
                                          type: blob.type,
                                          src: base64FileData
                                    };
                                    sessionStorage.setItem(String('sound'+index), JSON.stringify(mediaFile));
                                    // $('#console').text('저장2 ' + getAudio);
                              });
                              reader.readAsDataURL(blob);
                        });
                  });
            }
      }else{
            loadAudio();
            // fetch(getAudio).then(function(res) {
            //       return res.arrayBuffer();
            //
            // }).then(function(buffer){
            //       context.decodeAudioData(buffer, function(decodedData) {
            //             loadedAudio++;
            //             musicBuffer[index] = decodedData;
            //             $('#mainnav').show();
            //       }, function(error){
            //             console.log(error)
            //       });
            // });



            // request.onload = function() {
            //       var audioData = request.response;
            //       // console.log(audioData)
            //       context.decodeAudioData(request.response, function(buffer) {
            //             console.log(buffer)
            //             // console.log('저장')
            //             // var base64 = btoa(  new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            //             // var base64 = atob(buffer)
            //             // sessionStorage.setItem("bgm", base64);
            //             loadedAudio++;
            //             musicBuffer[index] = buffer;
            //             $('#mainnav').show();
            //       }, function(error){
            //             console.log(error)
            //       });
            // }
      };
      //onload
      // request.send();
}


function playSound(buffer) {
      source.buffer = buffer;
      source.connect(context.destination);
      analyser = context.createAnalyser();
      source.connect(analyser);
      source.loop = true;
      fbc_array = new Uint8Array(analyser.frequencyBinCount);
      source.start(0);
      soundPlayed = true;
}


$('#mainnav').on('click', function(event){
      playSound(musicBuffer[99]); //99번은 배경음
      alwaysLooper();
});

/***** alwaysLooper ***********************************************************/
function alwaysLooper(){
      req[99] = window.requestAnimationFrame(alwaysLooper); //99는 배경음 _ 상주 플레이
      if(fbc_array ==undefined || fbc_array =='' || soundPlayed == false){
            fbc_array[10] = fbc_array[15] = 0;
            //햄버거 메뉴에 있는 막대
      }else{
            analyser.getByteFrequencyData(fbc_array);
            wave_front_fbc = wave_ship_fbc = fbc_array[5];
            wave_back_fbc = fbc_array[26];
            hotballoon_fbc = fbc_array[80];
      }
      for (var i = 0; i < 2; i++){
            $('.blackbar').eq(i).find('>div').width(fbc_array[10+(i*5)] / 2.8 + '%');
      }
      $('.masktitle').height(fbc_array[10] / 3 + '%');

}
//fn.alwaysLooper

/***** introLooper ***********************************************************/
function introLooper() {
      sectionAnimate[0] = true;
      req[0] = window.requestAnimationFrame(introLooper);
      ctx_wave.clearRect(0, 0, canvas_wave.width, canvas_wave.height);
      ctx_wave_back.clearRect(0, 0, canvas_wave_back.width, canvas_wave_back.height);
      canvas_wave.width = window.innerWidth;
      canvas_wave_back.width = window.innerWidth;

      var withi = window.innerWidth/5;
      var counter = 0;
      var xMove=0;
      var increase = Math.PI /90+wid;

      for ( var i = 0; i <=withi; i ++ ){
		var x = i;
		var y = Math.sin(counter+globCount);
            var y2 = Math.sin(counter+globCount*2);
		counter += increase;
		var pp =80+ (wave_back_fbc / -15)+y*(wave_height+(wave_back_fbc / 20)); //뒤 웨이브
            var pp2 =100+(wave_front_fbc / -8) +y2*(wave_height); //앞 웨이브
		if(myAarray[i]==undefined || myAarray[i]=='' ){
			myAarray[i]=ctx_wave_back;
		}
            if(myAarray2[i]==undefined || myAarray2[i]=='' ){
			myAarray2[i]=ctx_wave;
		}

		myAarray[i].beginPath();
		myAarray[i].lineWidth="20";
		myAarray[i].strokeStyle="rgba(4, 0, 55, 1)"; //뒤컬러
		myAarray[i].moveTo(5+xMove,canvas_wave_back.height);
		myAarray[i].lineTo(5+xMove,pp+10);
		myAarray[i].stroke();

            myAarray2[i].beginPath();
		myAarray2[i].lineWidth="20";
		myAarray2[i].strokeStyle="rgba(6, 0, 78, 0.8)"; //앞컬러
		myAarray2[i].moveTo(0+xMove,canvas_wave.height);
		myAarray2[i].lineTo(0+xMove,pp2+10);
		myAarray2[i].stroke();
		xMove+=5;
	}
      //for

      var rotateV = 10+Math.cos(counter+globCount);
      $('.ship > img').css({
            // 'bottom' : (0+(wave_ship_fbc / 16)+y*(wave_height)) + 'px',
            '-webkit-transform' : 'rotate(' + rotateV + 'deg) translateY(' + (0+(-wave_ship_fbc / 16)+y*(wave_height)) + 'px)',
            '-moz-transform' : 'rotate(' + rotateV + 'deg) translateY(' + (0+(-wave_ship_fbc / 16)+y*(wave_height)) + 'px)',
            '-ms-transform' : 'rotate(' + rotateV + 'deg) translateY(' + (0+(-wave_ship_fbc / 16)+y*(wave_height)) + 'px)',
            '-o-transform' : 'rotate(' + rotateV + 'deg) translateY(' + (0+(-wave_ship_fbc / 16)+y*(wave_height)) + 'px)',
            'transform' : 'rotate(' + rotateV + 'deg) translateY(' + (0+(-wave_ship_fbc / 16)+y*(wave_height)) + 'px)'
      });

	globCount += 0.04 + wave_speed;
}
//fn. introLooper

/***** workLoop ***********************************************************/
function Particle(x, y, xs, ys, lifeup) {
      this.x=x;
      this.y=y;
      this.xs=xs;
      this.ys=ys;
      this.lifeup = lifeup;
      this.life=0;
}
var particles = [];
var max =30;
var speed=5;
var size=25;
var countDown = 0;
function workLoop(){
      canvas_flame.height = canvas_flame.width = $('.moon-2Wrap').width()*0.08;
      sectionAnimate[1] = true;
      req[1] = window.requestAnimationFrame(workLoop);
      ctx_flame.clearRect(0, 0, canvas_flame.width, canvas_flame.height);
      ctx_flame.globalCompositeOperation="screen";
      for (var i=0; i<3; i++) {
            var p = new Particle(canvas_flame.width*0.4 + Math.random()*(canvas_flame.width*0.2), canvas_flame.height-5, (Math.random()*2*speed-speed)/50, 0-Math.random()*0.4*speed, 1);
            particles.push(p);
      }

      for (var i=0; i<particles.length; i++) {
            ctx_flame.fillStyle = "rgba("+(260-(particles[i].life*2))+","+((particles[i].life*2)+50)+","+(particles[i].life*2)+","+(((max-particles[i].life)/max)*0.2)+")";
            ctx_flame.beginPath();
            ctx_flame.arc(particles[i].x,particles[i].y,(max-particles[i].life)/max*(size/5)+(hotballoon_fbc / 1.5)*0.05, 0 , 2*Math.PI);
            ctx_flame.fill();

            particles[i].x+=particles[i].xs;
            particles[i].y+=particles[i].ys;
            particles[i].life += particles[i].lifeup;
            if (particles[i].life >= max) {
                  particles.splice(i, 1);
                  i--;
            }
      }
      //for

      $('.moon-hit').css({
            'opacity' : (hotballoon_fbc / 1.5)*0.01 + 0.3
      });

      gap = scrollPos - prevscrollPos;
      prevscrollPos = scrollPos;
      var moveMoon2 =  Math.abs(gap*0.3) < 30 ? gap*0.3 : gap < 0 ? -30 : 30;
      var moveMoon2_y = Math.floor(Math.cos(countDown++*0.02)*50);

      // console.log(countDown)
      // cosnsole.log(Math.sin(90 * Math.PI / 180.0))
      if($('#work').find('.forfixed').hasClass('fixed')){
            $('.moon-2').css({
                  '-webkit-transform' : 'translateX(' + (gap*-1)+ 'px) translateY(' + moveMoon2_y + 'px) rotate(' + moveMoon2 + 'deg)',
                  '-moz-transform' : 'translateX(' + (gap*-1)+ 'px) translateY(' + moveMoon2_y + 'px) rotate(' + moveMoon2 + 'deg)',
                  '-ms-transform' : 'translateX(' + (gap*-1)+ 'px) translateY(' + moveMoon2_y + 'px) rotate(' + moveMoon2 + 'deg)',
                  '-o-transform' : 'translateX(' + (gap*-1)+ 'px) translateY(' + moveMoon2_y + 'px) rotate(' + moveMoon2 + 'deg)',
                  'transform' : 'translateX(' + (gap*-1)+ 'px) translateY(' + moveMoon2_y + 'px) rotate(' + moveMoon2 + 'deg)'
            });
      }
      var moveflame = Math.abs(gap*0.3) < 20 ? gap*0.3 : gap < 0 ? -20 : 20;
      $('#flame').css({
            '-webkit-transform' : 'rotate(' + (gap*-0.3)%20 + 'deg)',
            '-moz-transform' : 'rotate(' + (gap*-0.3)%20 + 'deg)',
            '-ms-transform' : 'rotate(' + (gap*-0.3)%20 + 'deg)',
            '-o-transform' : 'rotate(' + (gap*-0.3)%20 + 'deg)',
            'transform' : 'rotate(' + (gap*-0.3)%20 + 'deg)'
      });

      if(gap !== 0){
            //스크롤링 상태
            // if($('.moon-2Wrap').hasClass('motion'))$('.moon-2Wrap').removeClass('motion');
      }else{
            //스크롤링이 아닐 때
            if(countiamLoop < 50){
                  countiamLoop++;
                  if(countiamLoop >= 50){
                        countiamLoop = 0;
                        // $('.moon-2Wrap').addClass('motion');
                  }
            }
      }
}
// fn workLoop

/***** iamLoop ***********************************************************/

var countiamLoop = 0;
var prevrotateXval = 0;
function iamLoop(){
      sectionAnimate[2] = true;
      req[2] = window.requestAnimationFrame(iamLoop);
      gap = scrollPos - prevscrollPos;
      prevscrollPos = scrollPos;
      var rotateXval = (Math.abs(gap*1) < 6) ? gap*1 : gap < 0 ? -6 : 6 ;
      // console.log(rotateXval)
      // $('.inphoto, .line > img').each(function(index){
      //       var $this = $(this);
      //       var zPos = $this.hasClass('box') ? 40 : 0;
      //       var xGamma = $this.hasClass('box') ? (deviceGamma-90)*0.5 : 0;
      //       $this.css({
      //             '-webkit-transform' : 'rotateX( ' + rotateXval + 'deg) translateX(' +  xGamma + 'px) translateZ(' +  zPos + 'px)',
      //             'transform' : 'rotateX( ' + rotateXval + 'deg)  translateX(' +  xGamma + 'px) translateZ(' +  zPos + 'px)'
      //       });
      // });
      // $('.line > img').each(function(index){
      //       var $this = $(this);
      //       var xGamma = $this.hasClass('box') ? (deviceGamma-90)*0.5 : 0;
      //       $this.css({
      //             '-webkit-transform' : 'translateX(' +  xGamma + 'px)',
      //             'transform' : ' translateX(' +  xGamma + 'px)'
      //       });
      // });
      // if(gap == 0 && countiamLoop < 50){
      //       countiamLoop++;
      //       if(countiamLoop >= 50){
      //             countiamLoop = 0;
      //             clearLooper([2]);
      //       }
      // }
}

$(document).ready(function(){
      var stars=50;
      var $stars=$(".stars");
      var iosheight = $(window).height();

      if(iOS){
            function iosVhHeightBug() {
                  iosheight = $(window).height();
                  $('#intro, #work .forfixed').height(iosheight);

            }
            iosVhHeightBug();
            $(window).bind('resize', iosVhHeightBug);
      }
      //IOS 창크기 재정의

      for(var i=0;i < stars; i++){
            $('<div class="star particle-'+i+'"></div>').appendTo($stars.eq(i%2));
        }
        //make stars

      // $('#iam').height($('.sky3').height()+128);


        var workFixed = false;
        var iamFixed = false;
        $('#work').height('6000px');
        $('#iam').height('4000px');


        $(window).scroll(function(){
             var nextOffSet = [
                   $('#work').offset().top,
                   $('.forCloud').offset().top,
                   $('#iam').offset().top,
                   $('#end').offset().top,
                   $('#contact').offset().top
             ];
             scrollPos = $(window).scrollTop();
            //  gap = scrollPos - prevscrollPos;
            //  prevscrollPos = scrollPos;
            //  console.log('s' + gap);
            if(scrollPos < 0){
                  return false;
            }


            /***** work  - 픽스 레이어 ***********************************************************/
            if(nextOffSet[0] <= scrollPos && nextOffSet[2] > scrollPos-128){
                  //128숫자는 #iam 안의 구름 때문에
                  if(!workFixed){
                        //work섹션 y 좌표값이 스크롤링값보다 작으면(위로 넘어가면)
                        workFixed = true;
                        $('#work .forfixed').addClass('fixed');
                        // $('#work').height('3000px');
                  }
                  $('.cloud-front, .cloud-dep').css({
                        'background-position' : scrollPos * -0.5 + 'px'+' 100%'
                  });
                  $('.cloud-back').css({
                        'background-position' : scrollPos * -0.2 + 'px'+' 100%'
                  });
            }else{
                  workFixed = false;
                  $('#work .forfixed').removeClass('fixed');
                  // $('#work').height('100%');
            }


            /***** iam  - 픽스 레이어 ***********************************************************/
            // var forCloudHeight = 100; // #iam 앞에 구름 간격을 줘서 디텍트 영역도 수정해주려고 정의 해놓음
            var rangeOfiam =  (nextOffSet[3]- nextOffSet[2]); // #iam top+ (#end top - #iam top)
            var rangeOfiamPoint = [
                  nextOffSet[2] + (rangeOfiam*0.16),
                  nextOffSet[2] + (rangeOfiam*0.28),
                  nextOffSet[2] + (rangeOfiam*0.38),
                  nextOffSet[2] + (rangeOfiam*0.48),
                  nextOffSet[2] + (rangeOfiam*0.53)
            ];

            // if( rangeOfiam*0.6 > scrollPos && scrollPos >= nextOffSet[1]){
            if( nextOffSet[1] <=  scrollPos && scrollPos < rangeOfiamPoint[2]){
                  //iam의 0~60프로
                  $('#mainnav').addClass('dark');
            }else{
                  //iam의 60프로 이상
                  $('#mainnav').removeClass('dark');
            }
            // 네비 배경 어둡게 설정



            var moveMoon;
            var moonPosYnum = 400; // #iam 안의 달 상단 마진
            var maxBottom = 60;
            var moonMoveSpeed = 100;
            var currentScrollPercent = ((scrollPos-nextOffSet[2]) /($('#iam').height()-iosheight));
            currentScrollPercent = currentScrollPercent > 1 ? 1 : currentScrollPercent;
            // 0 ~1 까지 유효, 영역 : 시작 포인트 ~ 끝 포인트 - 높이
            var DownScrollPercent = ((scrollPos-rangeOfiamPoint[3]) /($('#iam').height()-iosheight));
            var MoonMargin = moonPosYnum - (scrollPos-nextOffSet[2])*0.5;
                  MoonMargin = MoonMargin > 200 ? MoonMargin : 200;
            if(nextOffSet[2] <= scrollPos && scrollPos < nextOffSet[3] - iosheight){
                  iamFixed = true;
                  $('#iam .forfixed').height(iosheight).addClass('fixed');
                  moveMoon = (100- DownScrollPercent*moonMoveSpeed) > 100 ? '100%' :  ((100- DownScrollPercent*moonMoveSpeed < maxBottom ) ? maxBottom : 100- DownScrollPercent*moonMoveSpeed) + '%';
            }else{
                  iamFixed = false;
                  $('#iam .forfixed').height($('#iam').height()).removeClass('fixed');
                  moveMoon = (iosheight * maxBottom)/100+ 'px';
            }
            if(nextOffSet[2] <= scrollPos && scrollPos < nextOffSet[3]){
                  $('.moon-3').css({
                        'margin-bottom' : -MoonMargin + 'px',
                        'bottom' : moveMoon
                  }).find('img.grey').css({
                        '-webkit-clip-path' : 'circle(60% at '+ (200-currentScrollPercent*1.5 *500)+ '% ' + (100-currentScrollPercent*1.5*200)+ '%)',
                        'clip-path' : 'circle(60% at '+ (200-currentScrollPercent*1.5 *500)+ '% ' + (100-currentScrollPercent*1.5*200)+ '%)'
                  });

                  if(nextOffSet[2] <= scrollPos  &&scrollPos < rangeOfiamPoint[0]){
                        $('#iam').removeClass('step2 step3 step4 step5 step6');
                  }else if(rangeOfiamPoint[0] <= scrollPos && scrollPos < rangeOfiamPoint[1]){
                        //step2
                        $('#iam').removeClass('step3 step4 step5 step6').addClass('step2');
                  }else if(rangeOfiamPoint[1] <= scrollPos && scrollPos < rangeOfiamPoint[2]){
                        //step3
                        $('#iam').removeClass('step2 step4 step5 step6').addClass('step3');
                  }else if(rangeOfiamPoint[2] <= scrollPos && scrollPos < rangeOfiamPoint[3]){
                        //step4
                        $('#iam').removeClass('step2 step3 step5 step6').addClass('step4');
                  }else if(rangeOfiamPoint[3] <= scrollPos && scrollPos < rangeOfiamPoint[4]){
                        //step5
                        $('#iam').removeClass('step2 step3 step4 step6').addClass('step5');
                  }else if(rangeOfiamPoint[4] <= scrollPos){
                        //step6
                        $('#iam').removeClass('step2 step3 step4 step5').addClass('step6');
                  }

                  // if(rangeOfiamPoint[1] <= scrollPos ){
                  //       var h = ((scrollPos - rangeOfiamPoint[1])*0.4);
                  //       $('#iam .line').show().height( h + 'px');
                  //
                  //       if(scrollPos > rangeOfiamPoint[2]){
                  //             $('#iam .line').css({
                  //                   'margin-bottom' : (scrollPos - rangeOfiamPoint[2]) + 'px'
                  //             });
                  //       }else{
                  //             $('#iam .line').css({
                  //                   'margin-bottom' : (-MoonMargin+1) + 'px',
                  //                   'bottom' : moveMoon
                  //             });
                  //       }
                  // }else{
                  //       $('#iam .line').hide( );
                  // }
            }else{
                  // $('#iam .line').hide( );
                  $('.moon-3').css({
                        'margin-bottom' : -(moonPosYnum) + 'px',
                        'bottom' : '100%'
                  });
                  // $('#mainnav').removeClass('dark');
                  $('.moon-3').find('img.grey').css({
                        '-webkit-clip-path' : 'circle(60% at 187% 95%)',
                        'clip-path' : 'circle(60% at 187% 95%)'
                  });
                  // $('#work').height('100%');
            }


            // if(scrollPos >= nextOffSet[3]-iosheight){
            //       var rangeNum =  nextOffSet[3]-iosheight - scrollPos;
            //       var rangePercent = 1-Math.abs(rangeNum/iosheight);
            // }else{
            // }

/*************************** 스크롤 액션 ********************************************/

            if(scrollPos < nextOffSet[0]){
                  // currentSection = 0;
                  if(sectionAnimate[0] == false || sectionAnimate[0] == undefined )introLooper();
                  for( var i = 0; i <= 13; i++){
                       var moveY = -0.05;
                             $('#intro').find('.depth-' + i).css({
                                   '-webkit-transform' : 'translateY( ' + (scrollPos* (i * moveY)) + 'px' + ')',
                                   'transform' : 'translateY( ' + (scrollPos* (i * moveY)) + 'px' + ')',
                                   '-webkit-transition' : '0.2s',
                                   'transition' : '0.2s',
                                   '-webkit-transition-timing-function' : 'ease-out',
                                   'transition-timing-function' : 'ease-out'
                             });
                 }
                 //for
           }else{
                 clearLooper([0]);
           }
           //--------------------------------------------------- intro 스크롤 액션

            if(nextOffSet[0] < 400 + scrollPos && scrollPos+200 <= nextOffSet[2] ){
                  // currentSection = 1;
                  if(sectionAnimate[1] == false || sectionAnimate[1] == undefined )workLoop();
           }else{
                 $('.moon-2').css({
                       '-webkit-transform' : 'translateX(0px) translateY(0px) rotate(0deg)',
                       '-moz-transform' : 'translateX(0px) translateY(0px) rotate(0deg)',
                       '-ms-transform' : 'translateX(0px) translateY(0px) rotate(0deg)',
                       '-o-transform' : 'translateX(0px) translateY(0px) rotate(0deg)',
                       'transform' : 'translateX(0px) translateY(0px) rotate(0deg)'
                 });
                 clearLooper([1]);
          }
          //--------------------------------------------------- work 스크롤 액션


          if(nextOffSet[2] < scrollPos && scrollPos <= nextOffSet[4]-400){
                if(sectionAnimate[2] == false || sectionAnimate[2] == undefined )iamLoop();
                var depthlayer = [0,0,5];
                var moveY = -0.06;
                for( var i = 0; i <= depthlayer.length; i++){
                      $('#iam').find('.depth-' + depthlayer[i]).css({
                           '-webkit-transform' : 'translateY( ' + (scrollPos* (i * moveY)) + 'px' + ')',
                           'transform' : 'translateY( ' + (scrollPos* (i * moveY)) + 'px' + ')',
                           '-webkit-transition' : '0.1s',
                           'transition' : '0.1s',
                           '-webkit-transition-timing-function' : 'linear',
                           'transition-timing-function' : 'linear'
                     })
               }
               //for
                  // var maxX = garden.clientWidth  - ball.clientWidth;
          }else{
                clearLooper([2]);
          }
         //--------------------------------------------------- i am 스크롤 액션

      });

      function handleOrientation(event) {
            deviceGamma = event.gamma;
            deviceGamma += 90;
            //   $('#console').text('deviceGamma : ' + deviceGamma + ' / ');
      }

      window.addEventListener('deviceorientation', handleOrientation);
});
