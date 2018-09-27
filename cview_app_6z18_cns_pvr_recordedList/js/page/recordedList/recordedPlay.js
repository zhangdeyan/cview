function RecordedPlay(params, srcModule)
{
    var self = this;

    this.timer = null;

    this.status = {};

    this.dlgParam = [
        {uiType: UIFrame, id: "recordedlive", l: 0, t: 0, w: UI.width, h: UI.height, type: "none"}
    ];

    this.open = function () {
        this.defOpen();

        console.log("RecordedPlay Open!");
    };

    this.close = function () {
        this.defClose();
        console.log("RecordedPlay Close");
    };

    this.start = function () {
        console.log("RecordedPlay start");
        self.registerCallback();
        self.doPlay(function(){
            var rect = {
                l:0,
                t:0,
                w:1280,
                h:720
            };
            var r = getVideoRect(rect,sysCom.config.Reslution);

            dtvCom.mp.mpSetVideoSize(r.l, r.t, r.w, r.h, false);

            if(params.item.userData.lastPlayTime && params.item.userData.lastPlayTime != 0){
                setTimeout(function () {
                    var mp = new MPlayer(0);
                    mp.mpSeek(params.item.userData.lastPlayTime,false);
                },1000);
            }
        });

        var p1 = {
            win:self.win,
            exitFun:function(){
                params.item.userData.lastPlayTime = 0;
                params.editItem(params.item);
                self.go(srcModule);
            },
            replayFun:function(){
                self.doPlay();
            },
            deleteFun:function(){
                var mp = new MPlayer(0);
                mp.mpStop();
                params.deleteItem(params.item);
                self.go(srcModule);
            }
        };

        self.endDlg = new PlayEndDlg(p1);
        var p2 = {
            mp:new MPlayer(0),
            item:params.item,
            title: params.item.userData.epg ? params.item.userData.epg.name : params.item.userData.ch.name,
            text: params.item.userData.epg ? params.item.userData.epg.text : params.item.userData.ch.name,
            levelIcon:params.item.userData.epg ? ("./black/"+getEpgImgByRate(params.item.userData.epg.level)+".png") : "./black/level/ico_pu.png",
        };

        //console.log("params:"+JSON.stringify(p2));

        self.playBanner = new MediaPlayBanner(p2);
        self.playBanner.start();
        self.win.update();
    };

    this.doPlay = function(cb){
        var mp = new MPlayer(0);
        mp.mpStop();

        var p = {
            "id": 0,
            "url": "pvrplayback://localhost/player?resId="+params.item.resId
        };
        PVR.replayStart(p,cb);
        setTimeout(function(){
            self.openTimer();
        },1000);
    };

    this.stop = function ()
    {
        self.deleteCallback();
        self.playBanner.close();
        var mp = new MPlayer(0);
        mp.mpStop();
        self.closeTimer();
        console.log("RecordedPlay stop");
    };

    this.onkeyBack = function(){
        var duration = self.playBanner.duration;
        var curTime = self.playBanner.curTime;
        if(curTime >= duration){
            params.item.userData.lastPlayTime = 0;
        }
        else{
            params.item.userData.lastPlayTime = curTime;
        }

        params.editItem(params.item);
    };

    this.openTimer = function(){
        self.timer = setInterval(function(){
            var duration = self.playBanner.duration;
            var curTime = self.playBanner.curTime;
            if(duration == curTime || (duration-curTime) <= 1){
                //播放结束
                self.closeTimer();
                self.endDlg.show();
            }
        },2000)
    };

    this.closeTimer = function(){
        if(self.timer){
            clearInterval(self.timer);
        }
    };


    this.onUsbInOut = function(obj){
        if(obj.code == eventCom.EVENTCODE.CS_EVT_USB_PULLOUT){
            self.go(srcModule);
        }
    };

    this.registerCallback = function(){
        eventCom.registerCallback(7,self.onUsbInOut);
    };

    this.deleteCallback = function(){
        eventCom.deleteCallback(7,self.onUsbInOut);
    };

    this.onkey = function (e)
    {
        console.log("In Template module keyCode =" + e.keyCode);
        var ret = false;
        if(self.playBanner){
            if(self.playBanner.onkey(e)){
                return true;
            }
        }
        switch (e.keyCode) {
            case UI.KEY.BACKSPACE:
                self.onkeyBack();
                self.go(srcModule);
                ret = true;
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    }

}

RecordedPlay.prototype = UIModule.baseModule;