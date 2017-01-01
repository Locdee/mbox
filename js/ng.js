
var app = angular.module('locdee',[]);

app.controller('indexCtrl',function($scope,$http,$sce,$document,getlrc){
	$scope.bool=false;
	$scope.need= true;
	$scope.title = '时间煮雨';
	$scope.singer = '吴亦凡';
	$scope.album = '小时代';
	$scope.lrc = '\
			[00:01.12]时间煮雨 - 吴亦凡\n\
            [00:04.21]词：郭敬明,落落\n\
            [00:07.21]曲：刘大江\n\
            [00:09.06]\n\
            [00:11.20]编曲：黄毅,陶华\n\
            [00:14.44]\n\
            [00:26.14]风吹雨成花\n\
            [00:30.10]\n\
            [00:32.22]时间追不上白马\n\
            [00:35.95]\n\
            [00:37.30]你年少掌心的梦话\n\
            [00:42.42]依然紧握着吗\n\
            [00:46.61]\n\
            [00:49.10]云翻涌成夏\n\
            [00:52.44]\n\
            [00:54.80]眼泪被岁月蒸发\n\
            [00:58.74]\n\
            [01:00.42]这条路上的你我她\n\
            [01:04.97]有谁迷路了吗\n\
            [01:09.56]\n\
            [01:14.80]我们说好不分离\n\
            [01:19.23]要一直一直在一起\n\
            [01:23.26]\n\
            [01:25.78]就算与时间为敌\n\
            [01:30.41]就算与全世界背离\n\
            [01:35.22]\n\
            [01:48.50]风吹亮雪花\n\
            [01:52.07]\n\
            [01:54.09]吹白我们的头发\n\
            [01:58.57]当初说一起闯天下\n\
            [02:04.11]你们还记得吗\n\
            [02:08.50]\n\
            [02:11.08]那一年盛夏\n\
            [02:14.42]\n\
            [02:16.73]心愿许的无限大\n\
            [02:20.22]\n\
            [02:22.31]我们手拉手也成舟\n\
            [02:26.72]划过悲伤河流\n\
            [02:31.61]\n\
            [02:36.52]你曾说过不分离\n\
            [02:40.84]要一直一直在一起\n\
            [02:46.07]\n\
            [02:47.80]现在我想问问你\n\
            [02:52.17]是否只是童言无忌\n\
            [02:56.69]\n\
            [02:57.77]天真岁月不忍欺\n\
            [03:03.34]青春荒唐我不负你\n\
            [03:08.80]\n\
            [03:10.11]大雪求你别抹去\n\
            [03:14.68]我们在一起的痕迹\n\
            [03:19.32]\n\
            [03:21.91]大雪也无法抹去\n\
            [03:26.50]我们给彼此的印记\n\
            [03:30.87]\n\
            [03:33.14]今夕何夕\n\
            [03:36.68]\n\
            [03:38.46]青草离离\n\
            [03:42.25]\n\
            [03:44.33]明月夜送君千里\n\
            [03:49.13]等来年\n\
            [03:50.62]秋风起';
	$scope.albumPic = 'images/2.png';
	$scope.song = 'music/1.mp3';
	$scope.songid = '';
	$scope.searchsong= '';
	$scope.songs = [];
	getlrc.init($scope.lrc);
	
	$scope.singsong = function(li){
		$scope.songid = li.s.song_id;
		$http.jsonp('http://api.lostg.com/music/xiami/songs/'+$scope.songid,{
			params: {
						'lyric':1,
						'callback': 'JSON_CALLBACK'
					}
		})
			 .success(function(data) {
			 		document.getElementById('audio').load();
					$scope.song = $sce.trustAsResourceUrl(data.location);
					$scope.title = data.title;
					$scope.singer = data.singer;
					$scope.album = data.album;
					$scope.lrc = data.lyric;
					$scope.albumPic = data.album_pic;
					$scope.bool=false;
					$scope.need= false;
					getlrc.init($scope.lrc);
				    document.getElementById('audio').ontimeupdate =function(){
				        var t =parseInt(this.currentTime);
				        getlrc.jump(t);
				    };
				}).error(function(){
				});
	};
	$scope.getsong = function(){
		$http.jsonp('http://www.xiami.com/search/json', {
					params: {
						'k': $scope.searchsong,
						't':4,
						'callback': 'JSON_CALLBACK'
					}
			}).success(function(data) {
					$scope.songs= data.songs;
					$scope.bool=true;
				}).error(function(){
					$scope.bool=false;
				});
	};
	})
app.service('getlrc',function(){
	function getlrc(){
		this.regex_trim = /^\s+|\s+$/;//正则，去掉首尾空格
	    // 解析歌词
	    this.init=function(lrctext){
	    	
	    	document.getElementById("lrc_list").innerHTML="";
	        var arr = lrctext.split("\n");
	        var html="";        
	        for(var i =0;i<arr.length;i++){
	            var item =arr[i].replace(this.regex_trim,"");
	            var ms= item.split("]");
	            var mt = ms[0].replace("[","");
	            var m =mt.split(":");
	            var num = parseInt(m[0]*60+m[1]*1);
	            var lrc=ms[1];
	            if (lrc) {
	                html+="<li id='t_"+num+"'>"+lrc+"</li>"
	            };
	        };
	        document.getElementById("lrc_list").innerHTML +=html;
	    };
	    // 歌词跳动
	    this.jump=function(duration){
	        var dom =document.getElementById("t_"+duration);
	        var lrcbox = document.getElementById("lrc_list");
	        if(dom){
	            var arr = this.siblings(dom);
	            for(var i=0 ;i<arr.length;i++){
	                arr[i].className="";
	            };
	            dom.className="hover";
	            var index = this.indexof(dom)-4;
	            lrcbox.style.marginTop = (index<0?0:index)*-28+"px";
	        };
	
	    };
	    this.indexof=function(dom){
	        var listDoms =dom.parentElement.children;
	        var index =0 ;
	        for(var i=0;i<listDoms.length;i++){
	            if(listDoms[i] == dom){
	                index =i;
	                break;
	            }
	        }
	        return index;
	    };
	    this.siblings=function(dom){
	        var listDoms = dom.parentElement.children;
	        var arr = [];
	        for(var i = 0; i<listDoms.length; i++){
	            if (listDoms[i] != dom) {
	                arr.push(listDoms[i]);
	            };
	        };
	        return arr;
	    };
	    
	};
	return new getlrc();
});
app.directive('locmusic',function($timeout,getlrc){
	return function(scope,ele,attr){
   			document.getElementById('audio').ontimeupdate =function(){
				        var t =parseInt(this.currentTime);
				        getlrc.jump(t);
				   };
	};
});