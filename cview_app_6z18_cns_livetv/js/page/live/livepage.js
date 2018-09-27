/**
 * Created by 2017-07-05
 */
console.log("uiCom  end"+(new Date()).getTime());
function LivePage(params, srcModule){
    var self = this;
    this.lastPlaytime = 0;
    this.lastPlaytimer = null;
    this.passwdDlg = null;

    this.tickerTimer = null;


    this.dlgParam = [
        {uiType : UIFrame, id : "liveFrame", l : 0, t : 0, w : UI.width, h : UI.height, type : "none"},
        {uiType : UIImg, id : "audioBgImg", ol : 0, ot : 0, w : UI.width, h : UI.height,visibility:"-1",stretch:"HV"},
        {uiType : UIImg, id : "recordingImg", ol : 100, ot : 60,visibility:"-1",stretch:"HV",src:"live/record_icon"}
    ];

    this.noChTipParam = [
        {uiType:UIFrame,id:"tips_bk",l:400,t:260,w:480,h:200,type:"img",imgNames:["dialog/dialog_bg"],visibility:0,stretch:"HV"},
        {uiType:UILabel,w:480,h:50,ol:0,ot:20,font:uiCom.font.F35,value:Lp.getValue("No_Channels"),HAlign:"center"},
        {uiType:UILabel,w:480,h:50,ol:0,ot:90,font:uiCom.font.F25,value:Lp.getValue("Search_Channels_Frist"),HAlign:"center"},
        {uiType:UIImg,w:47,h:20,ol:180,ot:160,src:"live/ico_home"},
        {uiType:UILabel,w:100,h:50,ol:180+47+6,ot:160-6,font:uiCom.font.F20,value:Lp.getValue("Main_Menu")}
    ];
    /****************************live 页面标准操作****************************/

    this.open = function() {
        this.defOpen();
        console.log("LivePage Open!");
    };

    this.close = function(){
        this.defClose();
        console.log("LivePage Close");
    };

    this.start = function(){
        console.log("LivePage start!");
        var p = {
            win : self.win,
            live : self
        };
        self.noChTip = UI.createGroup(self.noChTipParam,"noChTip",this.win);

        if(dtvCom.chs.length <= 0)
        {
            self.noChTip.show();
        }

        self.banner = new Banner(p);

        self.chlist = new ChannelList(p);

        self.numInput = new NumChangeCh(p);

        self.stbInfoDlg = new stbInfoDialog();

        self.changeCh(null, 0, true, self.passwdCb, self.bannerPasswdOnkey,3);

        setTimeout(function(){
            var rect = {
                l:0,
                t:0,
                w:1280,
                h:720
            };
            var r = getVideoRect(rect,sysCom.config.Reslution);
            dtvCom.mp.mpSetVideoSize(r.l, r.t, r.w, r.h, function(){});
            self.startTicker();

            self.startCa();
        },500);
        self.sigInfo = new signalInfoDialog();

        lockCom.registerCallback(1,self.onTimeLock);
        lockCom.registerCallback(0,self.onTimeUnlock);
    };

    this.stop = function() {
        console.log("LivePage stop!");
        /*clearInterval(self.tickerTimer);
        self.tickerTimer = null;
        if(self.ticker){
            self.ticker.stop();
        }
        dtvCom.stop();*/
    };

    this.resume = function(){
        self.changeCh(null, 0, true, self.passwdCb, self.bannerPasswdOnkey,3);
        console.log("livePage resume");
    };

    this.pause = function(){
        console.log("livePage pause");
    };

    this.startCa = function(){

        self.loadCaDlgTimer = setInterval(function(){
            if(typeof CaMsgDialog == 'function' && !self.caMsgDlg){
                self.caMsgDlg = new CaMsgDialog("./black/live/BBTV_logo.png","./black/live/ico_blue.png");
            }

            if(typeof CaUpdateProgress == 'function' && !self.caUpdategro){
                self.caUpdategro = new CaUpdateProgress();
            }

            if(typeof CaMailDialog == 'function' && !self.caMailDlg){
                self.caMailDlg = new CaMailDialog("./black/live/mail_notify.png",function(){
                    appCom.goAppByName("mailbox",false);
                    self.caMailDlg.close();
                });
            }

            if(typeof CaCurtainDialog == 'function' && !self.caCurtainDlg){
                self.caCurtainDlg = new CaCurtainDialog("./black/live/curtain2.png","./black/live/ico_blue.png","./black/live/BBTV_logo.png");
            }

            if(typeof CASystemInfoDialog == 'function' && !self.caSysDlg){
                self.caSysDlg = new CASystemInfoDialog();
            }

            if(typeof  MailShowDlg == 'function' && !self.showMailDlg){
                self.showMailDlg = new MailShowDlg("./black/images/mailbox_bg_800x440.png","./black/images/ico_back.png");
            }

            if(self.caMsgDlg && self.caUpdategro && self.caMailDlg && self.caCurtainDlg && self.caSysDlg && self.showMailDlg){
                clearInterval(self.loadCaDlgTimer);
                self.loadCaDlgTimer = null;
            }
        },1000);

        eventCom.registerCallback(1, function (obj) {
            if (obj.code == eventCom.EVENTCODE.CS_EVT_DVB_SIGNAL_LOST) {
                if(self.caMsgDlg){
                    self.caMsgDlg.show({msgid:0x40});
                }
            }
            else {
                if(self.caMsgDlg && self.caMsgDlg.params && self.caMsgDlg.params.msgid == 0x40){
                    self.caMsgDlg.hide();
                }
            }

        });

        eventCom.registerCallback(3,function(obj){
            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_SHOW_MESSAGE) {
                if(self.caMsgDlg){
                    self.caMsgDlg.show({msgid:obj.data.msgId});
                }
            }

            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_HIDE_MESSAGE)
            {
                if(self.caMsgDlg){
                    console.log("eventCom.EVENTCODE.CS_EVT_CA_HIDE_MESSAGE");
                    self.caMsgDlg.hide();
                }
            }

            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_SHOW_MAIL)
            {
                var mailHead = CA.getMailHead(obj.data.mailId);
                if(mailHead.importance){
                    var mailContent = CA.getMailContent();
                    var params = {
                        title:mailHead.mailtitle,
                        text:mailContent.mailcontent
                    };
                    self.showMailDlg(params);
                }
                else{
                    if(self.caMailDlg){
                        self.caMailDlg.show();
                    }
                }


            }

            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_HIDE_MAIL)
            {
                if(self.caMailDlg){
                    self.caMailDlg.hide();
                }
            }

            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_SHOW_CURTAIN_NOTIFY){
                if(self.caCurtainDlg){
                    self.caCurtainDlg.show(obj.data);
                }
            }

            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_LOCK_SERVICE){
                //锁定按键
                caCom.forceChangeChannelLock = true;
                obj.data.modulation = getQamMode(obj.data.modulation);
                obj.data.audiotype = getAudioType(obj.data.audiotype);
                obj.data.videotype = getVideoType(obj.data.videotype);
                var url = dtvCom.getChannelByCaLockService(obj.data);
                if(url){
                    console.log("CS_EVT_CA_LOCK_SERVICE  getChannelByCaLockService :"+url);
                    dtvCom.mp.mpStart(url,false);
                }
                else{
                    //播放指定频道
                    url = "live://"
                        + "signal=" + 0
                        + "&freq=" + obj.data.frequency
                        + "&symbol=" + obj.data.symbolrate
                        + "&qam=" + obj.data.modulation
                        + "&spectrum" + 0
                        + "&aPid=" + obj.data.audiopid
                        + "&vPid=" + obj.data.videopid
                        + "&pcrPid=" + obj.data.pcrpid
                        + "&aStreamType=" + obj.data.audiotype
                        + "&vStreamType=" + obj.data.videotype
                        + "&pmtPid=" + 0
                        + "&serviceId=" + 0;
                        console.log("CS_EVT_CA_LOCK_SERVICE can not find channel in db:"+url);
                        dtvCom.mp.mpStart(url,false);
                }

                var index = dtvCom.findChIndexByParams(obj.data);
                if(index >= 0){
                    console.log("findIndexByParams:"+index);
                    sysCom.config.chIndex = index;
                    sysCom.saveConfig();
                }
            }
            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_UNLOCK_SERVICE){
                //解除锁定按键
                caCom.forceChangeChannelLock = false;
            }

            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_CARD_REMOVE){
                //self.caMsgDlg.show({msgid:0x44});
                console.log("livepage CS_EVT_CA_CARD_REMOVE 1")
            }

            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_CARD_INSERT){
                console.log("livepage CS_EVT_CA_CARD_INSERT 1");
                /*if(self.caMsgDlg.params && self.caMsgDlg.params.msgid == 0x44){
                    self.caMsgDlg.hide();
                }*/
            }

            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_ACTION_REQUEST){
                //重启机顶盒
                if(obj.data.actiontype == 0){
                    self.caMsgDlg.show({msgid:0x42});
                }

                //冻结机顶盒
                if(obj.data.actiontype == 1){
                    self.caMsgDlg.show({msgid:0x21});
                }

                //解冻机顶盒
                if(obj.data.actiontype == 4){
                    self.caMsgDlg.hide();
                }

                //恢复出厂设置
                if(obj.data.actiontype == 5){
                    self.caMsgDlg.show({msgid:0x43});
                    setTimeout(function(){
                        //清空数据库
                        DB.dbClearAll(false);
                        utility.reboot(false);
                    },3000);
                }

                //显示菜单信息
                if(obj.data.actiontype == 6){
                    if(self.caMsgDlg){
                        self.caMsgDlg.hide();
                    }

                    if(typeof CASystemInfoDialog == 'function'){
                        self.showCaSystemInfo();
                    }
                }
            }

            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_PROGRESS_DISPLAY){
                if(self.caUpdategro){
                    self.caUpdategro.show(obj.data);
                }
            }

        });
    };

    function getInfo(){

        var info={
            serial_number:"0000000000000000",
            mac:"00:00:00:00:00",
            hfc_mac:"00:00:00:00:00",
            wan_mac:"00:00:00:00:00",
            hard_version:"",
            soft_version:"",
            loader_version:"1",
            bouquet_id:"25149",
            smart_card_number:"00000000000000",
            ca_version:"",
            system_version:"3.10.40",//該C01.01(主版本，次版本)
            video_function:"裝置未就緒（代碼:PVR002）"//裝置未配對（代碼:PVR003）
        };

        var deviceInfo = utility.getDeviceInfo(false);
        if(deviceInfo){
            info.mac = deviceInfo.mac;
            info.hard_version = deviceInfo.hwVersion;
            info.soft_version = deviceInfo.swVersion;
            info.serial_number = deviceInfo.sn;
            info.system_version="C"+deviceInfo.swVersion;

        }
        //ca相关
        var ret = CA.getCardNo(false);
        if(ret.errorcode == 0){
            info.smart_card_number = ret.cardno;
        }
        //get bouquet id

        if(caCom && caCom.caParams) {
            info.bouquet_id  = ""+caCom.caParams.bouquetId ? caCom.caParams.bouquetId : sysCom.config.bouquetID;//sysCom.config.bouquetID;
        }

        info.bouquet_id =""+parseInt(info.bouquet_id);
        //get HFC MAC and WLAN MAC
        var cminfo = CableModem.cmGetIpInfo(false);
        console.log("cminfo="+cminfo);
        if(cminfo) {
            console.log("cminfo.hfcMac="+cminfo.hfcMac);
            var mac = cminfo.hfcMac.replace(/ /g, ":");
            if (mac.substr(mac.length - 1, 1) == ":") {
                mac = mac.substr(0, mac.length - 1);
            }
            info.hfc_mac = mac;
            info.wan_mac = mac;
        }

        //get CAK info
        var data = CA.getCasInfo(false);
        if (data && data.errorcode == 0) {
            info.ca_version = data.calibversion;
        }
        return info;
    }

    this.showCaSystemInfo = function(){
        var info = getInfo();
        var caSysParams = {
            "title":"系統諮詢",
            "itemArray":[
                {
                    name:"机上盒序号:",
                    content:info.serial_number
                },
                {
                    name:"MAC:",
                    content:info.mac
                },
                {
                    name:"HFC MAC:",
                    content:info.hfc_mac
                },
                {
                    name:"WAN MAC:",
                    content:info.wan_mac
                },
                {
                    name:"硬件版本:",
                    content:info.hard_version
                },
                {
                    name:"软件版本:",
                    content:info.soft_version
                },
                {
                    name:"载入器版本:",
                    content:info.loader_version
                },
                {
                    name:"Bouquet ID:",
                    content:info.bouquet_id
                },
                {
                    name:"智慧卡号码:",
                    content:info.smart_card_number
                },
                {
                    name:"CA 版本:",
                    content:info.ca_version
                },
                {
                    name:"系统版本:",
                    content:info.video_function
                }
            ]
        };
        self.caSysDlg.show(caSysParams);
    };

    this.startTicker = function() {
        if(dtvCom.length <= 0)
        {
            return;
        }

        self.tickerTimer = setInterval(function(){
            if(typeof Ticker != 'function'){
                return;
            }

            if(dsmssCom.tickerStatus == "4")
            {
                clearInterval(self.tickerTimer);
                self.tickerTimer = null;
                var so = 0;
                if(caCom && caCom.caParams) {
                    so = caCom.caParams.so;
                }
                var str = dsmssCom.getTickerDat(15);
                console.log("getTickerDat = "+str);
                var tickerParams = {
                    getCurrentCh: function(){
                        if(dtvCom.chs.length > 0 && sysCom.config.chIndex < dtvCom.chs.length){
                            return dtvCom.chs[sysCom.config.chIndex].logicNo;
                        }
                        else {
                            return 0;
                        }
                    },
                    url:dsmssCom.getTickerBasePath(),
                    areaId: "0000",
                    dat:str
                };
                self.ticker = new Ticker(tickerParams);
                self.ticker.start();
            }

        },1000);
    };

    /****************************live 换台操作****************************/
    this.changeCh = function(idn, step, showBannerFlag, cb, proc,way){
        //变更当前节目号
        dtvCom.updateIndex_noupdatedbase(idn,step);
        //显示banner条
        if(showBannerFlag){
            self.banner.show(true, true);
        }

        var now = new Date().getTime();

        var difftime = (now-this.lastPlaytime);

        if(this.lastPlaytimer != null)
        {
            clearTimeout(this.lastPlaytimer);
            this.lastPlaytimer = null;
        }

        if( difftime > 500 ) {
            console.log("changeCh difftime > 500 ");

            this.lastPlaytime = now;

            sysCom.saveConfig();

            //检查锁
            var lock_ret = self.checkLock();
            if (lock_ret.flag) {
                //停止播台
                dtvCom.mp.mpStop();
                //show lock paaawd
                self.showPasswd(cb, proc);
            }
            else
                {
                self.doChangeCh(idn, step, true);
                lockCom.unLockCallback(dtvCom.chs[sysCom.config.chIndex], lock_ret.level);
            }
        }
        else
        {
            console.log("changeCh difftime  < 500 ");
            self.lastPlaytime = now;
            self.lastPlaytimer  = setTimeout(function(){
                sysCom.saveConfig();
                //检查锁
                var lock_ret = self.checkLock();
                if (lock_ret.flag) {
                    //停止播台
                    dtvCom.mp.mpStop();
                    //show lock paaawd
                    self.showPasswd(cb, proc);
                }
                else {
                    self.doChangeCh(idn, step, true);
                    lockCom.unLockCallback(dtvCom.chs[sysCom.config.chIndex], lock_ret.level);
                }
            },800);
        }
    };


    this.doChangeCh = function(idn, step, real) {
        self.updateBackground();

        Subtitle.subtStop(null,false);

        dtvCom.doChangeCh(true, null);

        self.showRecordingIcon();
        //打开subtitle
        ch = dtvCom.chs[sysCom.config.chIndex];

        if(real && ch && ch.subt && ch.subt.length > 0){

            if(!ch.userData){
                ch.userData = {};
                ch.userData.subtitleSelect = 0;
            }

            if(sysCom.config.subtitleStatus){
                ch.userData.subtitleSelect  = 0;
                for(var i = 0;i < ch.subt.length;i++){
                    if(getCountryByCode(ch.subt[i].lang) == "chi"){
                        ch.userData.subtitleSelect = i;
                    }
                }
                var params = {
                    "pid": ch.subt[ch.userData.subtitleSelect].pid,
                    "pageId": 2,
                    "ancillaryId": 1
                };

                Subtitle.subtStart(params,function(){});
            }
            else{
                ch.userData.subtitleSelect  =  -1;
            }
        }


    };

    /****************************live 各种锁的操作****************************/
    this.checkLock = function(){
        var ret={"flag":0,"level":0};
        var level = 0;
        var pfArray = epgCom.getChannelPf(dtvCom.chs[sysCom.config.chIndex], false);
        if(pfArray && pfArray.length >= 1){
            level = pfArray[0].level
        }
        var flag = lockCom.checkAllLock(dtvCom.chs[sysCom.config.chIndex], level);
        ret.flag = flag;
        ret.level = level;
        return ret;
    };

    this.passwdCb = function(){
        var level = 0;
        var pfArray = epgCom.getChannelPf(dtvCom.chs[sysCom.config.chIndex], false);
        if(pfArray && pfArray.length >= 1){
            level = pfArray[0].level
        }
        lockCom.unLockCallback(dtvCom.chs[sysCom.config.chIndex],level);
        self.banner.update();
        self.doChangeCh(null, 0, true);
        console.log("passwdCb: real do change ch!");
        if(self.caMsgDlg){
            self.caMsgDlg.needHide = false;
            console.log("passwdCb set needHide false");
        }
    };

    this.showPasswd = function(cb, proc1){
        if(self.caMsgDlg){
            console.log("showPasswd set needHide true");
            self.caMsgDlg.needHide = true;
            self.caMsgDlg.hide();
        }

        if(self.passwdDlg){
            self.passwdDlg.dlg.destroy();
        }

        var p = {
            win : self.win,
            rightPasswd : sysCom.config.ParentalPin,
            proc : proc1,
            rightDo : cb
        };

        self.passwdDlg = new PasswdDialog(p);
        self.passwdDlg.show();
    };

    this.closePasswd = function(updateFlag){
        if(self.caMsgDlg){
            self.caMsgDlg.needHide = false;
            console.log("closePasswd set needHide false");
        }

        if(self.passwdDlg){
            self.passwdDlg.close(updateFlag);
            self.passwdDlg = null;
        }
    };


    this.onTimeLock = function(){
        console.log("onTimeLock");
        if(!self.passwdDlg){
            self.changeCh(null, 0, true, self.passwdCb, self.bannerPasswdOnkey,2);
        }
    };

    this.onTimeUnlock = function(){
        console.log("onTimeUnlock");
        if(self.passwdDlg){
            self.closePasswd();
            self.passwdCb();
        }
    };

    this.bannerPasswdOnkey = function(e){
        console.log("bannerPasswdOnkey Keycode:" + e.keyCode);
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.ENTER:
                self.passwdDlg.onkeyReturn();
                break;
            case UI.KEY.CHNUP:
                self.closePasswd(true);
                self.changeCh(null, 1, true, self.passwdCb, self.bannerPasswdOnkey,2);
                break;
            case UI.KEY.CHNDOWN:
                self.closePasswd(true);
                self.changeCh(null, -1, true, self.passwdCb, self.bannerPasswdOnkey,2);
                break;
            case UI.KEY.EPG:
            case UI.KEY.MENU:
            case UI.KEY.PVR:
            case UI.KEY.VOLUP:
            case UI.KEY.VOLDOWN:
                ret = false;
                break;
            case UI.KEY.BACKSPACE:
                self.closePasswd(true);
                self.onkeyBack();
                break;
            default:
                ret = true;
                break;
        }
        return ret;
    };

    this.chlistPasswdOnkey = function(e){
        console.log("chlistPasswdOnkey Keycode:" + e.keyCode);
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.ENTER:
                self.passwdDlg.onkeyReturn();
                break;
            case UI.KEY.UP:
                self.closePasswd(false);
                self.chlist.tableOnkeyUp();
                ret = false;
                break;
            case UI.KEY.DOWN:
                self.closePasswd(false);
                self.chlist.tableOnkeyDown();
                ret = false;
                break;
            case UI.KEY.CHNUP:
                self.chlist.close(false);
                self.closePasswd(true);
                self.changeCh(null, 1, true, self.passwdCb, self.bannerPasswdOnkey,2);
                ret = true;
                break;
            case UI.KEY.CHNDOWN:
                self.chlist.close(false);
                self.closePasswd(true);
                self.changeCh(null, -1, true, self.passwdCb, self.bannerPasswdOnkey,2);
                ret = true;
                break;
            case UI.KEY.EPG:
            case UI.KEY.MENU:
            case UI.KEY.PVR:
            case UI.KEY.VOLUP:
            case UI.KEY.VOLDOWN:
                ret = false;
                break;
            case UI.KEY.BACKSPACE:
                self.chlist.close(false);
                self.closePasswd(true);
                self.onkeyBack();
                break;
            default:
                ret = true;
                break;
        }

        return ret;
    };
    /****************************live 电视，广播背景切换****************************/

    this.updateBackground = function(){
        var ch = dtvCom.getCurrentCh();
        if(!ch)
        {
            return;
        }

        if(ch.sortId == 2)
        {
            self.win.getChild("audioBgImg").visibility = 1;
            self.win.getChild("audioBgImg").setSrc("live/audio_background");
        }
        else
        {
            self.win.getChild("audioBgImg").visibility = -1;
        }
        self.win.update();
    };

    /****************************live PVR****************************/
    this.showDia = function(text){
        console.log("text:"+text);
        var p1 = {
            title: Lp.getValue("tips"),
            textok: Lp.getValue("OK"),
            textno: Lp.getValue("Cancel"),
            timeout:5*1000,
            background: "../cview_app_common_pic/password_bg.png",
            dia_ImgOK: "../cview_app_common_pic/ico_ok.png",
            dia_ImgNO: "../cview_app_common_pic/ico_back.png",
            okfun:function(){
            },
            nofun:function(){}
        };
        var p2 = {
            text:""
        };
        p2.text = text;

        var dia = new Dialog(p1);
        dia.show(p2);
    };

    this.onKeyRecord = function(){
        var e = null;
        var flag = 0;
        if(dtvCom.chs.length <= 0){
            return;
        }


        var ch = dtvCom.getCurrentCh();
        var ret = recordSchCom.checkCanRecording(ch);

        if(ret == 0){

        }
        else if(ret == 1){
            self.showDia(Lp.getValue("noSignText"));
            return;
        }
        else if(ret == 2){
            self.showDia(Lp.getValue("noCardText"));
            return;
        }
        else if(ret == 3){
            //提示用户 CA信息
            var str = caCom.getMsgById(caCom.camsg);
            self.showDia(str);
            return;
        }
        else if(ret == 4){
            //提示用户 请开通PVR服务
            self.showDia(Lp.getValue("noPVRService"));
            return;
        }
        else if(ret == 5){
            self.showDia(Lp.getValue("noPVRDISK"));
            return;
        }
        else if(ret == 6){
            self.showDia(Lp.getValue("musicCantRecord"));
            return;
        }

        var ch = dtvCom.chs[sysCom.config.chIndex];

        var pfArray = epgCom.getChannelPf(ch, false);

        if(pfArray && pfArray.length >= 1){
            flag = 0;
            var pfInfo = pfArray[0].rawData;
            e = recordSchCom.checkRecordingByEvent(pfInfo);
        }
        else{
            flag = 1;
            e = recordSchCom.checkRecordingByTime(ch.idn);
        }

        if(e){
            //弹窗是否取消录制
            var p1 = {
                title: Lp.getValue("tips"),
                textok: Lp.getValue("OK"),
                textno: Lp.getValue("Cancel"),
                timeout:5*1000,
                background: "../cview_app_common_pic/password_bg.png",
                dia_ImgOK: "../cview_app_common_pic/ico_ok.png",
                dia_ImgNO: "../cview_app_common_pic/ico_back.png",
                okfun:function(){
                    recordSchCom.deleteEvent(e);
                    self.showRecordingIcon();
                },
                nofun:function(){}
            };
            var p2 = {
                text:""
            };
            p2.text = Lp.getValue("isStopRecording");

            var dia = new Dialog(p1);
            dia.show(p2);
            return;
        }
        else{
            if(flag == 0){
                self.addSingleRecording(pfArray[0].rawData,ch);
            }
            else{
                //进行2个小时的单次录制
                self.addOneTimeRecording(3600*2,ch);
            }
        }

    };

    this.getRecordConflictItem = function(et){
        var item = {
            dateStr:"",
            timeStr:"",
            chName:"",
            schName:"",
            type:""
        };
        if(et.type == recordSchCom.recordType.ONETIME){
            var startDate = getEpgStartDate(et.startTime);
            var endDate = getEpgEndDate(startDate,et.duration);
            item.dateStr = formatWeekDate(startDate);
            item.timeStr = formatTime2(startDate,endDate);
            item.chName = et.ch.name;
            //tem.schName = et.epg.name;
            item.type = getTypeText(et.type);

        }
        else if(et.type == recordSchCom.recordType.WEEKTIME){

            if(et.eventHangle){
                var startDate = getEpgStartDate(et.startTime);
                var endDate = getEpgEndDate(startDate,et.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
            }
            else{
                var startDate = getEpgStartDate(et.constraint.startTime);
                var endDate = getEpgEndDate(startDate,et.constraint.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
            }
            item.chName = et.ch.name;
            item.type = getTypeText(et.type);
        }
        else if(et.type == recordSchCom.recordType.DAYTIME){

            if(et.eventHangle){
                var startDate = getEpgStartDate(et.startTime);
                var endDate = getEpgEndDate(startDate,et.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
            }
            else{
                var startDate = getEpgStartDate(et.constraint.startTime);
                var endDate = getEpgEndDate(startDate,et.constraint.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
            }
            item.chName = et.ch.name;
            item.type = getTypeText(et.type);
        }
        else if(et.type == recordSchCom.recordType.SINGLE){
            var startDate = getEpgStartDate(et.startTime);
            var endDate = getEpgEndDate(startDate,et.duration);
            item.dateStr = formatWeekDate(startDate);
            item.timeStr = formatTime2(startDate,endDate);
            item.chName = et.ch.name;
            item.schName = et.epg.name;
            item.type = getTypeText(et.type);
        }
        else if(et.type == recordSchCom.recordType.SERIAL){
            if(et.eventHangle){
                var startDate = getEpgStartDate(et.startTime);
                var endDate = getEpgEndDate(startDate,et.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
                item.schName = et.epg.series_key;
            }
            else{
                console.log("et.constraint:"+JSON.stringify(et.constraint));
                var startDate = getEpgStartDate(et.constraint.startTime);
                var endDate = getEpgEndDate(startDate,et.constraint.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
                item.schName = et.constraint.series_key;
            }
            item.chName = et.ch.name;

            item.type = getTypeText(et.type);
        }
        return item;
    };

    this.addSingleRecording = function(rawData,ch){
        console.log("添加单集预约录制");

        //获取事件模板
        var event = recordSchCom.getEventTemplate(recordSchCom.recordType.SINGLE);
        //初始化录制事件
        event.ch = {};
        event.ch.idn = ch.idn;
        event.ch.name = ch.name;
        event.ch.tsId = ch.tsId;
        event.ch.oriNetworkId = ch.oriNetworkId;
        event.ch.serviceId = ch.serviceId;
        event.startTime = rawData.startTime;
        event.duration = rawData.duration;
        event.epg.eventId = rawData.eventId;
        event.epg.name = rawData.name;
        event.epg.level = rawData.parentRating.rating;
        event.epg.text = rawData.extendEvent.text;
        //判断录制时间是否过期
        var curdate = new Date();
        var staDate = getEpgStartDate(event.startTime);
        var endDate = getEpgEndDate(staDate,event.duration);
        if((endDate.getTime() - curdate.getTime()) < 1000*60){
            return;
        }
        //判断是否需要更新录制时间
        var off = curdate.getTime() - staDate.getTime();
        if(off > 60 * 1000){
            event.startTime = getTimeStrfromDate(curdate);
            event.duration = (endDate.getTime() - curdate.getTime())/1000;
        }

        //获取冲突列表
        var al = recordSchCom.checkEventConflict(event);
        console.log("recordSchCom.checkEventConflict:"+JSON.stringify(al));
        //获取最优冲突列表
        var oplList = recordSchCom.getOptimalConflictBylist(al);
        console.log("recordSchCom.getOptimalConflictBylist:"+JSON.stringify(oplList));
        //设置tuner通道
        event.resId = oplList.resId;
        //如果最优冲突列表为0，则直接添加
        if(oplList.optimalList.length <= 0){
            console.log("recordSchCom.addEvent:"+JSON.stringify(event));
            var ret = recordSchCom.addEvent(event);
            self.showRecordingIcon(true);
            self.showDia(Lp.getValue("addRecordIngSuccess"));
        }
        //如果最优冲突列表不为0，则提示冲突列表
        else
        {
            var params = {
                title:Lp.getValue("remind_conflict"),
                okText:Lp.getValue("Ok"),
                backText:Lp.getValue("Cancel"),
                okIcon:"../cview_app_common_pic/ico_ok.png",
                backIcon:"../cview_app_common_pic/ico_back.png",
                text1:Lp.getValue("remind_conflict_ask_str"),
                newTips:Lp.getValue("new_remind_conflict"),
                oldTips:Lp.getValue("old_remind_conflict"),
                newItem:null,
                oldItem:null,
                okfun: function () {
                    console.log("ok");
                },
                nofun: function () {
                    console.log("no");
                }
            };
            //获取newItem
            params.newItem = self.getRecordConflictItem(event);

            //获取oldItem
            params.oldItem = [];
            for(var i = 0; i < oplList.optimalList.length;i++){
                var item = self.getRecordConflictItem(oplList.optimalList[i]);
                params.oldItem.push(item);
            }
            //设置冲突列表弹窗参数
            params.okfun = function(){
                console.log("ok");
                recordSchCom.deleteConflictList(oplList.optimalList);
                var ret = recordSchCom.addEvent(event);
                self.showRecordingIcon(true);
                console.log("ret:"+ret);
            };
            //弹出冲突列表
            var dia = new RecordingConflictDialog();
            dia.show(params);
        }
    };

    this.addOneTimeRecording = function(duration,ch){
        var event = recordSchCom.getEventTemplate(recordSchCom.recordType.ONETIME);
        //初始化init
        event.ch = {};
        event.ch.idn = ch.idn;
        event.ch.name = ch.name;
        event.ch.tsId = ch.tsId;
        event.ch.oriNetworkId = ch.oriNetworkId;
        event.ch.serviceId = ch.serviceId;
        event.startTime = getTimeStrfromDate(new Date());
        event.duration = duration;
        //获取冲突列表
        var al = recordSchCom.checkEventConflict(event);
        console.log("recordSchCom.checkEventConflict:" + JSON.stringify(al));
        //获取最优冲突列表
        var oplList = recordSchCom.getOptimalConflictBylist(al);
        console.log("recordSchCom.getOptimalConflictBylist:" + JSON.stringify(oplList));
        //设置tuner通道
        event.resId = oplList.resId;

        console.log("recordSchCom.addEvent:" + JSON.stringify(event));
        //如果最优冲突列表为0，则直接添加
        if (oplList.optimalList.length <= 0) {
            var ret = recordSchCom.addEvent(event);
            self.showRecordingIcon(true);
            self.showDia(Lp.getValue("addRecordIngSuccess"));
        }
        //如果最优冲突列表不为0，则提示冲突列表
        else {
            var params = {
                title: Lp.getValue("remind_conflict"),
                okText: Lp.getValue("Ok"),
                backText: Lp.getValue("Cancel"),
                okIcon: "../cview_app_common_pic/ico_ok.png",
                backIcon: "../cview_app_common_pic/ico_back.png",
                text1: Lp.getValue("remind_conflict_ask_str"),
                newTips: Lp.getValue("new_remind_conflict"),
                oldTips: Lp.getValue("old_remind_conflict"),
                newItem: null,
                oldItem: null,
                okfun: function () {
                    console.log("ok");
                },
                nofun: function () {
                    console.log("no");
                }
            };
            //获取newItem
            params.newItem = self.getConflictItem(event);

            //获取oldItem
            params.oldItem = [];
            for (var i = 0; i < oplList.optimalList.length; i++) {
                var item = self.getConflictItem(oplList.optimalList[i]);
                params.oldItem.push(item);
            }
            //设置冲突列表弹窗参数
            params.okfun = function () {
                console.log("ok");
                recordSchCom.deleteConflictList(oplList.optimalList);
                var ret = recordSchCom.addEvent(event);
                self.showRecordingIcon(true);
                console.log("ret:" + ret);
            };
            //弹出冲突列表
            var dia = new RecordingConflictDialog();
            dia.show(params);
        }
    };

    self.showRecordingIconTimer = null;
    this.showRecordingIcon = function (direction) {
        var flag = false;

        if(dtvCom.chs.length <= 0){
            return;
        }

        var ch = dtvCom.chs[sysCom.config.chIndex];

        var pfArray = epgCom.getChannelPf(ch, false);

        if(pfArray && pfArray.length >=1 ){
            var pfInfo = pfArray[0].rawData;
            flag = recordSchCom.checkRecordingByEvent(pfInfo);
        }
        else{

            flag = recordSchCom.checkRecordingByTime(ch.idn);
        }

        self.win.getChild("recordingImg").visibility = -1;

        if(direction){
            flag = 1;
        }

        if(flag){

            if(self.showRecordingIconTimer){
                clearTimeout(self.showRecordingIconTimer);
            }
            self.win.getChild("recordingImg").visibility = 1;
            self.showRecordingIconTimer = setTimeout(function(){
                self.win.getChild("recordingImg").visibility = -1;
                self.win.update();
            },1000*10);
        }

        self.win.update();
    };

    this.getConflictItem = function(et){
        var item = {
            dateStr:"",
            timeStr:"",
            chName:"",
            schName:"",
            type:""
        };
        if(et.type == recordSchCom.recordType.ONETIME){
            var startDate = getEpgStartDate(et.startTime);
            var endDate = getEpgEndDate(startDate,et.duration);
            item.dateStr = formatWeekDate(startDate);
            item.timeStr = formatTime2(startDate,endDate);
            item.chName = et.ch.name;
            //tem.schName = et.epg.name;
            item.type = getTypeText(et.type);

        }
        else if(et.type == recordSchCom.recordType.WEEKTIME){

            if(et.eventHangle){
                var startDate = getEpgStartDate(et.startTime);
                var endDate = getEpgEndDate(startDate,et.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
            }
            else{
                var startDate = getEpgStartDate(et.constraint.startTime);
                var endDate = getEpgEndDate(startDate,et.constraint.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
            }
            item.chName = et.ch.name;
            item.type = getTypeText(et.type);
        }
        else if(et.type == recordSchCom.recordType.DAYTIME){

            if(et.eventHangle){
                var startDate = getEpgStartDate(et.startTime);
                var endDate = getEpgEndDate(startDate,et.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
            }
            else{
                var startDate = getEpgStartDate(et.constraint.startTime);
                var endDate = getEpgEndDate(startDate,et.constraint.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
            }
            item.chName = et.ch.name;
            item.type = getTypeText(et.type);
        }
        else if(et.type == recordSchCom.recordType.SINGLE){
            var startDate = getEpgStartDate(et.startTime);
            var endDate = getEpgEndDate(startDate,et.duration);
            item.dateStr = formatWeekDate(startDate);
            item.timeStr = formatTime2(startDate,endDate);
            item.chName = et.ch.name;
            item.schName = et.epg.name;
            item.type = getTypeText(et.type);
        }
        else if(et.type == recordSchCom.recordType.SERIAL){
            if(et.eventHangle){
                var startDate = getEpgStartDate(et.startTime);
                var endDate = getEpgEndDate(startDate,et.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
                item.schName = et.epg.series_key;
            }
            else{
                var startDate = getEpgStartDate(et.constraint.startTime);
                var endDate = getEpgEndDate(startDate,et.constraint.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
                item.schName = et.constraint.series_key;
            }
            item.chName = et.ch.name;

            item.type = getTypeText(et.type);
        }
        return item;
    };


    /****************************live 事件处理函数定义****************************/
    this.showEdollar = function(){
        if(caCom.camsg == 0x09)
        {
            //首先獲取網絡狀態
            var cminfo = CableModem.cmGetIpInfo(false);
            //獲取edollar app
            var url = appCom.getUrlByName("edollar");
            if (url.length < 5 ||!(cminfo && cminfo.online==12 )) {

                //提示用户
                var p1 = {
                    title: Lp.getValue("tips"),

                    timeout: 4* 1000,
                    background: "../cview_app_common_pic/password_bg.png",

                };

                var p2 = {
                    text: Lp.getValue("EdollarFail")
                };
                var dia = new Dialog(p1);
                self.caMsgDlg.hide();
                dia.show(p2);
                timer = setTimeout(function(){
                    self.caMsgDlg.show({msgid:0x09});
                },5*1000);
            } else {
                //進入edollar
                appcom.goAppByUrl(url);
            }
        }
    };

    this.onkeyBack = function(){
        if(sysCom.config.chLastIndex != sysCom.config.chIndex && sysCom.config.chLastIndex < dtvCom.chs.length){
            var idn = dtvCom.chs[sysCom.config.chLastIndex].idn;
            self.changeCh(idn, null, true, self.passwdCb, self.bannerPasswdOnkey,2);
        }
    };

    this.onkeyPlay = function(){
        var ch = dtvCom.getCurrentCh();
        var ret = recordSchCom.checkCanRecording(ch);
        if(ret == 0){

        }
        else if(ret == 1){
            self.showDia(Lp.getValue("noSignText"));
            return;
        }
        else if(ret == 2){
            self.showDia(Lp.getValue("noCardText"));
            return;
        }
        else if(ret == 3){
            //提示用户 CA信息
            var str = caCom.getMsgById(caCom.camsg);
            self.showDia(str);
            return;
        }
        else if(ret == 4){
            //提示用户 请开通PVR服务
            self.showDia(Lp.getValue("noPVRService"));
            return;
        }
        else if(ret == 5){
            self.showDia(Lp.getValue("noPVRDISK"));
            return;
        }
        else if(ret == 6){
            self.showDia(Lp.getValue("musicCantTimeshift"));
            return;
        }

        var p={
            
        };
        self.go(TimeShiftPage,LivePage,p,"hide");
    };

    this.onkeyBlue = function(e){
        if(self.enterEdollar()){
            return;
        }

        self.enterSignalInfoCheck(e);
    };

    this.enterEdollar = function(){
        if(caCom.camsg == 0x09 || caCom.camsg == 0x15){
            appCom.goAppByName("edollar");
            return true;
        }
        return false;
    };

    this.enterSignalInfoNum = [];
    this.enterSignalInfoCheck = function(e){
        if(self.sigInfo.status){
            self.enterSignalInfoNum = [];
            self.enterStbInfoNum = [];
            return;
        }
        self.enterSignalInfoNum.push(e.keyCode);
        var str = self.enterSignalInfoNum.join("");
        var str1 = ""+UI.KEY.CHAR0+UI.KEY.CHAR0+UI.KEY.CHAR0+UI.KEY.FUNBLUE;

        if(str.indexOf(str1) != -1){
            var sigInfoParams = self.sigInfo.getSignalInfo();
            self.sigInfo.show(sigInfoParams);
            self.enterSignalInfoNum = [];
        }

        if(self.enterSignalInfoNum.length >= 4){
            self.enterSignalInfoNum.splice(0,1);
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
    this.enterStbInfoNum = [];
    this.enterStbInfoCheck = function(e){
        if(self.stbInfoDlg.status){
            self.enterStbInfoNum = [];
            self.enterSignalInfoNum = [];
            return;
        }
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

    this.onkey = function(e){
        console.log("LivePage Keycode:" + e.keyCode);
        var win = self.win.getFocusWin();
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.INFO:
            case UI.KEY.ENTER:
                self.banner.show(true);
                break;
            case UI.KEY.UP:
                self.banner.show(true);
                break;
            case UI.KEY.LEFT:
                keyCom.handleVolume(-1);
                break;
            case UI.KEY.RIGHT:
                keyCom.handleVolume(1);
                break;
            case UI.KEY.DOWN:
                self.banner.show(true);
                break;
            case UI.KEY.CHNUP:
                self.changeCh(null, 1, true, self.passwdCb, self.bannerPasswdOnkey,2);
                break;
            case UI.KEY.CHNDOWN:
                self.changeCh(null, -1, true, self.passwdCb, self.bannerPasswdOnkey,2);
                break;
            case UI.KEY.FUNRED:
                self.chlist.show();
                break;
            case UI.KEY.FUNGREEN:
                self.banner.show(true);
                self.banner.showSubtitle();
                break;
            case UI.KEY.LANG:
                self.banner.show(true);
                self.banner.showMultiAudio();
                break;
            case UI.KEY.CHAR0:
            case UI.KEY.CHAR1:
            case UI.KEY.CHAR2:
            case UI.KEY.CHAR3:
            case UI.KEY.CHAR4:
            case UI.KEY.CHAR5:
            case UI.KEY.CHAR6:
            case UI.KEY.CHAR7:
            case UI.KEY.CHAR8:
            case UI.KEY.CHAR9:
                self.enterStbInfoCheck(e);
                self.enterSignalInfoCheck(e);
                if(self.numInput.dlg.visibility < 0){
                    self.numInput.show(e.keyCode - 48);
                }
                break;
            case UI.KEY.LIVETV:
               /* console.log("http://192.168.0.21/clear/playlist.m3u8");
                var url = "http://192.168.0.21/clear/playlist.m3u8";
                dtvCom.mp.mpStart(url,false);*/
                break;
            case UI.KEY.FUNBLUE:
                self.onkeyBlue(e);
                break;
            case UI.KEY.BACKSPACE:
                self.onkeyBack();
                break;
            case UI.KEY.RECORD:
                self.onKeyRecord();
                break;
            case UI.KEY.PLAY:
                self.onkeyPlay();
                break;
            default:
                ret = false;
                break;
        }
    };
}

LivePage.prototype = UIModule.baseModule;