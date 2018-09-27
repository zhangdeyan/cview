

function MediaPlayBanner(p)
{
    var self = this;
	var hasCreate = false;
    var params = p;
    var ico_FFList = ["ico_FF_x2.png", "ico_FF_x4.png", "ico_FF_x8.png", "ico_FF_x16.png", "ico_FF_x32.png"];
    var ico_FBList = ["ico_FB_X2.png", "ico_FB_X4.png", "ico_FB_X8.png", "ico_FB_X16.png", "ico_FB_X32.png"];

    self.languageNum = 0;
    self.fastTowardFlag = 0;
    self.fastTowardNum = 1;

    var checkTime = function (i)
    {
        if (i < 10) {
            i = "0" + i
        }
        return i
    }

    var transformTime = function (i)
    {
        var s = i % 60;
        var m = parseInt((i / 60) % 60);
        var h = parseInt(i / 3600);
        return checkTime(h) + ":" + checkTime(m) + ":" + checkTime(s);
    }

    console.log("mediaPlayBanner constructed.");

	this.createBanner = function(){
		var html = '<div id="mediaPlayBanner">';
        html += '<div id="ico_playTypes"></div>';
        html += '<div id="languageBar">';
        html += '<p id="languageTxt"></p>';
        html += '</div>';
        html += '<div id="banner1">';
        html += '<p id="bannerTitle"></p>';
        html += '<img id="ico_playState" src="">';
        html += '<span id="bannerStartTime">00:00:00</span>';
        html += '<img id="processbar_black_bg" src="">';
        html += '<img id="processbar_grey_bg" src="">';
        html += '<img id="processbar_blue_bg" src="">';
        html += '<span id="bannerEndTime">00:00:00</span>';
        html += '<span id="playTime">00:00:00</span>';
        html += '</div>';
        html += '<div id="banner2">';
        html += '<div id="icoList">';
        html += '<img id="ico_playpause" src="">';
        html += '<span class="banner2_txt" id="">'+Lp.getValue("playOrPause")+'</span>';
        html += '<img class="banner2_ico" id="ico_backward" src="">';
        html += '<span class="banner2_txt" id="">'+Lp.getValue("Backward")+'</span>';
        html += '<img class="banner2_ico" id="ico_forward" src="">';
        html += '<span class="banner2_txt" id="">'+Lp.getValue("forward")+'</span>';
        html += '<img class="banner2_ico" id="ico_red" src="">';
        html += '<span class="banner2_txt" id="">'+Lp.getValue("Fast_backward")+'</span>';
        html += '<img class="banner2_ico" id="ico_blue" src="">';
        html += '<span class="banner2_txt" id="">'+Lp.getValue("Fast_forward")+'</span>';
        html += '<img class="banner2_ico" id="ico_infoKey" src="">';
        html += '<span class="banner2_txt" id="">'+Lp.getValue("details")+'</span>';
        html += '<img class="banner2_ico" id="ico_language" src="">';
        html += '<span class="banner2_txt" id="ico_languageTxt"></span>';
        html += '<img class="banner2_ico" id="ico_back" src="">';
        html += '<span class="banner2_txt" id="">'+Lp.getValue("Back")+'</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $("body").append(html);

        //设置css
        $("#mediaPlayBanner").css({
            'width': '1280px', 'height': '720px', 'top': '0', 'left': '0', 'position': 'absolute', 'zIndex': '1'
        });

        $("#ico_playTypes").css({
            'width': '80px', 'height': '58px', 'top': '70px', 'left': '90px', 'position': 'absolute'
        });
        $("#banner1").css({
            'width': '1100px', 'height': '114px', 'position': 'absolute', 'top': '510px', 'left': '90px'
        });
        $("#bannerTitle").css({
            'margin-top': '12px', 'font-size': '22px', 'text-align': 'center', 'color': 'white',"min-height":"30px",
        });
        $("#ico_playState").css({
            'float': 'left', 'margin-left': '35px', 'margin-top': '-4px'
        });
        $("#bannerStartTime").css({
            'font-size': '20px', 'margin-top': '8px', 'margin-left': '10px', 'color': '#969696', 'float': 'left'
        });
        $("#processbar_black_bg").css({
            'width': '790px', 'height': '10px', 'margin-top': '15px', 'margin-left': '17px', 'position': 'absolute'
        });
        $("#processbar_blue_bg").css({
            'width': '0', 'height': '10px', 'margin-top': '15px', 'margin-left': '17px', 'position': 'absolute'
        });
        $("#processbar_grey_bg").css({
            'width': '0', 'height': '10px', 'margin-top': '15px', 'margin-left': '17px', 'position': 'absolute'
        });
        $("#bannerEndTime").css({
            'font-size': '20px', 'margin-top': '8px', 'margin-right': '22px', 'color': '#969696',
            'float': 'right'
        });
        $("#playTime").css({
            'width': '104px', 'height': '26px', 'margin-top': '35px', 'margin-left': '323px', 'position': 'absolute',
            'border-radius': '4px', 'font-size': '22px', 'color': 'white', 'background-color': '#707070',
            'text-align': 'center', 'padding-top': '4px'
        });
        $("#banner2").css({
            'width': '1100px', 'height': '40px', 'position': 'absolute', 'top': '629px', 'left': '90px',
            'text-align': 'center'
        });
        $("#icoList").css({'margin-top': '10px', 'display': 'inline-block'});
        $("#ico_playpause").css({'float': 'left'});
        $(".banner2_ico").css({'margin-left': '20px', 'float': 'left'});
        $(".banner2_txt").css({
            'margin-top': '2px', 'margin-left': '10px', 'font-size': '17px', 'color': '#969696', 'float': 'left'
        });

        //设置图片
		//$("#ico_playTypes").css({'background-image': 'url(./black/images/ico_playback.png)'});
        
		 $("#ico_playState").attr('src', './black/images/ico_pause.png');
        
        $("#banner1").css({'background-image': 'url(./black/images/contrl_pannel_bg_1100x114.png)'});
        $("#banner2").css({'background-image': 'url(./black/images/contrl_pannel_bg_1100x40.png)'});
        $("#processbar_black_bg").attr('src', './black/images/processbar_black_bg.png');
        $("#processbar_blue_bg").attr('src', './black/images/processbar_blue_bg.png');
        $("#processbar_grey_bg").attr('src', './black/images/processbar_gray_bg.png');
        $("#ico_playpause").attr('src', './black/images/ico_playpause.png');
        $("#ico_backward").attr('src', './black/images/ico_backward.png');
        $("#ico_forward").attr('src', './black/images/ico_forward.png');
        $("#ico_red").attr('src', './black/images/ico_red.png');
        $("#ico_blue").attr('src', './black/images/ico_blue.png');
        $("#ico_infoKey").attr('src', './black/images/ico_infoKey.png');
        $("#ico_back").attr('src', './black/images/ico_back.png');

        //设置文字
        $("#bannerTitle").text(params.name ? params.name : "");

        if (true) {
            $("#ico_language").attr('src', './black/images/ico_language.png');
            $("#ico_languageTxt").text(Lp.getValue("ChangeMultiLanguage"));

            $("#languageBar").css({
                'background-image': 'url(./black/images/trackBg_280x40.png)',
                'width': '280px', 'height': '40px', 'top': '460px', 'right': '95px', 'position': 'absolute'
            });

            $("#languageTxt").css({
                'font-size': '20px', 'color': 'white', 'text-align': 'center', 'line-height': '40px'
            });

            $("#languageBar").hide();
        }

        //快进快退 图标
        if( $("#ico_fastToward") ){
            var html = '<div id="ico_fastToward"></div>';
            $("#mediaPlayBanner").append(html);
        }

		$("#mediaPlayBanner").hide();
		hasCreate = true;
	};

    //获取更新当前播放状态
    this.getMplayerStatus = function () {
        self.mediaInfo = params.mp.mpGetMediaInfo(false);
        if(!self.mediaInfo){
            $("#bannerStartTime").text("00:00:00");
            $("#bannerEndTime").text("00:00:00");
            $("#playTime").text("00:00:00");
            $("#processbar_blue_bg").css('width', 0 + 'px');
            $("#processbar_grey_bg").css('width', 0 + 'px');
            return;
        }

        console.log("mediaInfo:"+JSON.stringify(self.mediaInfo));

        if(self.mediaInfo.recTime  < params.duration){

            $("#bannerStartTime").text(getTimeStr1fromDate(params.startDate));
            var endDate = getEpgEndDate(params.startDate,params.duration);
            $("#bannerEndTime").text(getTimeStr1fromDate(endDate));

            var curDate = getEpgEndDate(params.startDate,self.mediaInfo.playTime);
            $("#playTime").text(getTimeStr1fromDate(curDate));

            //已播放时间
            var processbar_blue_width = 790 * (self.mediaInfo.playTime / params.duration);
            $("#processbar_blue_bg").css('width', processbar_blue_width + 'px');

            //已录制时间
            var processbar_grey_width = 790 * (self.mediaInfo.recTime / params.duration);
            $("#processbar_grey_bg").css('width', processbar_grey_width + 'px');
        }
        else{
            var startDate = getEpgEndDate(params.startDate,self.mediaInfo.recTime - params.duration);
            $("#bannerStartTime").text(getTimeStr1fromDate(startDate));
            var endDate = getEpgEndDate(startDate,params.duration);
            $("#bannerEndTime").text(getTimeStr1fromDate(endDate));

            var diff= self.mediaInfo.recTime - self.mediaInfo.playTime;
            if(diff > params.duration){
                var curDate = getEpgEndDate(startDate,0);
                $("#playTime").text(getTimeStr1fromDate(curDate));
            }
            else{
                var curDate = getEpgEndDate(startDate,params.duration - diff);
                $("#playTime").text(getTimeStr1fromDate(curDate));
            }


            //已播放时间
            var minTime = self.mediaInfo.recTime - params.duration;
            if(self.mediaInfo.playTime < minTime){
                var processbar_blue_width = 790 * 0;
                $("#processbar_blue_bg").css('width', processbar_blue_width + 'px');

                var status  = params.mp.mpGetPlayerInfo(false);
                if(status.replayStatus == 3){
                    self.videoResume();
                }
            }
            else{
                var processbar_blue_width = 790 * ((self.mediaInfo.playTime - minTime) / params.duration);
                $("#processbar_blue_bg").css('width', processbar_blue_width + 'px');
            }

            //已录制时间
            var processbar_grey_width = 790 ;
            $("#processbar_grey_bg").css('width', processbar_grey_width + 'px');
        }

        /*var minTime = self.mediaInfo.recTime - params.duration;

	    if(self.mediaInfo.playTime == 0 && self.fastTowardFlag != 0){
            self.fastTowardFlag = 0;
            self.fastTowardNum = 0;
            self.videoResume();
        }

        if(self.mediaInfo.playTime == self.mediaInfo.recTime && self.fastTowardFlag != 0){
            self.fastTowardFlag = 0;
            self.fastTowardNum = 0;
            self.videoResume();
        }*/
    };


    this.openMplayTimer = function () {
        self.stopMplayTimer();
        self.mplayTimer = setInterval(function () {
            self.getMplayerStatus();
        }, 1000);
    };

    this.stopMplayTimer = function () {
        if (self.mplayTimer) {
            clearInterval(self.mplayTimer);
            self.mplayTimer = null;
        }
    };

    //詳情彈窗
    this.showDetail = function () {
        self.show();

        if( $("#ch_mediaplay_details").length>0 ){
            $("#ch_mediaplay_details").remove();
            self.openShowTimer();
            return;
        }
        else{
            self.stopShowTimer();
        }

        var html = '<div id="ch_mediaplay_details">';
            html += '<p id="details_title">'+Lp.getValue("Program_details")+'</p>';
                html += '<div id="details_content">';
                html += '<img id="content_img" src="'+params.levelIcon+'">';
                html += '<span id="content_title"></span>';
                html += '<div id="content_txt"></div>';
                html += '</div>';

            html +=  '<div id="font_content">';
            html += '<img src="./black/images/ico_infoKey.png">';
            html += '<span>'+Lp.getValue("Information")+'</span>';
            html += '</div>';

        html += '</div>';
        $("#mediaPlayBanner").append(html);


        $("#ch_mediaplay_details").css({
            'width': '500px', 'height': '275px', 'top': '210px', 'left': '390px', 'position': 'absolute', 'zIndex': '2',
            'background-size': '100%', 'background-image': 'url(./black/images/more_detail_bg_800x440.png)'
        });

        $("#details_title").css({
            'margin-top': '5px', 'font-size': '25px', 'height': '30px',
            'text-align': 'center', 'color': 'white'
        });

        $("#details_content").css({
            'width': '460px',
            'height': '145px',
            'padding': '10px 20px 40px 20px',
            'font-size': '20px',
            'position': 'relative',
            'overflow':'hidden',
            'color':'white'
        });

        $("#content_txt").text(params.text);


        $("#content_title").css({'margin-left': '8px', 'position': 'absolute'});
        $("#content_title").text(params.name);

        $("#font_content").css({
            'text-align':'center'
        });

        $("#font_content img").css("margin-top","18px");

        $("#font_content span").css({
            "color":"white",
            "line-height":"16px",
            'font-size': '20px'
        });
    };

    //語言切換彈窗
    this.languageSwitch = function () {
        self.show();

        if(self.langDlgTimer){
            clearTimeout(self.langDlgTimer);
            self.langDlgTimer = null;
        }

        $("#languageBar").show();

        if(params.ch.audio.length > 1) {
            self.languageNum++;
            if(self.languageNum >= params.ch.audio.length){
                self.languageNum = 0;
            }
        }
        else {
            self.languageNum = 0;
        }

        $("#languageTxt").text(Lp.getValue("audio_track")+ (self.languageNum + 1) + ' : ' + getCountryByCode(params.ch.audio[self.languageNum].lang));

        if(params.ch.audio.length > 1){
            var p = {
                "aStreamType": params.ch.audio[self.languageNum].type,
                "pid":params.ch.audio[self.languageNum].pid
            };
            console.log("mpSetAudioTrack:"+JSON.stringify(p));
            params.mp.mpSetAudioTrack(p,false);
        }

        self.langDlgTimer = setTimeout(function ()
        {
            self.langDlgTimer = null;
            $("#languageBar").hide();
        }, 5000);
    };

    //快進
    this.fastForward = function ()
    {
        if ($("#details").length>0) {
            self.closeDetail();
        }

        if(self.fastTowardFlag < 0){
            self.fastTowardNum = 0;
            self.fastTowardFlag = 1;
        }

        self.fastTowardNum++;

        if(self.fastTowardNum > 5){
            self.fastTowardNum = 0;
            self.fastTowardFlag = 0;
            $("#ico_fastToward").hide();
        }
        else{
            $("#ico_fastToward").show();
            $("#ico_fastToward").css({
                'width': '50px', 'height': '50px', 'top': '100px', 'right': '90px', 'position': 'absolute',
                'background-image': 'url(./black/images/' + ico_FFList[self.fastTowardNum-1] + ')'
            });
        }

        params.mp.mpSpeed(Math.pow(2,self.fastTowardNum),false);
        self.show();
    };

    //快退
    this.fastBackward = function ()
    {
        if ($("#details").length>0) {
            self.closeDetail();
        }

        if(self.fastTowardFlag > 0){
            self.fastTowardNum = 0;
            self.fastTowardFlag = -1;
        }

        self.fastTowardNum++;

        if(self.fastTowardNum > 5){
            self.fastTowardNum = 0;
            self.fastTowardFlag = 0;
            $("#ico_fastToward").hide();

        }
        else{
            $("#ico_fastToward").show();
            $("#ico_fastToward").css({
                'width': '50px', 'height': '50px', 'top': '100px', 'right': '90px', 'position': 'absolute',
                'background-image': 'url(./black/images/' + ico_FBList[self.fastTowardNum-1] + ')'
            });
        }
        params.mp.mpSpeed(0-Math.pow(2,self.fastTowardNum),false);
        self.show();

    };

    //拖拽快進
    this.dragTimeArray = [1,1,1,1,1,3,3,3];
    this.dragForwardTime = 0;
    this.dragForward = function ()
    {
        if(!self.mediaInfo){
            return;
        }

	if(self.fastTowardFlag != 0){
            return;
        }
        this.dragBackwardTime = 0;

        var dragTime = 0;
        if(self.dragForwardTime >= self.dragTimeArray.length){
            dragTime = 10 * 60;
        }
        else{
            dragTime = self.dragTimeArray[self.dragForwardTime] * 60;
        }
        self.dragForwardTime++;

        var pos = 0;
        var duration = self.mediaInfo.recTime;
        var curTime = 0;
        if(self.mediaInfo.recTime < params.duration){
            curTime = self.mediaInfo.playTime;
            if((curTime + dragTime) >= duration){
                pos = duration;
            }
            else{
                pos = curTime + dragTime;
            }
        }
        else{
            var minTime = self.mediaInfo.recTime - params.duration;
            if(self.mediaInfo.playTime < minTime){
                curTime = minTime;
            }
            else{
                curTime = self.mediaInfo.playTime;
            }

            if((curTime + dragTime) >= duration){
                pos = duration;
            }
            else{
                pos = curTime + dragTime;
            }
        }
        params.mp.mpSeek(pos,function(){});

        self.dragForwardTimer = null;

        self.show();
    };

    //拖拽快退
    this.dragBackwardTime = 0;
    this.dragBackward = function ()
    {
        if(!self.mediaInfo){
            return;
        }
	
	if(self.fastTowardFlag != 0){
            return;
        }

        this.dragForwardTime = 0;
        var dragTime = 0;
        if(self.dragForwardTime >= self.dragTimeArray.length){
            dragTime = 10 * 60;
        }
        else{
            dragTime = self.dragTimeArray[self.dragForwardTime] * 60;
        }

        var pos = 0;
        var duration = self.mediaInfo.recTime;
        var curTime = 0;
        if(self.mediaInfo.recTime < params.duration){

            curTime = self.mediaInfo.playTime;
            if(curTime <= dragTime){
                pos = 0;
            }
            else{
                pos = curTime - dragTime;
            }
        }
        else{
            var minTime = self.mediaInfo.recTime - params.duration;
            if(self.mediaInfo.playTime < minTime){
                curTime = minTime;
            }
            else{

                curTime = self.mediaInfo.playTime;
            }
            if((curTime - dragTime) >= minTime){
                pos = curTime - dragTime;
            }
            else{
                pos = minTime;
            }

        }

        params.mp.mpSeek(pos,function(){});

        self.show();

        self.dragBackwardTime++;

    };

    //播放暫停
    this.videoPause = function () {
		params.mp.mpPause(false);
        self.fastTowardNum = 0;
        self.fastTowardFlag = 0;
        $("#ico_fastToward").hide();
        $("#ico_playState").attr('src', './black/images/ico_pause.png');
        self.show();
    };

    //繼續播放
    this.videoResume = function () {
        self.fastTowardNum = 0;
        self.fastTowardFlag = 0;
        $("#ico_fastToward").hide();
        params.mp.mpResume(false);
        $("#ico_playState").attr('src', './black/images/ico_play.png');
        self.show();
    };

    //關閉語言切換彈窗
    this.closeLangDlg = function () {
        $("#langDlg").remove();
        self.show();
    };

    //關閉詳情彈窗
    this.closeDetail = function () {
        $("#details").remove();
        self.show();
    };

	//banner演示关闭
    this.openShowTimer = function () {
        self.stopShowTimer();
        self.showTimer = setTimeout(function () {
            self.hide();
        }, 1000 * sysCom.config.displayTime);
    };

    this.stopShowTimer = function () {
        if (self.showTimer) {
            clearTimeout(self.showTimer);
            self.showTimer = null;
        }
    };

    //控制Banner條
    this.showBanner = function ()
    {
        if(!hasCreate){
            self.createBanner();
        }
        $("#mediaPlayBanner").show();
    };

    this.start = function ()
    {
        self.showBanner();
		self.openShowTimer();
		self.openMplayTimer();
        self.getMplayerStatus();
    };

    this.show = function(){
        self.showBanner();
        self.openShowTimer();
    };

	this.hide = function(){
        self.dragForwardTime = 0;
        self.dragBackwardTime = 0;
		self.stopShowTimer();
		$("#mediaPlayBanner").hide();
	};


	this.close = function () {
        self.stopShowTimer();
        self.stopMplayTimer();
        self.fastTowardNum = 0;
        self.fastTowardFlag = 0;
        $("#mediaPlayBanner").remove();
        console.log("mediaPlayBanner close");
    };

    //Enter鍵按鍵處理
    this.onkeyEnter = function ()
    {
    	 if($("#details").length>0){
            self.closeDetail();
            return;
        }
	
	if(self.fastTowardFlag != 0){
            self.videoResume();
            return;
        }

        var status = params.mp.mpGetPlayerInfo(false);
        console.log("mpGetPlayerInfo:"+JSON.stringify(status));
        /*{
            "recStatus": 3,    (idle:0  recording:1  pause:2  diskfull:3  DISKFULL_WARNING:4  NODATA:5 error:6)
            "replayStatus": 3  (idle:0  playing:1  speed:2  pause:3)
        }
        */
        if(status.replayStatus == 1){
            self.videoPause();
        }
        else if(status.replayStatus == 3){
            self.videoResume();
        }
        else if(status.replayStatus == 2){
            self.videoPause();
        }
        self.show();
    };

    this.onkeyBack = function(){
       //如果 节目详情 在，则关闭
        if( $("#ch_mediaplay_details").length>0 ){
            $("#ch_mediaplay_details").remove();
            return true;
        }
    };

    //按鍵處理
    this.onkey = function (e)
    {
        var ret = true;
        console.log("In mediaPlayBanner keyCode:" + e.keyCode);
        switch (e.keyCode) {
            case UI.KEY.FUNRED:
                self.fastBackward();
                break;
            case UI.KEY.FUNBLUE:
                self.fastForward();
                break;
            case UI.KEY.UP:
            case UI.KEY.DOWN:
                self.show();
                break;
            case UI.KEY.LEFT:
                self.dragBackward();
                break;
            case UI.KEY.RIGHT:
                self.dragForward();
                break;
            case UI.KEY.PLAY:
            case UI.KEY.ENTER:
                self.onkeyEnter();
                break;
            case UI.KEY.LANG:
                self.languageSwitch();
                break;
            case UI.KEY.INFO:
                self.showDetail();
                break;
            case UI.KEY.BACKSPACE:
                ret = self.onkeyBack();
            default:
                ret = false;
                break;
        }
        return ret;
    };
}