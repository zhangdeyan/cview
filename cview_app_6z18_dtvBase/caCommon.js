function CaCommon()
{
    var self = this;

    self.loadTimer = null;

    //用于强制指纹，强制OSD时,停止用户按键操作
    this.lockStatus = false;

    self.ContinuesWatchLimit = {};

    this.superOsdLock = false;
    this.superFingerLock = false;
    this.continuesWatchLimitLock = false;
    this.forceChangeChannelLock = false;

    this.osdfinger = {
        "osd":null,
        "superOsd":null,
        "finger":null,
        "superFinger":null
    };

    this.caParams = {
        "cardNum":null,
        "operatorinfo":null,
        "calibversion":null,
        "areacode":null,
        "bouquetId":null,
        "zipCode":null
    };

    this.camsg = null;

    this.init = function(){
        if(!sysCom.isPowerBoot){
            self.caParams = utility.getH5Storage("CNS_DVB_CAINFO");
        }
        else{
            self.getParams();
        }

        //osd 指纹数据
        self.osdfinger = utility.getH5Storage("CNS_DVB_CA_OSDFINGER");
        if(!self.osdfinger){
            self.osdfinger = {
                "osd":null,
                "superOsd":null,
                "finger":null,
                "superFinger":null
            };
            utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
        }

        self.ContinuesWatchLimit = {};
        self.ContinuesWatchLimit.status = DB.dbGetValue("CNS_DVB_CA_CONTINUESWATCHLIMIT_STATUS",false);
        self.ContinuesWatchLimit.data= utility.getH5Storage("CNS_DVB_CA_CONTINUESWATCHLIMIT_DATA");
        if(self.ContinuesWatchLimit.status != "0" && self.ContinuesWatchLimit.status != "1" && self.ContinuesWatchLimit.status != "-1"){
            self.ContinuesWatchLimit.status = "-1";
            DB.dbSetValue("CNS_DVB_CA_CONTINUESWATCHLIMIT_STATUS",self.ContinuesWatchLimit.status,false);
        }

        self.osdfinger = utility.getH5Storage("CNS_DVB_CA_OSDFINGER");
        console.log("Init osdfinger:"+JSON.stringify(self.osdfinger));
        if(!self.osdfinger){
            self.osdfinger = {
                "osd":null,
                "superOsd":null,
                "finger":null,
                "superFinger":null
            };
            utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
        }

        //检查如果是自己开发应用，则开始加载ca窗口,显示相关内容
        if(appCom.checkCurAppIsLocalApp()){
            self.osdFingerDlgInit();
        }

        self.start();
    };

    this.reset = function(){
        DB.dbSetValue("CNS_DVB_CA_CONTINUESWATCHLIMIT", "", false);
        self.osdfinger = {
            "osd":null,
            "superOsd":null,
            "finger":null,
            "superFinger":null
        };
    };

    this.osdFingerDlgInit = function(){
        self.loadTimer = setInterval(function(){

            if(typeof CaFingerDialog == "undefined"){
                return;
            }

            if(typeof CaSuperFingerDialog == "undefined"){
                return;
            }

            if(typeof CaOsdDialog == "undefined"){
                return;
            }

            if(typeof CaSuperOsdDialog == "undefined"){
                return;
            }

            if(CaFingerDialog && CaSuperFingerDialog && CaOsdDialog && CaSuperOsdDialog){

                self.caFingerDlg = new CaFingerDialog();

                self.caSuperFingerDlg = new CaSuperFingerDialog();

                self.caOsdDlg = new CaOsdDialog("../cview_app_common_pic/osd_bac.png");

                self.caSuperOsdDlg = new CaSuperOsdDialog();

                clearInterval(self.loadTimer);

                self.loadTimer= null;

                self.osdFingerDlgShow();
            }
        },1000);
    };

    this.osdFingerDlgShow = function(){
        
        self.osdfinger = utility.getH5Storage("CNS_DVB_CA_OSDFINGER");
        if(!self.osdfinger){
            self.osdfinger = {
                "osd":null,
                "superOsd":null,
                "finger":null,
                "superFinger":null
            };
            utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
        }
        else{
            if(self.osdfinger.finger){
                setTimeout(function(){
                    console.log("show caFingerDlg");
                    self.caFingerDlg.show(self.osdfinger.finger);
                },2000);
            }
            if(self.osdfinger.superFinger){
                setTimeout(function(){
                    console.log("show caSuperFingerDlg");
                    self.caSuperFingerDlg.show(self.osdfinger.superFinger);
                },2000);
            }
            if(self.osdfinger.osd){
                setTimeout(function(){
                    console.log("show caOsdDlg");
                    if(self.osdfinger.osd.pos1){
                        self.caOsdDlg.show(self.osdfinger.osd.pos1);
                    }
                    if(self.osdfinger.osd.pos2){
                        self.caOsdDlg.show(self.osdfinger.osd.pos2);
                    }
                    if(self.osdfinger.osd.pos3){
                        self.caOsdDlg.show(self.osdfinger.osd.pos3);
                    }
                    if(self.osdfinger.osd.pos4){
                        self.caOsdDlg.show(self.osdfinger.osd.pos4);
                    }
                },2000);
            }

            if(self.osdfinger.superOsd){
                setTimeout(function(){
                    console.log("show caSuperOsdDlg");
                    self.caSuperOsdDlg.show(self.osdfinger.superOsd);
                },2000);
            }
        }
    };

    this.getParams = function(){
        self.caParams = {
            "cardNum":null,
            "operatorinfo":null,
            "calibversion":null,
            "areacode":null,
            "bouquetId":null,
            "zipCode":null
        };
        var ret = CA.getCardNo(false);
        if(ret.errorcode == 0){
            self.caParams.cardNum = ret.cardno;
        }

        ret = CA.getOperators(false);
        if(ret.errorcode == 0){
            self.caParams.operatorinfo = ret.operatorinfo;
        }

        ret = CA.getCasInfo(false);
        if(ret.errorcode == 0){
            self.caParams.calibversion = ret.calibversion;
        }

        if(self.caParams.operatorinfo.length > 0){
            ret = CA.getAcList(self.caParams.operatorinfo[0].operatorid,false);
            if(ret.errorcode == 0){
                self.caParams.areacode = ret.areacode;
                self.caParams.bouquetId = ret.bouquetid;
                self.caParams.zipCode = ret.otherdatas[0].acotherdata+"";
                var str = self.caParams.zipCode + "";
                if(str.length >= 5){
                    self.caParams.so = str.substring(0,2);
                }
                else if(str.length == 4){
                    self.caParams.so = "0" + str.substring(0,1);
                }
                else{
                    self.caParams.so = "00";
                }
            }
        }
        utility.setH5Storage("CNS_DVB_CAINFO",self.caParams);
        console.log("caParams:"+JSON.stringify(self.caParams));
    };

    this.resetParams = function(){
        self.caParams = {
            "cardNum":null,
            "operatorinfo":null,
            "calibversion":null,
            "areacode":null,
            "bouquetId":null,
            "zipCode":null
        };
        self.osdfinger = {
            "osd":null,
            "superOsd":null,
            "finger":null,
            "superFinger":null,
        };
        utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
        utility.setH5Storage("CNS_DVB_CAINFO",self.caParams);
    };

    this.start = function(){
        self.registCaEvent();
    };

    this.registCaEvent = function(){

        eventCom.registerCallback(3,function(obj){

            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_CARD_REMOVE){

                self.resetParams();
            }else if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_CARD_INSERT){
                setTimeout(function(){
                    self.getParams();
                },2000);

            }
            else if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_ACTION_REQUEST)
            {
                if(obj.data.cnsird){
                    self.IRD_Command(obj.data.cnsird);
                }

            }

            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_SHOW_MESSAGE)
            {
                self.camsg = obj.data.msgId;

            }

            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_HIDE_MESSAGE)
            {
                self.camsg = null;

            }


            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_SHOW_FINGER)
            {
                self.osdfinger.finger = obj.data.finger;
                utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
                if(appCom.checkCurAppIsLocalApp() && self.loadTimer == null){
                    self.caFingerDlg.show(obj.data.finger);
                }
            }

            if (obj.code == eventCom.EVENTCODE.CS_EVT_CA_HIDE_FINGER) {
                self.osdfinger.finger = null;
                utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
                if(appCom.checkCurAppIsLocalApp() && self.loadTimer == null){
                    self.caFingerDlg.hide();
                }
            }

            if (obj.code == eventCom.EVENTCODE.CS_EVT_CA_SHOW_SUPFINGER) {
                self.osdfinger.superFinger = obj.data;
                utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
                if(appCom.checkCurAppIsLocalApp() && self.loadTimer == null){
                    self.caSuperFingerDlg.show(obj.data);
                }
            }

            if (obj.code == eventCom.EVENTCODE.CS_EVT_CA_SHOW_OSD) {
                if(!self.osdfinger.osd){
                    self.osdfinger.osd = {};
                }

                if(obj.data.pos == 1){
                    self.osdfinger.osd.pos1 = obj.data;
                }
                else if(obj.data.pos == 2){
                    self.osdfinger.osd.pos2 = obj.data;
                }
                else if(obj.data.pos == 3){
                    self.osdfinger.osd.pos3 = obj.data;
                }
                else if(obj.data.pos == 4){
                    self.osdfinger.osd.pos4 = obj.data;
                }

                utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
                if(appCom.checkCurAppIsLocalApp() && self.loadTimer == null){
                    self.caOsdDlg.show(obj.data);
                }
            }

            if (obj.code == eventCom.EVENTCODE.CS_EVT_CA_HIDE_OSD) {
                if(obj.data.pos == 1){
                    self.osdfinger.osd.pos1 = null;
                }
                else if(obj.data.pos == 2){
                    self.osdfinger.osd.pos2 = null;
                }
                else if(obj.data.pos == 3){
                    self.osdfinger.osd.pos3 = null;
                }
                else if(obj.data.pos == 4){
                    self.osdfinger.osd.pos4 = null;
                }
                utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
                if(appCom.checkCurAppIsLocalApp() && self.loadTimer == null){
                    self.caOsdDlg.hide(obj.data.pos);
                }
            }

            if (obj.code == eventCom.EVENTCODE.CS_EVT_CA_SHOW_SUPOSD) {
                self.osdfinger.superOsd = obj.data;
                utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
                if(appCom.checkCurAppIsLocalApp() && self.loadTimer == null){
                    self.caSuperOsdDlg.show(obj.data);
                }
            }

        });
    };

    this.getMsgById = function(id){
        for(var i =0; i < self.Msg.length;i++)
        {
            if(self.Msg[i].id == id)
            {
                if(languageCom.menuLanguageIndex==0){

                    if(self.Msg[i].cnsChi==""){
                        return Lp.Utf8ToUnicode(self.Msg[i].caChi);
                    }
                    else{
                        return  Lp.Utf8ToUnicode(self.Msg[i].cnsChi);
                    }

                }else{
                    if(self.Msg[i].cnsEng==""){
                        return Lp.Utf8ToUnicode(self.Msg[i].caEng);
                    }
                    else{
                        return Lp.Utf8ToUnicode(self.Msg[i].cnsEng);
                    }
                }
            }
        }
        return null;
    };
    /***********同方CA提示消息定义**************/

    this.Msg = [

        {id:0x01,caChi:"无法识别卡",caEng:"CA_NOVEL_MESSAGE_BADCARD_TYPE",cnsChi:"智慧卡無效或是非本公司所提供的智慧卡，請與客服中心聯絡 (代碼：E002)",cnsEng:"The Smart Card introduced is not valid for this receiver. Please contact the Service Center. (Code: E002)"},
        {id:0x02,caChi:"智能卡過期， 請更換新卡",caEng:"CA_NOVEL_MESSAGE_EXPICARD_TYPE",cnsChi:"智慧卡配對已經過期，請與客服中心聯絡 (代碼：E007)",cnsEng:"Smartcard is expired. Please contact the Service Center. (Code: E007)"},
        {id:0x03,caChi:"加擾節目， 請插入智能卡",caEng:"CA_NOVEL_MESSAGE_INSERTCARD_TYPE",cnsChi:"智慧卡未插入，請插入智慧卡 (代碼：E009)",cnsEng:"Smartcard is removed! Insert the Smart Card! (Code: E009)"},
        {id:0x04,caChi:"卡中不存在節目運營商",caEng:"CA_NOVEL_MESSAGE_NOOPER_TYPE",cnsChi:"智慧卡無效或是非本公司所提供的智慧卡，請與客服中心聯絡 (代碼：E017)",cnsEng:"The Smart Card introduced is not valid for this receiver. Please contact the Service Center. (Code: E017)"},
        {id:0x05,caChi:"條件禁播",caEng:"CA_NOVEL_MESSAGE_BLACKOUT_TYPE",cnsChi:"智慧卡無法觀看本節目，請與客服中心聯絡 (代碼：E010)",cnsEng:"Smart card not authorized. Please contact the Service Center. (Code: E010)"},
        {id:0x06,caChi:"當前時段被設定為不能觀看",caEng:"CA_NOVEL_MESSAGE_OUTWORKTIME_TYPE",cnsChi:"本頻道目前時段被設置成無法收視，請與客服中心聯絡 (代碼：E018)",cnsEng:"Current service is out of working hours. Please contact the Service Center. (Code: E018)"},
        {id:0x07,caChi:"節目級別高于設定的觀看級別",caEng:"CA_NOVEL_MESSAGE_WATCHLEVEL_TYPE",cnsChi:"目前節目受到分級限制，請與客服中心聯絡 (代碼：E019)",cnsEng:"Current program is limited by watch level. Please contact the Service Center. (Code: E019)"},
        {id:0x08,caChi:"智能卡與本機頂盒不對應",caEng:"CA_NOVEL_MESSAGE_PAIRING_TYPE",cnsChi:"智慧卡未開卡，本卡未與機上盒配對過，請與客服中心聯絡 (代碼：E005)",cnsEng:"Smart card has not been activated. Please contact the Service Center. (Code: E005)"},
        {id:0x09,caChi:"沒有授權",caEng:"CA_NOVEL_MESSAGE_NOENTITLE_TYPE",cnsChi:"未訂購本節目，欲知詳情,請與客服中心聯絡(代碼：E015)",cnsEng:"Access denied, Please contact the Service Center (Code: E015)"},
        {id:0x0a,caChi:"節目解密失敗",caEng:"CA_NOVEL_MESSAGE_DECRYPTFAIL_TYPE",cnsChi:"節目解碼失敗，請與客服中心聯絡 (代碼：E020)",cnsEng:"Descrypt Fail. Please contact the Service Center. (Code: E020)"},
        {id:0x0b,caChi:"卡內金額不足",caEng:"CA_NOVEL_MESSAGE_NOMONEY_TYPE",cnsChi:"",cnsEng:""},
        {id:0x0c,caChi:"子卡需要和母卡對應， 請插入母卡",caEng:"CA_NOVEL_MESSAGE_ERRREGION_TYPE",cnsChi:"",cnsEng:""},
        {id:0x0e,caChi:"智能卡校驗失敗， 請聯系運營商",caEng:"CA_NOVEL_MESSAGE_NEEDFEED_TYPE",cnsChi:"智慧卡通訊錯誤，可能是智慧卡受損，請與客服中心聯絡 (代碼：E000)",cnsEng:"Smart card communication error. Please contact the Service Center. (Code: E000)"},
        {id:0x0f,caChi:"智能卡升級中， 請不要拔卡或者關機",caEng:"CA_NOVEL_MESSAGE_UPDATE_TYPE",cnsChi:"",cnsEng:""},
        {id:0x10,caChi:"請升級智能卡",caEng:"CA_NOVEL_MESSAGE_LOWCARDVER_TYPE",cnsChi:"",cnsEng:""},
        {id:0x11,caChi:"請勿頻繁切換頻道",caEng:"CA_NOVEL_MESSAGE_VIEWLOCK_TYPE",cnsChi:"",cnsEng:""},
        {id:0x12,caChi:"智能卡暫時休眠， 請 5 分鐘後重新開機",caEng:"CA_NOVEL_MESSAGE_MAXRESTART_TYPE",cnsChi:"",cnsEng:""},
        {id:0x13,caChi:"智能卡已凍結， 請聯系運營商",caEng:"CA_NOVEL_MESSAGE_FREEZE_TYPE",cnsChi:"本智慧卡已被暫停使用，請聯絡客服中心 (代碼：E014)",cnsEng:"Smardcard is suspended. Please contact the Service Center. (Code: E014)"},
        {id:0x14,caChi:"智能卡已暫停， 請回傳收視記錄給運營商",caEng:"CA_NOVEL_MESSAGE_CALLBACK_TYPE",cnsChi:"",cnsEng:""},
        {id:0x15,caChi:"高級預覽節目， 該階段不能免費觀看",caEng:"CA_NOVEL_MESSAGE_CURTAIN_TYPE",cnsChi:"未訂購本節目，請與客服中心聯絡(代碼：E025)",cnsEng:"Access denied, Please contact the Service Center (Code: E025)"},
        {id:0x16,caChi:"升級測試卡測試中",caEng:"CA_NOVEL_MESSAGE_CARDTESTSTART_TYPE",cnsChi:"",cnsEng:""},
        {id:0x17,caChi:"升級測試卡測試失敗， 請檢查機卡通訊模塊",caEng:"CA_NOVEL_MESSAGE_CARDTESTFAILD_TYPE",cnsChi:"",cnsEng:""},
        {id:0x18,caChi:"升級測試卡測試成功",caEng:"CA_NOVEL_MESSAGE_CARDTESTSUCC_TYPE",cnsChi:"",cnsEng:""},
        {id:0x19,caChi:"卡中不存在移植庫定制運營商",caEng:"CA_NOVEL_MESSAGE_NOCALIBOPER_TYPE",cnsChi:"智慧卡無效或是非本公司所提供的智慧卡，請與客服中心聯絡 (代碼：E021)",cnsEng:"The Smart Card introduced is not valid for this receiver. Please contact the Service Center. (Code: E021)"},
        {id:0x20,caChi:"請重啟機頂盒",caEng:"CA_NOVEL_MESSAGE_STBLOCKED_TYPE",cnsChi:"請重新啟動機上盒 (代碼：E022)",cnsEng:"Please restart the Set-top Box. (Code: E022)"},
        {id:0x21,caChi:"機頂盒被凍結",caEng:"CA_NOVEL_MESSAGE_STBFREEZE_TYPE",cnsChi:"機上盒已經被凍結，請與客服中心聯絡 (代碼：E023)",cnsEng:"Set-top Box is locked. Please contact the Service Center. (Code: E023)"},
        {id:0x23,caChi:"DRM 業務被凍結",caEng:"CA_NOVEL_MESSAGE_DRMFREEZE_TYPE",cnsChi:"DRM业务被凍結",cnsEng:"DRM business is freezed. Please contact the operator"},
        {id:0x24,caChi:"網絡錯誤",caEng:"CA_NOVEL_MESSAGE_DRMNETERROR_TYPE",cnsChi:"",cnsEng:""},

        {id:0x40,caChi:"無訊號",caEng:"CA_NOVEL_MESSAGE_BADCARD_TYPE",cnsChi:"無訊號或訊號不良，請確認訊號纜線已接妥或洽客服中心 (代碼：E200)",cnsEng:"Signal is not stable. Please check your connection of RF cable first. (Code: E200)"},
        {id:0x41,caChi:"連續觀看限制",caEng:"CA_NOVEL_MESSAGE__TYPE",cnsChi:"",cnsEng:""},
        {id:0x42,caChi:"請重啟機頂盒",caEng:"Please restart the set-top box",cnsChi:"",cnsEng:""},
        {id:0x43,caChi:"即將恢復出廠設置",caEng:"Resume factory setting",cnsChi:"",cnsEng:""},

        {id:0xff,caChi:"取消當前的顯示",caEng:"CA_NOVEL_MESSAGE_CANCEL_TYPE",cnsChi:"",cnsEng:""}
    ];

    /***********IRD命令 实现**************/

    this.IRD_Command = function(params){
        console.log("IRD_Command = "+params);
        if(params) {
            var arr = params.split(",");
            console.log("arr="+arr[0]);

            switch(arr[0])
            {
                case "7":
                     self.IRD_ResetPIN1(params);
                      break;
                case "8":
                     self.IRD_ResetPIN2(params);
                     break;
                case "9":
                    self.IRD_SetPIN(params);
                    break;
                case "10":
                    self.IRD_DisableAutoStandby(params);
                     break;
                case "11":
                    self.IRD_EnableAutoStandby(params);
                    break;
                case "12":
                    self.IRD_RebootSTB(params);
                    break;
                case "13":
                    self.IRD_EnableDynamicIp(params);
                     break;
                case "14":

                     break;
                case "15":
                     break;
                case "16":
                    self.IRD_EnableStaticIp(params);
                    break;
                case "17":
                    self.IRD_FactoyResetWithFTISkip(params);
                    break;
                case "18":
                    self.IRD_ResetDownloadAppFromStore(params);
                    break;
                case "19":
                    self.IRD_DisableADInLiveTv(params);
                    break;
                case "20":
                    self.IRD_EnableADInLiveTv(params);
                     break;
                case "21":
                    self.IRD_ResetAppStoreURLToDefault(params);
                    break;
                case "22":
                    self.IRD_ChangeAppStoreURL(params);
                    break;
                case "23":
                    self.IRD_SetAPRouter(params);
                    break;
                case "24":
                    self.IRD_UpdateEntitledListByDefaultURL(params);
                     break;
                case "25":
                     break;
                case "26":
                    self.IRD_DisableFTI(params);
                     break;
                case "27":
                    self.IRD_ChangeVBMReportURL(params);
                    break;
                case "28":
                    self.IRD_EnableAntiPirate(params);
                    break;
                case "29":
                    self.IRD_DisableAntiPirate(params);
                    break;
                case "30":
                    self.IRD_HDDPairing(params);
                     break;
                case "31":
                    self.IRD_HDDProvision(params);
                     break;
                case "32":
                    self.IRD_HDDFormatting(params);
                     break;
                case "33":
                    self.IRD_ResetSTBDownloadMode(params);
                    break;
                case "34":
                    self.IRD_HDMICECFuntion(params);
                    break;
                case "35":
                    self.IRD_TVFeeReminder(params);
                    break;
                case "36":
                    self.IRD_HDCPFunction(params);
                    break;
                case "37":
                    self.IRD_AreaLimitation(params);
                    break;
                case "38":
                    self.IRD_Tr069Function(params);
                    break;
                case "39":
                    self.IRD_RescanChannel(params);
                    break;
            }

        }
    };


        /*
        Description: Reset the Parental PIN code
        Title: __IRD_COMMAND__
        Body: 7,0
        */
    this.IRD_ResetPIN1 = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 7 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.ParentalPin = sysCom.defaultConfig.ParentalPin;
        sysCom.saveConfig();
    };

    /*
    Description: Reset the Purchase PIN code
    Title: __IRD_COMMAND__
    Body: 8,0
    */
    this.IRD_ResetPIN2 = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 8 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.PersonalAuthenticationPin = sysCom.defaultConfig.PersonalAuthenticationPin;
        sysCom.saveConfig();
    };

    /*
    Description: Set PIN code
    Title: __IRD_COMMAND__
    Body: 9,2,[PIN],[password]
    Definition:
    - [PIN] = the nth PIN
     PIN = 1 => Parental PIN
     PIN = 2 => Purchase PIN
     PIN = 3 or others => Reserve
    - [password]= text
    */
    this.IRD_SetPIN = function(params){
        var arr = params.split(",");
        if(arr.length != 4 || parseInt(arr[0],10) != 9 || parseInt(arr[1],10) != 2){
            return;
        }
        if(parseInt(arr[1]) == 1 && arr[3].length == 4)
        {
            sysCom.config.ParentalPin = arr[3];
            sysCom.saveConfig();
        }

        if(parseInt(arr[1]) == 2 && arr[3].length == 4)
        {
            sysCom.config.PersonalAuthenticationPin = arr[3];
            sysCom.saveConfig();
        }

    };

    /*
        6.4 Disable STB Auto-standby function
        Description: Cancel the mechanism to let STB awake all the time
        Title: __IRD_COMMAND__
        Body: 10,0
    */
    this.IRD_DisableAutoStandby = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 10 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.AutoStandby = 0;
        sysCom.saveConfig();
    };

    /*
        6.5 Enable STB Auto-standby function
        Description: Cancel the mechanism to let STB awake all the time
        Title: __IRD_COMMAND__
        Body: 11,0
    */
    this.IRD_EnableAutoStandby = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 11 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.AutoStandby = 1;
        sysCom.saveConfig();
    };

    /*
        6.6 Reboot STB
        Description: Remote to power cycle STB
        Title: __IRD_COMMAND__
        Body: 12,0
    */
    this.IRD_RebootSTB = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 12 || parseInt(arr[1],10) != 0){
            return;
        }
        utility.reboot();
    };

    /*
        6.7 Enable dynamic IP in Physical network
        Description: Let STB get the IP by DHCP with physical ethernet cable
        Title: __IRD_COMMAND__
        Body: 13,0
    */
    this.IRD_EnableDynamicIp = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 13 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.ip_get_mode = 0;
        sysCom.saveConfig();
        //dosomething
    };

    /*
     Enable dynamic IP in Physical network
    Description: Let STB get the IP by DHCP with physical ethernet cable
    Title: __IRD_COMMAND__
    Body: 13,0
    */
    this.IRD_EnableStaticIp = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 13 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.ip_get_mode = 1;
        sysCom.saveConfig();
        //dosomething
    };

    /*
    Enable static IP in Physical network for Master STB
    Description: Set static IP for Master STB
    Title: __IRD_COMMAND__
    Body: 14,4,192.168.0.100,255.255.255.0,192.168.0.100,192.168.0.100
    */
    this.IRD_EnableStaticIpForMaster = function(params) {
        var arr = params.split(",");
        if(arr.length != 6 || parseInt(arr[0],10) != 14 || parseInt(arr[1],10) != 4){
            return;
        }
    };
    /*
    Enable static IP in Physical network for Slave STB
    Description: Set static IP for Slave STB
    Title: __IRD_COMMAND__
    Body: 15,4,192.168.0.101,255.255.255.0,192.168.0.100,192.168.0.100
    */
    this.IRD_EnableStaticIpForSlave = function(params){
        var arr = params.split(",");
        if(arr.length != 6 || parseInt(arr[0],10) != 15 || parseInt(arr[1],10) != 4){
            return;
        }
    };

    /*
    Set static IP in Physical network for specific STB
    Description: Set static IP for STB
    Title: __IRD_COMMAND__
    Body: 16,4,[ip1],[ip2],[ip3],[ip4]
    Definition:
    - [ip1]/[ip2]/[ip3]/[ip4] = text
    Ex: 16,4,192.168.100.100,255.255.0.0,192.168.100.254,192.168.100.1
    */
    this.IRD_SetStaticIp = function(params){
        var arr = params.split(",");
        if(arr.length != 6 || parseInt(arr[0],10) != 16 || parseInt(arr[1],10) != 4){
            return;
        }
        var ip = arr[2];
        var mask = arr[3];
        var dns1 = arr[4];
        var dns2 = arr[5];
    };

    /*
    Factory reset with FTI skip (First Time Installation)
    Description: Do a STB factory reset and re-scan but do not perform FTI
    Title: __IRD_COMMAND__
    Body: 17,0
    */
    this.IRD_FactoyResetWithFTISkip = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 17 || parseInt(arr[1],10) != 0){
            return;
        }

        DB.DoEvnVars({
            "opt": "write",
            "var": "resolution",
            "value": 3
        });

        DB.dbClearAll(false);
        dtvCom.reset();
        sysCom.reset();
        recordSchCom.reset();
        reservationCom.reset();
        DB.appClear(false);
        sysCom.config.FTI = 0;
        sysCom.saveConfig();
        utility.reboot(false);
    };

    /*
    Reset the download applications from App Store
    Description: Clean the download applications and re-download it again
    Title: __IRD_COMMAND__
    Body: 18,0
    */
    this.IRD_ResetDownloadAppFromStore = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 18 || parseInt(arr[1],10) != 0){
            return;
        }
        DB.appClear(false);
    };

    /*
    Disable AD (advertisement) in Live TV
    Description: Disable the Live TV AD and display the default one
    Title: __IRD_COMMAND__
    Body: 19,0
    */
    this.IRD_DisableADInLiveTv = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 19 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.AdOnLivetv = 0;
        sysCom.saveConfig();
    };

    /*
    Enable AD (advertisement) in Live TV
    Description: Disable the Live TV AD and display the default one
    Title: __IRD_COMMAND__
    Body: 20,0
    */
    this.IRD_EnableADInLiveTv = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 20 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.AdOnLivetv = 1;
        sysCom.saveConfig();
    };

    /*
    Reset App Store URL to default
    Description: Reset the original URL for App Store
    Title: __IRD_COMMAND__
    Body: 21,0
    */
    this.IRD_ResetAppStoreURLToDefault = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 21 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.AppStoreURL = sysCom.defaultConfig.AppStoreURL;
        sysCom.saveConfig();
    };

    /*
    Change App Store URL
    Description: Change the App Store URL for specific purpose
    Title: __IRD_COMMAND__
    Body: 22,1,[url]
    Definition:
    - [url] = text
    Ex: 22,1,http://appstore.totaltv.com.tw
    */
    this.IRD_ChangeAppStoreURL = function(params){
        var arr = params.split(",");
        if(arr.length != 3 || parseInt(arr[0],10) != 22 || parseInt(arr[1],10) != 1){
            return;
        }
        sysCom.config.AppStoreURL = arr[2];
        sysCom.saveConfig();
    };

    /*
    Set AP Router – Home Gateway
    Description: Configure AP Router module remotely
    Title: __IRD_COMMAND__
    Body: 23,4,[interface],[ssid],[password],[security]
    Definition:
    - [interface] = 1/2/3/…/N
    - [ssid] = text
    - [password]= text
    - [security] = WEP/WPA/WPA2/…/etc
    Ex: 23,4,1,bbhome_123456,12345678,WPA
    */
    this.IRD_SetAPRouter = function(params){
        var arr = params.split(",");
        if(arr.length != 6 || parseInt(arr[0],10) != 23 || parseInt(arr[1],10) != 4){
            return;
        }
    };

    /*
     Update Entitled List by default URL – Home Gateway
    Description: Ask home gateway set-top box to update the Entitled List by
    default URL
    Title: __IRD_COMMAND__
    Body: 24,2,[seqno],[irdcmdseqno]
    Definition:
    - [seqno] = text
    - [irdcmdseqno] = text
    EX: 24,2,12345678,
    */
    this.IRD_UpdateEntitledListByDefaultURL = function(params){
        var arr = params.split(",");
        if(arr.length != 3 || parseInt(arr[0],10) != 24 || parseInt(arr[1],10) != 2){
            return;
        }
    };

    /*
    Disable First Time Installation/FTI
    Description: Disable first time installation steps
    Title: __IRD_COMMAND__
    Body: 26,0
    */
    this.IRD_DisableFTI = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 26 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.FTI = 0;
        config.saveConfig();
    };

    /*
    Description: Change URL for VBM Client reports to VBM Server
    Title: __IRD_COMMAND__
    Body: 27,1,[url]
    Definition:
    - [url] = text
    Ex: 27,1,http://vbm.totaltv.com.tw
    */
    this.IRD_ChangeVBMReportURL = function(params){
        var arr = params.split(",");
        if(arr.length != 3 || parseInt(arr[0],10) != 27 || parseInt(arr[1],10) != 1){
            return;
        }
        sysCom.config.vbmReportURL = arr[2];
        config.saveConfig();
    };

    /*

    */
    this.IRD_EnableAntiPirate = function(params){

    };

    /*

    */
    this.IRD_DisableAntiPirate = function(params){

    };

    /*
    HDD Pairing and Provision – PVR   硬碟與機上盒配對授權指令
    Description: Ask STB to pair with specific serial number HDD and provision
    PVR service
    Title: __IRD_COMMAND__
    Body: 30,5,[seialno],[onoff],[size],[tunerno],[key]
    Definition:
    - [serialno] = text HDD serial number
    - [onoff] = 0/1 0-Disable PVR, 1-Enable PVR
    - [size] = text PVR logical capacity; Unit-GB
    - [tunerno] = text PVR tuner resource
    - [key] = text PVR contents sharing key*
    *Reserve for future use
    EX: 30,5,WD-WX1234567890,1,1000,2,12345678
    */
    this.IRD_HDDPairing = function(params){
        var arr = params.split(",");
        if(arr.length != 7 || parseInt(arr[0],10) != 30 || parseInt(arr[1],10) != 5)
        {
            return;
        }
        sysCom.config.PVRPariedSn = arr[2];
        sysCom.config.PVRService = parseInt(arr[3]);
        sysCom.config.PVRSize = parseInt(arr[4]);
        sysCom.config.PVRtunerno = parseInt(arr[5]);
        sysCom.config.PVRkey = arr[6];
        sysCom.saveConfig();

        for(var  i = 0 ; i < 7; i++){
            console.log("arr "+i+ "  :"+arr[i]);
        }
    };

    /*
        HDD Provision – PVR   硬碟授權功能指令
        Description: To provision or disable PVR service
        Title: __IRD_COMMAND__
        Body: 31,4,[onoff],[size],[tunerno],[key]
        Definition:
        - [onoff] = 0/1 0-Disable PVR, 1-Enable PVR
        - [size] = text PVR logical capacity; Unit-GB
        - [tunerno] = text PVR tuner resource
        - [key] = text PVR contents sharing key*
        *Reserve for future use
        EX: 31,4,1,1000,2,12345678
    */
    this.IRD_HDDProvision = function(params){
        var arr = params.split(",");
        if(arr.length != 6 || parseInt(arr[0],10) != 31 || parseInt(arr[1],10) != 4) {
            return;
        }
        sysCom.config.PVRService = parseInt(arr[2]);
        sysCom.config.PVRSize = parseInt(arr[3]);
        sysCom.config.PVRtunerno = parseInt(arr[4]);
        sysCom.config.PVRkey = arr[5];
        sysCom.saveConfig();
    };

    /*
        HDD Formatting – PVR
        Description: Ask STB to format specific serial number HDD
        Title: __IRD_COMMAND__
        Body: 32,1,[serialno]
        Definition:
        - [serialno] = text HDD serial number
        EX: 32,1,WD-WX1234567890
    */
    this.IRD_HDDFormatting = function(params){

        var arr = params.split(",");
        if(arr.length != 3 || parseInt(arr[0],10) != 32 || parseInt(arr[1],10) != 1)
        {
            return;
        }
        var serialno =  arr[2];

        console.log("IRD_HDDFormatting ");
        var usblists = FS.fsGetDiskInfo(false);
        console.log("usblists count="+usblists.length );
        if(!usblists || usblists.length <= 0) {
            console.log("HD not ready");
            return ;
        }
        for(var k = 0;k<usblists.length;k++ )
        {
            if(usblists[k].sn==serialno) {
                fsCom.formatdisk(usblists[k].disk, false);
            }
        }

    };

    /*
        Reset STB Download Mode
        Description: When STB receives this command, it will go to Detecting mode
        Title: __IRD_COMMAND__
        Body: 33,0
        EX: 33,0
    */
    this.IRD_ResetSTBDownloadMode = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 33 || parseInt(arr[1],10) != 0){
            return;
        }
    };

    /*
    HDMI CEC Function
    Description: Ask STB to enable or disable HDMI CEC feature
    Title: __IRD_COMMAND__
    Body: 34,1,[onoff]
    Definition:
    - [onoff] = 0/1 0-Disable HDMI CEC, 1-Enable HDMI CEC
    EX: 34,1,1
    */
    this.IRD_HDMICECFuntion = function(params){
        var arr = params.split(",");
        if(arr.length != 3 || parseInt(arr[0],10) != 34 || parseInt(arr[1],10) != 1){
            return;
        }

        sysCom.comfig.hdmiCECStatus=parseInt(parseInst(arr[2])) ? 1 : 0;
        sysCom.saveConfig();
    };

    /*
    TV Fee Reminder - STB Locked Function
    Description: Put set-top box to specific Locked Page
    Title: __IRD_COMMAND__
    Body: 35,2,[onoff],[message]
    Definition:
    - [onoff] = 0/1 0-UnLock STB, 1-Lock STB
    - [message] = text Message displays on locked page
    EX: 35,2,1,請繳費
    */
    this.IRD_TVFeeReminder = function(params){

        var arr = params.split(",");
        if(arr.length != 4 || parseInt(arr[0],10) != 35 || parseInt(arr[1],10) != 2){
            return;
        }
        sysCom.config.LockStb = parseInt(arr[2]) ? 1 : 0;

        sysCom.saveConfig();
    };

    /*
        HDCP Function
        Description: Ask STB to enable or disable HDCP
        Title: __IRD_COMMAND__
        Body: 36,1,[onoff]
        Definition:
        - [onoff] = 0/1 0-Disable HDCP, 1-Enable HDCP
        EX: 36,1,1
    */
    this.IRD_HDCPFunction = function(params){
        var arr = params.split(",");
        if(arr.length != 3 || parseInt(arr[0],10) != 36 || parseInt(arr[1],10) != 1){
            return;
        }
        sysCom.config.HDCP = parseInt(arr[2])  ? 1 : 0;
        sysCom.saveConfig();
    };

    /*
        Area Limitation Function
        Description: Ask STB to enable or disable Area Limitation (AL)
        Title: __IRD_COMMAND__
        Body: 37,1,[onoff]
        Definition:
        - [onoff] = 0/1 0-Disable AL, 1-Enable AL
        EX: 37,1,1
    */
    this.IRD_AreaLimitation = function(params){
        var arr = params.split(",");
        if(arr.length != 3 || parseInt(arr[0],10) != 37 || parseInt(arr[1],10) != 1){
            return;
        }
        sysCom.config.AreaLimit = parseInt(arr[2]);
        sysCom.saveConfig();
    };

    /*
    TR069 Function
    Description: Ask STB to enable or disable TR069 function
    Title: __IRD_COMMAND__
    Body: 38,2,[onoff],[url]
    Definition:
    - [onoff] = 0/1 0-Disable TR069, 1-Enable TR069
    - [url] = text text or 0-Keep current URL
    EX: 38,2,1,http://acs.totaltv.com.tw
    EX: 38,2,0,0
    */
    this.IRD_Tr069Function = function(params){
        var arr = params.split(",");
        if(arr.length != 4 || parseInt(arr[0],10) != 38 || parseInt(arr[1],10) != 2){
            return;
        }
        sysCom.config.Tr069 = parseInt(arr[2],10);
        sysCom.saveConfig();
    };

    /*
    Rescan Channel
    Description: Ask STB to rescan channel with assigned parameters
    Title: __IRD_COMMAND__
    Body: 39,4,[frequency],[symbolrate],[modulation],[bid]
    Definition:
    - [frequency] = text (MHz) or 0-Keep current parameter
    - [symbolrate] = text (KS/s) or 0-Keep current parameter
    - [modulation] = text (QAM) or 0-Keep current parameter
    - [bid] = text or 0-Keep current parameter
    EX: 39,4,405,5217,256,25148
    EX: 39,4,405,5217,256,0
    EX: 39,4,0,0,0,0
    */
    this.IRD_RescanChannel = function(params){
        var arr = params.split(",");
        if(arr.length != 6 || parseInt(arr[0],10) != 39 || parseInt(arr[1],10) != 0){
            return;
        }
    };
}
var caCom = new CaCommon();
caCom.init();
