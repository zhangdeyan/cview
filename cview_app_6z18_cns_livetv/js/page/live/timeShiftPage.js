function TimeShiftPage(params, srcModule){

    var self = this;

    this.dlgParam = [
        {uiType : UIFrame, id : "timeshiftPageFrame", l : 0, t : 0, w : UI.width, h : UI.height, type : "none"},
        {uiType : UIImg, id : "timeShiftIcon", ol : 100, ot : 60,w:80,h:60,src:"live/ico_timeshift_cn"}
    ];

    this.open = function(){
        console.log("TimeShiftPage open!");
        self.defOpen();
    };

    this.start = function(){
        console.log("TimeShiftPage start!");
        dtvCom.mp.mpSetStopMode(1,false);
        self.startTimeShift();
        dtvCom.mp.mpSetStopMode(0,false);
        var p = {
            mp:new MPlayer(0),
            startDate:new Date(),
            duration:7200,
            name: "",
            text: "",
            levelIcon:"./black/level/ico_pu.png"
        };

        var ch = dtvCom.getCurrentCh();
        var pfArray = epgCom.getChannelPf(ch, false);
        if(pfArray && pfArray.length >= 1){
            var pfInfo = pfArray[0].rawData;
            p.name = pfInfo.name;
            p.text = pfInfo.extendEvent.text;
            p.levelIcon = "./black/"+getEpgImgByRate(pfInfo.parentRating.rating)+".png";
        }
        else{
            p.name = ch.name;
            p.text = Lp.getValue("NoPfInfo");
            p.levelIcon = "./black/level/ico_pu.png";
        }

        p.ch = ch;
        self.playBanner = new MediaPlayBanner(p);
        self.playBanner.start();
    };

    this.stop = function(){
        self.playBanner.close();
        self.stopTimeShift();
        console.log("TimeShiftPage stop!");
    };

    this.close = function(){
        console.log("TimeShiftPage close!");
        self.defClose();
    };



    this.onkey = function(e){
        if(self.playBanner){
            if(self.playBanner.onkey(e)){
                return true;
            }
        }

        var ret = true;

        switch(e.keyCode){
            case UI.KEY.BACKSPACE:
                self.isExitTimeShift();
                break;
            case UI.KEY.CHNDOWN:
            case UI.KEY.CHNUP:
                self.isExitTimeShift();
                break;
            default:
                ret = false;
                break;
        }

        return ret;
    };

    this.showDia = function(params){
        var p1 = {
            title: Lp.getValue("tips"),
            textok: Lp.getValue("OK"),
            textno: Lp.getValue("Cancel"),
            timeout:5*1000,
            background: "../cview_app_common_pic/password_bg.png",
            dia_ImgOK: "../cview_app_common_pic/ico_ok.png",
            dia_ImgNO: "../cview_app_common_pic/ico_back.png",
            okfun:params.okfun,
            nofun:params.nofun
        };
        var p2 = {
            text:params.text
        };
        var dia = new Dialog(p1);
        dia.show(p2);
    };

    this.startTimeShift = function(){
        console.log("startTimeShift");
        var disk = recordSchCom.getDiskPath();
        var ch = dtvCom.getCurrentCh();
        var url = dtvCom.getTimeShiftUrl(ch.idn,recordSchCom.getDiskPath(),7200);
        var params = {
            id:0,
            url:url,
            audio:ch.audio
        };
        console.log("PVR.timeshiftStart:"+JSON.stringify(params));
        PVR.timeshiftStart(params,false);
    };


    this.stopTimeShift = function(){
        console.log("stopTimeShift");
        PVR.timeshiftStop(false);
    };

    this.isExitTimeShift = function(){
        var params = {
            text:Lp.getValue("isExitTimeShift"),
            okfun:function(){
                self.stopTimeShift();
                self.go(srcModule);
            }
        };
        self.showDia(params);
    };
}
TimeShiftPage.prototype = UIModule.baseModule;
