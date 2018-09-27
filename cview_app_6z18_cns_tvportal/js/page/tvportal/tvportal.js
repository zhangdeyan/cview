console.log("uiCom  end" + (new Date()).getTime());

function Tvportal() {
    var self = this;

    self.isLock = false;
    /************UI参数定义区***********/
    var imgW = 184;
    var imgH = 161;
    var spaceH = 5;
    var spaceW = 2;
    var expandSize = 10;

    var left_l = 60;
    var left_t = 120;
    var left_w = (imgW * 3 + spaceW * 2);
    var left_h = (imgH * 3 + spaceH * 2);

    var right_l = left_l + left_w + 10;
    var right_t = left_t;
    var right_w = 600;
    var right_h = 315;

    this.preIndex = 0;
    this.curIndex = 0;
    this.pagestart = 0;
    this.extraindex = 0;
    this.appclass = 0;//app所在级数

    this.curList = [];

    this.adModule = null;
    this.checkAdTimer = null;

    this.stbInfoDlg = null;


    this.dlgParam = [
        {
            uiType: UIFrame,
            id: "tvPortalFrame",
            l: 0,
            t: 0,
            w: UI.width,
            h: UI.height,
            visibility:1,
            type: "block",
            color: "#202020"
        },
        {
            uiType: UIImg,
            id: "tvPortalImg",
            ol: 0,
            ot: 0,
            w: 1280,
            h: 720,
            stretch: "HV",
            visibility:-1,
            src: ""
        },
        {
            uiType: UIImg,
            id: "leftUpLogoImg",
            ol: left_l,
            ot: 40,
            h: left_t - 40,
            stretch: "H",
            src: "tvportal/BBTV_logo"
        },
        {
            uiType: UILabel,
            id: "tvPortalTimeLabel",
            ol: right_l + right_w / 2, ot: right_t / 2, w: 200, h: 30,
            font: uiCom.font.F20,
            color: "#F2F2F2",
            HAlign: "Left",
            value: ""
        },
        {
            uiType: UILabel,
            id: "tvPortal2LevelName",
            ol: left_l + left_w - 100,
            ot: left_t - 40,
            w: 200,
            h: 40,
            font: uiCom.font.F20,
            color: "white",
            HAlign: "Left",
            value: ""
        },
        {
            uiType: UIImg, id: "tvPortalNetworkEthImg",
            ol: right_l + right_w / 2 + 200,
            ot: right_t / 2 - 10,
            src: "tvportal/icon_ethernet"
        },
        {
            uiType: UIImg, id: "tvportalPreviousImg",
            ol: left_l + left_w / 2 - 20,
            ot: left_t - 40,
            src: "tvportal/previous"
        },
        {
            uiType: UIImg,
            id: "tvportalNextImg",
            ol: left_l + left_w / 2 - 20,
            ot: left_t + left_h + 20,
            src: "tvportal/next"
        },
        {
            uiType: UIFrame,
            id: "tvshowAreaFrame",
            ol: right_l,
            ot: right_t,
            w: right_w,
            h: right_h ,
            type: "hole"
        },
        {
            uiType: UIImg,
            id: "tvshowAreaImg",
            ol: right_l,
            ot: right_t,
            w: right_w,
            h: right_h ,
            src: "",
            stretch: "HV",
            visibility: -1,
        },
        {
            uiType: UIImg,
            id: "staticAdImg",
            ol: right_l,
            ot: right_t + right_h  + right_h * 0.1,
            w: right_w,
            h: right_h * 0.43,
            src: "tvportal/AD_mainmenu",
            focusRectLineWidth: 10,
            focusRectLineColor: "#16A1FE",
            stretch: "HV"
        },
        {
            uiType: UIImg,
            id: "tvportalOkImg",
            ol: right_l + right_w / 2,
            ot: right_t + right_h*1.5 + 40,
            src: "tvportal/ok"
        },
        {
            uiType: UILabel,
            id: "tvportalOkLabel",
            ol: right_l + right_w / 2 + 60,
            ot: right_t + right_h*1.5 + 50,
            w: 100,
            h: 20,
            font: uiCom.font.F20,
            color: "#F2F2F2",
            HAlign: "left",
            value: Lp.getValue("Ok")
        },
        {
            uiType: UIImg,
            id: "tvportalLiveTvImg",
            ol: right_l + right_w / 2 + 150,
            ot: right_t + right_h*1.5 + 40,
            src: "tvportal/live_tv",

        },
        {
            uiType: UILabel,
            id: "tvportalLiveTvLabel",
            ol: right_l + right_w / 2 + 250,
            ot: right_t + right_h*1.5 + 50,
            w: 100,
            h: 20,
            font: uiCom.font.F20,
            color: "#F2F2F2",
            HAlign: "left",
            value: Lp.getValue("leave")
        }
    ];

    /************页面创建基本操作区***********/
    this.initLayout = function () {

        self.leftParam = [
            {
                uiType: UIFrame,
                id: "leftParamFrame",
                l: left_l,
                t: left_t-(imgH + spaceH),
                w: left_w,
                h: left_h+2*(imgH + spaceH),
                type: "none"
            },
        ];

        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 3; j++) {
                var item = {
                    uiType: UIImg,
                    id: "img" + (i * 3 + j),
                    ol: (imgW + spaceW) * j,
                    ot: (imgH + spaceH) * i,
                    w: imgW,
                    h: imgH,
                    src: "",
                    stretch: "HV",
                    focusAddSize: expandSize,
                    maginx: left_l,
                    maginy: left_t-spaceH-5,
                    maginw: left_w,
                    maginh: left_h+2*spaceH-5,
                };
                self.leftParam.push(item);
            }
        }
    };

    this.open = function () {
        console.log("tvportal start1" + (new Date()).getTime());
        this.initLayout();
        this.defOpen();
        this.leftDlg = UI.createGroup(self.leftParam, "leftDlg", self.win);
    };

    this.start = function () {
        var reuse = false;
        self.getAppList();

        var apptvportal = appCom.getAppByName("tvportal");

        console.log("apptvportal="+apptvportal.icon_url);
        if(apptvportal && apptvportal.icon_url && apptvportal.icon_url!="")
        {
            var img = new Image();
            console.log("apptvportal.icon_url="+apptvportal.icon_url);
            img.src = apptvportal.icon_url;
            img.onload=function()
            {
                self.win.getChild("tvPortalFrame").visibility = -1;
                self.win.getChild("tvPortalImg").setSrc(img);
                self.win.getChild("tvPortalImg").visibility = 1;
                self.win.update();
            }
        }

        var returnid = sysCom.getMemConfig("returnid");
        if (returnid) {
            self.curIndex = self.getIndexByAppId(sysCom.getMemConfig("returnid"));
            sysCom.setMemConfig("returnid",0);


            var classarr= sysCom.getMemConfig("appclass");
            if(classarr)
            {
                var pageinfo = classarr.pop();
                if(pageinfo)
                {
                    self.preIndex  = pageinfo.preIndex;
                    self.curIndex  = pageinfo.curIndex;
                    self.pagestart = pageinfo.pagestart;
                    self.extraindex = pageinfo.extraindex;
                    reuse = true;
                    console.log("back tvportal pop curIndex="+ self.curIndex);
                    console.log("back tvportal pop pagestart="+ self.pagestart);
                }
                sysCom.setMemConfig("appclass",classarr);
            }

        }
       else {
            var classarr = new Array();
            sysCom.setMemConfig("appclass", classarr);
            if (sysCom.getMemConfig("last_app_id")) {

                self.curIndex = self.getIndexByAppId(sysCom.getMemConfig("last_app_id"));


            }
        }
        self.initPortalBylist(reuse);
        self.setFocusIcon();
        self.startUpdateTime();
        self.updateTimeTask();

        self.checkLoadTimer = setInterval(function () {
            if (self.Check9Img()) {
                self.win.update();
                clearInterval(self.checkLoadTimer);
            }
        }, 100);

        setTimeout(function () {
            var ch = dtvCom.getBarkerChannel();

            if(!ch){
                return;
            }
            var ret = Epg.epgGetPf(ch.tsId,ch.oriNetworkId,ch.serviceId,false);
            var pf = epgCom.getPfFormat(ret,ch);

            var l = false;
            if(pf && pf.length > 0){
                l = lockCom.checkAllLock(ch,pf[0].level);
            }
            else{
                l = lockCom.checkAllLock(ch,0);
            }

            if(!l){
                self.playBarker();

            }
            else{
                self.videoStatus.eventLock = true;
                self.setVideoImg(self.getDisplayAreaImg());
                self.isLock = true;
            }


            self.getEthImg().hide();

        }, 300);

        self.registerCb();

        self.startAd();

        self.stbInfoDlg = new stbInfoDialog();

        console.log("tvportal end" + (new Date()).getTime());
    };

    this.playBarker = function(){
        dtvCom.playBarkerChannel(function () {
            var rect = {
                l: 615,
                t: 120,
                w: right_w,
                h: right_h
            };
            var r = getVideoRect(rect, sysCom.config.Reslution);
            dtvCom.mp.mpSetVideoSize(r.l, r.t, r.w, r.h, false);
        });
    };

    this.close = function () {
        this.defClose();
    };

    this.stop = function () {
        dtvCom.stop();
        clearInterval(self.checkAdTimer);
        self.checkAdTimer = null;
        clearInterval(self.check30sInAdultfTimer);
        self.check30sInAdultfTimer = null;
    };

    this.onkey = function (e) {
        var ret = true;
        //console.log("tvportal keyCode:" + e.keyCode);
        switch (e.keyCode) {
            case UI.KEY.UP:
                self.onkeyUp();
                break;
            case UI.KEY.DOWN:
                self.onkeyDown();
                break;
            case UI.KEY.LEFT:
                self.onkeyLeft();
                break;
            case UI.KEY.RIGHT:
                self.onkeyRight();
                break;
            case UI.KEY.ENTER:
                self.onkeyEnter();
                break;
            case UI.KEY.BACKSPACE:
                self.onkeyBack();
                break;
            case UI.KEY.FUNBLUE:
                self.adModule.onkey(e);
                break;
            case UI.KEY.FUNYELLOW:
                if(self.isLock){
                    self.showPasswdDialog();
                }
                break;
            case UI.KEY.MENU:
                self.onkeyMenu();
                break;
            default:
                ret = false;
                break;
        }

        try{
            self.enterStbInfoCheck(e);
        }
        catch(e) {
            console.log("error");
        }

        return ret;
    };

    /************页面元素获取区***********/
    this.getImgById1 = function (id) {
        if (id < 3) {
            return self.leftDlg1.getChild("img" + id);
        }
        else if (id < 6) {
            return self.leftDlg2.getChild("img" + id);
        }
        else if (id < 9) {
            return self.leftDlg3.getChild("img" + id);
        }
    };

    this.getImgById = function (id) {
        return self.leftDlg.getChild("img" + id);
    };

    this.getTimeLabel = function () {
        return self.win.getChild("tvPortalTimeLabel");
    };

    this.getWifiImg = function () {
        return self.win.getChild("tvPortalNetworkWifiImg");
    };

    this.getEthImg = function () {
        return self.win.getChild("tvPortalNetworkEthImg");
    };

    this.getDisplayAreaImg = function () {
        return self.win.getChild("tvshowAreaImg");
    };

    this.getLogoImg = function () {
        return self.win.getChild("leftUpLogoImg");
    };

    this.getStaticAdImg = function () {
        return self.win.getChild("staticAdImg");
    };

    this.getOkImg = function () {
        return self.win.getChild("tvportalOkImg");
    };

    this.getOkLabel = function () {
        return self.win.getChild("tvportalOkLabel");
    };

    /************移动控制区***********/


    this.getAppList = function () {
        var curId = sysCom.getMemConfig("current_app_id");
        var lp = appCom.getLinkPointByAppId(curId);
        self.curList = appCom.getAppListByLinkPonit(lp);
        if (!self.curList || self.curList.length == 0) {

            var curId = appCom.getAppByName("tvportal").app_id;
            console.log("tvportal id = "+curId);
            sysCom.setMemConfig("current_app_id", curId);
            sysCom.setMemConfig("last_app_id", curId);

            var lp = appCom.getLinkPointByAppId(curId);
            self.curList = appCom.getAppListByLinkPonit(lp);
        }
        console.log("self.curList:" + self.curList.length);
    };

    this.getIndexByAppId = function (id) {
        for (var i = 0; i < self.curList.length; i++) {
            if (self.curList[i].app_id == id) {
                return i;
            }
        }
        return 0;
    };

    this.isHasImg = function (ImgObj) {
        if (ImgObj == null)
            return true;
        if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
            return true;
        } else {
            return false;
        }
    };

    this.Check9Img = function () {
        var index = self.curIndex >= 0 ? self.curIndex : self.preIndex;
        var page = parseInt(index / 9, 10);
        for (var i = 0 /*+ page * 9*/; i < 15 /*+ page * 9*/; i++) {
            var item = self.getImgById(i % 15);
            if (i+self.pagestart < self.curList.length) {

                if (self.isHasImg(self.curList[i+self.pagestart].IconSrc) == false) {
                    return false;
                }
            }
            else {

            }
        }
        return true;
    };

    this.initPortalBylist = function (reuseextra) {


         var extraindex = 0;
        var index = self.curIndex >= 0 ? self.curIndex : self.preIndex;
        //var page = parseInt(index / 9, 10);

        //糾正一次數值
        if(self.curIndex >=0 && self.curIndex  < 3 && self.preIndex>=0 && self.preIndex < 6)
        {
            extraindex = 3;

        }

        if(reuseextra == true)
            extraindex = self.extraindex;

        self.curIndex = self.curIndex+extraindex;
        self.extraindex = extraindex;
        //////////////////////////////////////////

        console.log("initPortalBylist self.curIndex ="+self.curIndex);

        for (var i = /*0 + page * 9*/0; i < /*9 + page * 9*/15; i++) {
            var item = self.getImgById(i % 15);
            if (i >= extraindex && (i+ self.pagestart-extraindex < self.curList.length)) {
                if(self.isHasImg(self.curList[i+ self.pagestart-extraindex].IconSrc))
                   item.setSrc(self.curList[i+ self.pagestart-extraindex].IconSrc);

                   item.visibility = 1;
            }
            else {
                item.visibility = -1;
            }
        }
    };

    this.setFocusIcon = function () {
        if (self.curIndex >= 0) {
            self.getImgById((self.curIndex- self.pagestart) % 15).setFocus(true);
        }
        else {
            self.getStaticAdImg().setFocus(true);
        }
        self.update2LevelName();
    };


    this.update2LevelName = function(){
        var str = "";
        var win = self.win.getChild("tvPortal2LevelName");
        var curId = sysCom.getMemConfig("current_app_id");
        var app = appCom.getAppInfoById(curId);
        if(!app){
            win.value="";
            return;
        }
        else if(app.launch_app_name == "tvportal"){
            win.value="";
            return;
        }
        else{
            str = app.app_name;
        }

        strArray = str.split(";");

        strArray.pop();

        if(sysCom.config.menuLanguageIndex == 0){
            win.value = strArray[1].slice(5);
        }
        else{
            win.value = strArray[0].slice(5);
        }
    };

    this.onkeyUp = function () {
        var newpage = false;
        var extarindex = 0;
        var item = self.getImgById(0);
        if(self.pagestart == 0 && item.visibility == -1)
            extarindex=3;
        if (self.curIndex < 0) {
            return;
        }
        console.log("onkeyUp pagestart="+self.pagestart);
        console.log("onkeyUp curIndex="+self.curIndex);
        console.log("onkeyUp extarindex="+extarindex);

        //判断是否在最上面一行
        if (self.curIndex - extarindex < 3) {
            console.log("onkeyUp this top line");
            self.curIndex -= extarindex;
            self.preIndex -= extarindex;
            self.pagestart-=extarindex;

            if(self.curIndex < 0)
                self.curIndex = 0;

            if(self.preIndex < 0)
                self.preIndex = 0;

            if(self.pagestart < 0)
                self.pagestart = 0;

            self.initPortalBylist(false);
            self.setFocusIcon();
            self.win.update();
            return;


        }
        else {

           

            self.preIndex = self.curIndex;
            self.curIndex -= 3;

            if(  (self.preIndex-self.pagestart)< 6) {
                newpage = true;

               self.pagestart -= 3;
                if(self.pagestart < 0) {
                    self.pagestart = 0;

                }
                if(self.curIndex <0) {

                    self.curIndex = 0;
                }
                self.preIndex = self.curIndex+3;
                console.log("zxg onkeyUp pagestart = " + self.pagestart);
                console.log("zxg onkeyUp curIndex = " + self.curIndex);
            }
        }

        self.moveUpdate(newpage,false);
    };

    this.onkeyDown = function () {
        var newpage = false;
        var extarindex = 0;
        if(self.pagestart == 0)
            extarindex=3;

        if (self.curIndex < 0 || self.curList.length <=3  ) {
            return;
        }
        //判断是否在最后一行
        if (self.curIndex - extarindex + 3 >= self.curList.length) {
            if (parseInt((self.curIndex-extarindex+3) / 3 ,10)==parseInt((self.curList.length-1-extarindex+3) / 3,10)) {
                self.preIndex = 0;
                self.curIndex = 0;
                self.pagestart = 0;


                if(self.curList.length > 9)
                    newpage = true;
                else
                    self.curIndex = self.curList.length - 1+extarindex;;
                console.log("return onkeyDown self.curList.length="+self.curList.length);
                console.log("return onkeyDown self.pagestart="+self.pagestart);
                console.log("return onkeyDown self.curIndex="+self.curIndex);
            }
            else {
                self.preIndex = self.curIndex;
                console.log("onkeyDown self.curList.length="+self.curList.length);
                if((self.preIndex-self.pagestart)>= 9) {
                    newpage = true;
                    self.pagestart += 3;
                    self.curIndex = self.curList.length - 1;
                }
                else
                {
                    self.curIndex = self.curList.length - 1+extarindex;
                }
                console.log("onkeyDown self.pagestart="+self.pagestart);
                console.log("onkeyDown self.curIndex="+self.curIndex);
                console.log("onkeyDownextarindex="+extarindex);

            }
        }
        else {
            self.preIndex = self.curIndex;
            self.curIndex += 3;
            if(  (self.preIndex-self.pagestart)>= 9) {
                newpage = true;
                var item = self.getImgById(0);
                if(self.pagestart == 0 && self.curIndex >= 12 && self.curIndex < 15 && item.visibility != 1) {

                    self.initPortalBylist(false);
                    self.curIndex -= 3;
                    self.preIndex -=3;

                }
                else {

                    self.pagestart += 3;
                }
                console.log("zxg onkeyDown pagestart = " + self.pagestart);
                console.log("zxg onkeyDown curIndex = " + self.curIndex);
            }
        }

        self.moveUpdate(newpage,true);
    };

    this.onkeyLeft = function () {

        var extraindex =3;
        //判断焦点是否在广告上
        if (self.curIndex < 0) {
            self.curIndex = self.preIndex;
        }
        //判断焦点是否在第一个应用上
        else if ((self.curIndex-self.pagestart-extraindex) == 0) {
            /*self.preIndex = self.curIndex;
            self.curIndex = self.curList.length - 1;*/
            return;
        }
        else {
            self.preIndex = self.curIndex;
            self.curIndex -= 1;
        }

        self.moveUpdate(false,true);
    };

    this.onkeyRight = function () {

        console.log("onkeyRight self.curIndex  ="+self.curIndex);
        console.log("onkeyRight self.pagestart ="+self.pagestart);
        console.log("onkeyRight self.preIndex ="+self.preIndex);

        if ((self.curIndex-self.pagestart) < 0) {
            return;
        }

        //判断是否跳到广告
        if (self.checkIsJumpToAd()) {
            self.preIndex = self.curIndex;
            self.curIndex = -1;
        }
        else {
            self.preIndex = self.curIndex;
            self.curIndex += 1;
        }
        self.moveUpdate(false,true);
    };

    this.onkeyCHNUP = function () {

    };

    this.onkeyCHNDOWN = function () {

    };

    this.onkeyEnter = function () {
        if (self.curIndex >= 0) {

            var item = self.getImgById(0);
            if(self.pagestart == 0 && item.visibility!=1 )
            {
                self.curIndex = self.curIndex - 3;
            }

            var app = self.curList[self.curIndex];
            if (app.category == 1) {
                if (appCom.getAppListByLinkPonit(app.link_point).length <= 0) {
                    return;
                }
                //check adult
                if(app.launch_app_name=="adultf") {
                    self.showAdultPasswdDialog();
                    return;
                }
                /////////////////
                var last_app_id = sysCom.getMemConfig("current_app_id");
                sysCom.setMemConfig("last_app_id", last_app_id);
                sysCom.setMemConfig("current_app_id", app.app_id);


                var pageinfo = {
                        preIndex:self.preIndex,
                        curIndex: self.curIndex,
                        pagestart:self.pagestart,
                       extraindex:self.extraindex
                    };

                var classarr= sysCom.getMemConfig("appclass");

                if(classarr)
                {
                    classarr.push(pageinfo);
                    console.log("push 1 curIndex="+ self.curIndex);
                    console.log("push 1 pagestart="+ self.pagestart);
                }
                else
                {
                    classarr =new Array();
                    classarr.push(pageinfo);
                    console.log("push 0 curIndex="+ self.curIndex);
                    console.log("push 0 pagestart="+ self.pagestart);
                }
                sysCom.setMemConfig("appclass",classarr);

                self.appclass+=1;
                self.preIndex = 0;
                self.curIndex = 0;
                self.pagestart = 0;
                self.curList = [];
                self.getAppList();
                self.initPortalBylist(false);
                self.setFocusIcon();
                self.win.update();
            }

            if (app.category == 2) {

                var pageinfo = {
                    preIndex:self.preIndex,
                    curIndex: self.curIndex,
                    pagestart:self.pagestart,
                    extraindex:self.extraindex

                };

                var classarr= sysCom.getMemConfig("appclass");

                if(classarr)
                {
                    classarr.push(pageinfo);
                    console.log("push 3 curIndex="+ self.curIndex);
                    console.log("push 3 pagestart="+ self.pagestart);
                }
                else
                {
                    classarr =new Array();
                    classarr.push(pageinfo);
                    console.log("push 4 curIndex="+ self.curIndex);
                    console.log("push 4 pagestart="+ self.pagestart);
                }
                sysCom.setMemConfig("appclass",classarr);

                self.appclass+=1;

                appCom.goAppByID(app.app_id);
            }
        }
        else {
            self.adModule.onkey({keyCode: UI.KEY.ENTER});
        }
    };


    this.inAdultfCnt = 0;
    this.check30sInAdultf = function(){
        self.inAdultfCnt = 0;

        self.check30sInAdultfTimer = setInterval(function(){
            self.inAdultfCnt++;
            var app = appCom.getAppInfoById(sysCom.getMemConfig("current_app_id"));
            if(app.launch_app_name != "adultf"){
                clearInterval(self.check30sInAdultfTimer);
                self.check30sInAdultfTimer = null;
                self.inAdultfCnt = 0;
                return;
            }

            if(self.inAdultfCnt > 30){
                clearInterval(self.check30sInAdultfTimer);
                self.check30sInAdultfTimer = null;
                self.inAdultfCnt = 0;
                //back to Main Menu
                self.onkeyBack();
            }
        },1000);
    };

    function handleLinkPoint(linkPoint) {
        var lpArray = new Array();
        if (linkPoint) {
            lpArray = linkPoint.split(":");
        }

        lpArray.forEach(function (data, index, arr) {
            arr[index] = parseInt(data, 10);
        });
        return lpArray;
    }

    this.onkeyBack = function () {
        var current_app_id = sysCom.getMemConfig("current_app_id");
        var lp = appCom.getLinkPointByAppId(current_app_id);
        var reuse = false;
        if (lp != "0") {
            var last_app_id = sysCom.getMemConfig("last_app_id");
            sysCom.setMemConfig("current_app_id", last_app_id);

            self.curList = [];
            self.getAppList();
            self.preIndex = 0;

            self.curIndex = self.getIndexByAppId(current_app_id);
            self.pagestart = self.curIndex%3;

            var classarr= sysCom.getMemConfig("appclass");
            if(classarr)
            {
                var pageinfo= classarr.pop();
                if(pageinfo)
                {
                    self.curIndex = pageinfo.curIndex;
                    self.pagestart = pageinfo.pagestart;
                    self.extraindex = pageinfo.extraindex;
                    reuse  = true;
                    console.log("onkeyBack pop curIndex="+ self.curIndex);
                    console.log("onkeyBack pop pagestart="+ self.pagestart);
                }
                sysCom.setMemConfig("appclass",classarr);
            }

            self.appclass-=1;


            self.initPortalBylist(reuse);
            self.setFocusIcon();
            self.win.update();
        }
    };

    this.onkeyMenu = function () {
        var current_app_id = sysCom.getMemConfig("current_app_id");
        var lp = appCom.getLinkPointByAppId(current_app_id);
        if (lp != "0") {
            var last_app_id = sysCom.getMemConfig("last_app_id");
            sysCom.setMemConfig("current_app_id", last_app_id);
            self.preIndex = 0;
            self.curList = [];
            self.getAppList();
            self.curIndex = 0;
            self.initPortalBylist(false);
            self.setFocusIcon();
            self.win.update();
        }
        else{
            self.preIndex = self.curIndex;
            self.curIndex = 0;
            self.initPortalBylist(false);
            self.setFocusIcon();
            self.win.update();
        }
    };


    this.moveUpdate = function (newpage,beforeffect) {

        if(self.curIndex == -1)
        {
             self.setFocusIcon();
             self.win.update();
        }
        else {
            if (newpage == true) {


              if(beforeffect == true)
                  self.initPortalBylist(false);

                self.addTurnPageEffect(function () {

                    if(beforeffect == false)
                        self.initPortalBylist(false);
                    self.addFocusEffect();
                    self.win.update();

                });
            }
            else {
                // self.setFocusIcon();
                //self.win.update();
                self.addFocusEffect();
                self.win.update();
            }
        }
    };

    this.checkIsJumpToAd = function () {
        var extarindex = 0;
        if(self.pagestart == 0)
            extarindex=3;
        if (self.curIndex-extarindex == self.curList.length - 1) {
            return true;
        }
        else if ((self.curIndex-self.pagestart + 1) % 12 == 0 && self.curIndex != 0) {
            return true;
        }
        return false;
    };
/*
    this.addPreEffect = function () {
        if (self.preIndex == self.curIndex) {
            return;
        }
        setTimeout(function () {
            var item = self.getImgById(self.preIndex % 9);
            var ScaleIn = {
                type: "Scale",
                w0: imgW + expandSize,
                h0: imgH + expandSize,
                "position": "center",
                duration: 100
            };
            item.setEffect(ScaleIn, false);
        }, 10);
    };
*/
    this.addFocusEffect = function () {
        if (self.curIndex < 0) {
            return;
        }
        self.setFocusIcon();
        self.win.update();
        var item = self.getImgById((self.curIndex-self.pagestart) % 15);
        var ScaleOut = {
            type: "Scale",
            w1: imgW + expandSize /2,
            h1: imgH + expandSize /2,
            "position": "center",
            duration: 200
        };
        item.setEffect(ScaleOut, function(){
             self.setFocusIcon();
             self.win.update();
        });
    };

    this.addTurnPageEffect = function (cb) {
        var step = 0;
        if (self.curIndex < 0) {
            step = 0;
        }
        else {
            var a = self.curIndex;//parseInt(self.curIndex / 9, 10);
            var b = self.preIndex;//parseInt(self.preIndex / 9, 10);
            if (a != b && a > b) {
                step = 1;
            }

            if (a != b && a < b) {
                step = -1;
            }

        }
        //step < 0   up      step > 0  down     step == 0  no
        if (step < 0) {
            var SlideDown = {type: "Slide", y0: left_t-(imgH + spaceH), y1: left_t, duration: 20, visibility: 1};
            self.leftDlg.setEffect(SlideDown, cb);
        }
        else if (step > 0) {
            var SlideUp =  {type: "Slide", y0: left_t , y1: left_t-(imgH + spaceH), duration: 20, visibility: 1};
            self.leftDlg.setEffect(SlideUp, cb);
        }
        else {
            cb();
        }
    };


    /************tvportal Time更新区***********/
    this.startUpdateTime = function () {
        self.stopUpdateTime();
        self.updateTimer = setInterval(self.updateTimeTask, 1000 * 10);
    };


    this.stopUpdateTime = function () {
        if (self.updateTimer) {
            clearInterval(self.updateTimer);
            self.updateTimer = null;
        }
    };


    this.updateTimeTask = function () {
        self.getTimeLabel().value = self.getTvportalTime();
        //this.getEthImg().hide();
        self.updateEthStatus();
        self.win.update();
    };

    this.getTvportalTime = function () {
        var date = new Date();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var week = date.getDay();
        var hour = date.getHours();
        var min = date.getMinutes();

        month = (month < 10) ? "0" + month : "" + month;
        day = (day < 10) ? "0" + day : "" + day;
        hour = (hour < 10) ? "0" + hour : "" + hour;
        min = (min < 10) ? "0" + min : "" + min;
        var str = month + "/" + day + "(" + Lp.getValue("w" + week) + ")" + hour + ":" + min;
        return str;
    };
    /************tvportal 网络状态更新区***********/

    this.addNetworkListener = function () {

    };

    this.updateWifiStatus = function () {

    };

    this.updateEthStatus = function () {

        var cminfo = CableModem.cmGetIpInfo(false);
        if(cminfo) {
           if(cminfo.online==12)
           {
               //console.log("updateEthStatus icon_ethernet")
               this.getEthImg().setSrc( "tvportal/icon_ethernet");
               this.getEthImg().show();
           }
           else
           {
               //console.log("updateEthStatus icon_ethernet_warning 1")
               this.getEthImg().setSrc("tvportal/icon_ethernet_warning");
               this.getEthImg().show();
           }
        }
        else {
            //console.log("updateEthStatus icon_ethernet_warning 2")
            this.getEthImg().setSrc("tvportal/icon_ethernet_warning");
            this.getEthImg().show();
        }
    };


    /*************************EPG  视频区域操作*************************/
    this.videoStatus = {
        "noSign": false,
        "noCard": false,
        "noCertification": false,
        "eventLock": false
    };

    this.registerCb = function () {
        //signal
        eventCom.registerCallback(1, function (obj) {
            if (obj.code == eventCom.EVENTCODE.CS_EVT_DVB_SIGNAL_LOST) {
                self.videoStatus.noSign = true;
            }
            else {
                self.videoStatus.noSign = false;
            }
            self.setVideoImg(self.getDisplayAreaImg());
        });
    };

    /**
     * 设置视频窗口的提示图片显示
     * @param win
     */
    this.setVideoImg = function (win) {
        if (self.videoStatus.noSign) {
            win.visibility = 1;
            win.setSrc("TipImg/noSign");
            win.update();
            return;
        }
        if (self.videoStatus.noCard) {
            win.visibility = 1;
            win.setSrc("TipImg/no_smartCard");
            win.update();
            return;
        }
        if (self.videoStatus.noCertification) {
            win.visibility = 1;
            win.setSrc("TipImg/no_certification");
            win.update();
            return;
        }
        if (self.videoStatus.eventLock) {
            win.visibility = 1;
            win.setSrc("TipImg/EPG_eventLocked");
            win.update();
            return;
        }
        win.visibility = -1;
        win.update();
    };

    /************tvportal 广告控制区***********/
    this.startAd = function () {

        self.checkAdTimer = setInterval(function () {
            if (dsmssCom.adStatus == "4"){

                clearInterval(self.checkAdTimer);
                self.checkAdTimer = null;
                var so= null;
                if(caCom && caCom.caParams) {
                    so = caCom.caParams.so;
                }
                so = "05";
                var str = dsmssCom.getAdXml(so);

                var p = {
                    dat: str,
                    url: dsmssCom.getAdBasePath(so),    //广告文件文件夹路径
                    block: "portal",   //广告窗口位置:"portal","epg","miniepg"
                    win: self.win,  //父窗口
                    adWin: self.getStaticAdImg()     //广告子窗口
                };

                self.adModule = new AD(p);
                self.adModule.start();
            }
        }, 1000);
    };


    /************tvportal 后台窗口控制区***********/
    this.enterStbInfoNum = [];
    this.enterStbInfoCheck = function(e){
        self.enterStbInfoNum.push(e.keyCode);
        var str = self.enterStbInfoNum.join("");
        var str1 = ""+UI.KEY.CHAR0+UI.KEY.CHAR0+UI.KEY.CHAR0+UI.KEY.CHAR0+UI.KEY.CHAR0;
        if(str.indexOf(str1) != -1){
            self.stbInfoDlg.show(self.getStbInfoParams());
            self.enterStbInfoNum = [];
        }

        if(self.enterStbInfoNum.length >= 5){
            self.enterStbInfoNum.splice(0,1);
        }
    };

    this.getStbInfoParams = function(){
        var caNum = CA.getCardNo(false);
        var deviceInfo = utility.getDeviceInfo(false);
        caNum = caNum.errorcode == 0 ? caNum.cardno : null;
        if(caNum){
            caNum = caNum.substring(caNum.length-5,caNum.length);
        }
        else{
            caNum = "N/A";
        }
        var stbInfoParams = {
            "title":Lp.getValue("stbInfo")+":",
            "itemArray":[
                {
                    name:Lp.getValue("stbModel")+":",
                    content:"CMU-8650"
                },
                {
                    name:Lp.getValue("caCardNum5")+":",
                    content:caNum
                },
                {
                    name:Lp.getValue("System_Version")+":",
                    content:"C"+ deviceInfo.swVersion
                }
            ],
            "okIcon":"./black/dialog/ico_ok.png",
            "foot":Lp.getValue("exit")
        };
        return stbInfoParams;
    };

    /************tvportal 主题切换控制区***********/
     this.showPasswdDialog = function(){
        var p = {
            win : self.win,
            rightPasswd : sysCom.config.ParentalPin,
            proc : self.passwdProc,
            rightDo : self.passwdCb
        };
        self.passwdDlg = new PasswdDialog(p);
        self.passwdDlg.show();
    };

    this.showAdultPasswdDialog = function(){
        var p = {
            win : self.win,
            rightPasswd : sysCom.config.ParentalPin,
            proc : self.passwdProc,
            rightDo : self.adultpasswdCb
        };
        self.passwdDlg = new PasswdDialog(p);
        self.passwdDlg.show();
    };

    this.closePasswdDialog = function(){
        if(self.passwdDlg){
            self.passwdDlg.close(true);
            self.passwdDlg = null;
        }
    };

    this.adultpasswdCb = function(){

        var item = self.getImgById(0);
        if(self.pagestart == 0 && item.visibility!=1 )
        {
            self.curIndex = self.curIndex - 3;
        }
        var app = self.curList[self.curIndex];
        var last_app_id = sysCom.getMemConfig("current_app_id");
        sysCom.setMemConfig("last_app_id", last_app_id);
        sysCom.setMemConfig("current_app_id", app.app_id);



        var pageinfo = {
            preIndex:self.preIndex,
            curIndex: self.curIndex,
            pagestart:self.pagestart,
            extraindex:self.extraindex
        };

        var classarr= sysCom.getMemConfig("appclass");

        if(classarr)
        {
            classarr.push(pageinfo);
            console.log("push 1 curIndex="+ self.curIndex);
            console.log("push 1 pagestart="+ self.pagestart);
        }
        else
        {
            classarr =new Array();
            classarr.push(pageinfo);
            console.log("push 0 curIndex="+ self.curIndex);
            console.log("push 0 pagestart="+ self.pagestart);
        }
        sysCom.setMemConfig("appclass",classarr);

        self.preIndex = 0;
        self.curIndex = 0;
        self.pagestart = 0;
        self.extraindex = 0;

        self.curList = [];
        self.getAppList();
        self.initPortalBylist(false);
        self.setFocusIcon();
        self.win.update();
        self.check30sInAdultf();
    };
    this.passwdCb = function(){

        self.videoStatus.eventLock = false;
        self.setVideoImg(self.getDisplayAreaImg());
        //播放频道
        self.playBarker();

        self.isLock = false;
    };

    this.passwdProc = function(e){
        var ret = true;
        switch(e.keyCode){
            /*直播按键   不处理
             *主页按键   不处理
             *音量键     不处理
             *静音键     不处理
             *其他按键   处理
            */
            case UI.KEY.ENTER:
                self.passwdDlg.onkeyReturn();
                break;
            case UI.KEY.BACKSPACE:
                self.closePasswdDialog();
                break;
            default:
                ret = true;
                break;
        }
        return ret;
    };
}

Tvportal.prototype = UIModule.baseModule;
