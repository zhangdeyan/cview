function DtvCom() {
    var self = this;

    //media player
    this.mp = null;

    //all channel array
    this.chs = [];

    //other service
    this.ots = [];

    this.barkerCh = [];

    this.doChangeChParams = {
        needPlayCurrentChannel:false,
        callback:null
    };

    this.psiCallbackArray = [
        {
            type:"update_prog_name",
            status:false,
            cb:[]
        },
        {
            type:"add_new_channels",
            status:false,
            cb:[]
        },
        {
            type:"update_logic_number",
            status:false,
            cb:[]
        },
        {
            type:"update_prog_pid",
            status:false,
            cb:[]
        },
        {
            type:"update_prog_catgory_or_type",
            status:false,
            cb:[]
        },
        {
            type:"add_new_carrier",
            status:false,
            cb:[]
        },
        {
            type:"delete_carrier",
            status:false,
            cb:[]
        },
        {
            type:"delete_channels",
            status:false,
            cb:[]
        },
        {
            type:"update_network",
            status:false,
            cb:[]
        },
        {
            type:"update_netname",
            status:false,
            cb:[]
        }
    ];

    /*
    * init dtvCommon
    */
    this.init = function () {
        this.mp = new MPlayer(0);
    };

    /*
    *  谁用,谁调用
    */
    this.start = function () {
        self.getChannels();
        self.getCategory();
        self.checkIndex();
        self.registerPsisi();
    };

    this.stop = function () {
        this.mp.mpStop(function () {});
    };

    this.reset = function () {
        self.reloadChData(true);
        sysCom.config.chIndex = 0;
        sysCom.saveConfig();
    };

    this.registerPsisi = function(){
        eventCom.registerCallback(8, function (obj) {
            if (obj.code == eventCom.EVENTCODE.CS_EVT_CHANNEL_UPDATE) {
                self.onChannelUpdate(obj);
            }
            else if (obj.code == eventCom.EVENTCODE.CS_EVT_DB_UPDATE){
                self.onDbaseUpdate(obj);
            }
        });
    };

    this.checkIndex = function(){
        if(sysCom.config.chIndex < 0 || sysCom.config.chIndex >= self.chs.length){
            sysCom.config.chIndex = 0;
            sysCom.saveConfig();
        }
    };

    this.setAspectRatio = function () {
        self.mp.mpSetAspectRatio(sysCom.config.AspectRatio, false);
    };

    this.setAspectMode = function () {
        self.mp.mpSetAspectMode(sysCom.config.AspectMode, false);
    };

    this.getChannels = function () {
        var isForceUpdate = utility.getH5Storage("CNS_DVB_FORCEUPDATE");
        console.log("isForceUpdate:"+isForceUpdate);
        var obj = utility.getH5Storage("CNS_DVB_CHS");
        if (obj && !isForceUpdate) {
            self.chs = obj;
        }
        else {
            self.chs = DB.dbGetChannels({"sortId":[1,2,17,22,25],"max": 0}, false);

            if (!self.chs) {
                self.chs = [];
            }

            for(var i = 0; i < self.chs.length;i++){
                if(self.chs[i].logicNo >= 1000 && self.chs[i].logicNo < 65535){
                    console.log("Insert To CNS_DVB_BARKERCH logicNo:"+self.chs[i].logicNo+"   name:"+self.chs[i].name);
                    self.barkerCh.push(self.chs[i]);
                    self.chs.splice(i, 1);
                    i--;
                }
                else if(self.chs[i].logicNo >= 65535){
                    console.log("Remove From CNS_DVB_CHS logicNo:" + self.chs[i].logicNo +"   name:"+self.chs[i].name);
                    self.chs.splice(i, 1);
                    i--;
                }
            }

            self.barkerCh.sort(function(a,b){
                return (a.logicNo - b.logicNo);
            });

            utility.setH5Storage("CNS_DVB_BARKERCH", self.barkerCh);
        }

        obj = utility.getH5Storage("CNS_DVB_BARKERCH");
        if(obj){
            self.barkerCh = obj;
        }

        obj = utility.getH5Storage("CNS_DVB_OTS");
        if (obj && !isForceUpdate) {
            self.ots = obj;
        }
        else {
            self.ots = DB.dbGetChannels({"sortId": [12],"max": 0}, false);
            if (!self.ots) {
                self.ots = [];
            }
            else {
                utility.setH5Storage("CNS_DVB_OTS", self.ots);
            }
        }

        utility.setH5Storage("CNS_DVB_FORCEUPDATE",0);
    };

    this.getCategory = function () {
        this.chl = [
            {name: Lp.getValue("fav_Channel"), engName: Lp.getValue("fav_Channel", 1), chs: []},
            {name: Lp.getValue("All_Channel"), engName: Lp.getValue("All_Channel", 1), chs: []},
            {name: Lp.getValue("HD"), engName: Lp.getValue("HD", 1), key: 0x0200, chs: []},
            {name: Lp.getValue("News_Finance"), engName: Lp.getValue("News_Finance", 1), key: 0x0004, chs: []},
            {name: Lp.getValue("Variety"), engName: Lp.getValue("Variety", 1), key: 0x0040, chs: []},
            {name: Lp.getValue("Films_Series"), engName: Lp.getValue("Films_Series", 1), key: 0x0020, chs: []},
            {name: Lp.getValue("Drama_Music"), engName: Lp.getValue("Drama_Music", 1), key: 0x0002, chs: []},
            {name: Lp.getValue("Children_Animation"), engName: Lp.getValue("Children_Animation", 1), key: 0x0010, chs: []},
            {name: Lp.getValue("Leisure_Knowledge"), engName: Lp.getValue("Leisure_Knowledge", 1), key: 0x0008, chs: []},
            {name: Lp.getValue("Sports_Others"), engName: Lp.getValue("Sports_Others", 1), key: 0x0400, chs: []},
            {
                name: Lp.getValue("Public_Welfare_Religion"),
                engName: Lp.getValue("Public_Welfare_Religion", 1),
                key: 0x0001,
                chs: []
            },
            {
                name: Lp.getValue("Foreign_Language_Learning"),
                engName: Lp.getValue("Foreign_Language_Learning", 1),
                key: 0x0100,
                chs: []
            },
            {name: Lp.getValue("Home_Shopping"), engName: Lp.getValue("Home_Shopping", 1), key: 0x0080, chs: []},
            {name: Lp.getValue("AdultList"), engName: Lp.getValue("Adult", 1), key: 0x0800, chs: []}
        ];

        //init all channel list
        self.chl[1].chs = self.chs;

        //loop all channel  list
        var favCnt = 0;
        for (var i = 0; i < self.chs.length; i++) {
            //init idn
            if(self.chs[i].logicNo > 0 &&  self.chs[i].logicNo < 65535){
                self.chs[i].idn = self.chs[i].logicNo;
            }
            else if(self.chs[i].logicNo == 0){
                self.chs[i].idn = self.chs[i].serviceId;
                self.barkerCh.push(self.chs[i]);
            }

            //add fav list
            if (self.chs[i].userData != null && self.chs[i].userData.fav == 1) {
                self.chl[0].chs[favCnt] = self.chs[i];
                favCnt++;
            }

            //update channel name
            if(languageCom.getMenuLanguage()==0) {
                if(self.chs[i].chiname==="unknown")
                    ;
                else
                    self.chs[i].name= dtvCom.chs[i].chiname;
            }
            else
            {
                if(self.chs[i].engname==="unknown")
                    ;
                else
                  self.chs[i].name = self.chs[i].engname;
            }
        }

        //init channel list category
        for (var i = 0; i < self.chs.length; i++) {
            if (self.chs[i].data && self.chs[i].data.category) {
                for (var k = 2; k < self.chl.length; k++) {
                    if (self.chl[k].key & self.chs[i].data.category) {
                        self.chl[k].chs[self.chl[k].chs.length] = self.chs[i];
                    }
                }
            }
        }

        self.chs.sort(function(a,b){
            return (a.idn - b.idn);
        });

        utility.setH5Storage("CNS_DVB_CHS", self.chs);
    };

    this.getIndexByNo = function (no) {

        for (var i = 0; i < self.chs.length; i++) {
            if (no == self.chs[i].idn) {
                return i;
            }
        }
        return -1;
    };

    this.getChannelByServiceId = function (serviceId) {
        var channel = null;
        if (!serviceId) {
            console.log("getChannelByServiceId param error ");
            return null;
        }

        if (!self.chs && self.chs.length <= 0) {
            console.log("getChannelByServiceId no channels ");
            return null;
        }

        for (var i = 0; i < self.chs.length; i++) {
            if (serviceId == self.chs[i].serviceId) {
                channel = self.chs[i];
            }
        }

        return channel;
    };

    this.getChannelIndexByTsServiceId = function (tsId,serviceId) {

        if (!self.chs && self.chs.length <= 0) {
            console.log("getChannelByServiceId no channels ");
            return -1;
        }

        for (var i = 0; i < self.chs.length; i++) {
            if (serviceId == self.chs[i].serviceId && tsId == self.chs[i].tsId) {
                return i;
            }
        }

        return -1;
    };

    this.getBarkerChannel = function(){
        if(self.barkerCh.length <= 0){
            return null;
        }

        return self.barkerCh[self.barkerCh.length-1];
    };

    this.playBarkerChannel = function(cb){
        if(self.barkerCh.length <= 0){
            return;
        }

        var ch = self.barkerCh[self.barkerCh.length-1];
        var url = self.getSourceUrlByCh(ch);
        if(ch.pmtPid == 65535){
            self.doChangeChParams.needPlayCurrentChannel = true;
            if (cb) {
                self.doChangeChParams.callback = cb;
            }
            else{
                self.doChangeChParams.callback = null;
            }
            self.mp.mpSetDataSource(url,false);
        }
        else{
            self.mp.mpStart(url,cb);
        }


    };

    this.updateIndex = function(no, step){
        if (self.chs && self.chs.length > 0) {
            sysCom.config.chLastIndex = sysCom.config.chIndex;
            if (typeof(no) === "number") {
                var i = self.getIndexByNo(no);
                if (i >= 0) {
                    sysCom.config.chIndex = i;
                }
            }
            else if (typeof(step) === "number") {
                sysCom.config.chIndex += (step + self.chs.length);
                sysCom.config.chIndex %= self.chs.length;
            }
            //数据库保存 当前节目号
            sysCom.saveConfig();
        }
    };

    this.updateIndex_noupdatedbase = function(no, step){
        if (self.chs && self.chs.length > 0) {
            sysCom.config.chLastIndex = sysCom.config.chIndex;
            if (typeof(no) === "number") {
                var i = self.getIndexByNo(no);
                if (i >= 0) {
                    sysCom.config.chIndex = i;
                }
            }
            else if (typeof(step) === "number") {
                sysCom.config.chIndex += (step + self.chs.length);
                sysCom.config.chIndex %= self.chs.length;
            }

        }
    };
    /*
    * changeCh
    */
    this.changeCh = function (no, step, real, cb) {
        self.updateIndex(no, step);
        self.doChangeCh(real, cb);
    };

    /*
    * doChangeCh
    */
    this.doChangeCh = function (real, cb) {

        //只设置播放地址，不真正播放
        if (typeof real != "undefined" && (real == false)) {
            return;
        }

        var url = self.getSourceUrl();
        console.log("getSourceUrl:"+url);

        var ch = self.getCurrentCh();
        if(!ch){
            console.log("channle can not find!!!");
            return;
        }

        if(ch.carrier.freq == 339000){
            console.log("doChangeCh 339000:"+JSON.stringify(ch));
        }

        if(ch.pmtPid == 65535){

            dtvCom.stop();

            console.log("channel has no data!!!  logicNo:"+ch.logicNo + "  name:"+ch.name + "   time:"+(new Date()).getTime());

            self.doChangeChParams.needPlayCurrentChannel = true;

            if (cb) {
                self.doChangeChParams.callback = cb;
            }
            else{
                self.doChangeChParams.callback = null;
            }

            self.mp.mpSetDataSource(url,false);

            return;
        }

        self.mp.mpStart(url, function (ret) {
            if (sysCom.isPowerBoot) {
                self.setAspectRatio();
                self.setAspectMode();
            }
            if (cb) {
                cb();
            }
        });
    };

    this.changeChByServiceId = function (serviceId) {

        var url = this.getLiveUrlByServiceId(serviceId);
        self.stop();
        self.mp.mpStart(url, function (ret) {
            self.status = true;
        });
    };

    this.getCurrentCh = function () {
        var ch = null;
        if (self.chs.length < 0 || sysCom.config.chIndex >= self.chs.length) {
            return ch;
        }
        else {
            ch = self.chs[sysCom.config.chIndex];
        }
        return ch;
    };

    this.getChNameByIdn = function (idn) {
        for (var i = 0; i < dtvCom.chs.length; i++) {
            if (dtvCom.chs[i].idn == idn) {
                if(languageCom.getMenuLanguage()==0) {
                    if(dtvCom.chs[i].chiname == "unknown"){
                        return dtvCom.chs[i].name;
                    }
                    else{
                        return dtvCom.chs[i].chiname;
                    }
                }
                else
                {
                    if(dtvCom.chs[i].engname == "unknown"){
                        return dtvCom.chs[i].name;
                    }
                    else{
                        return dtvCom.chs[i].engname;
                    }
                }
            }
        }
        return "";
    };

    this.checkChById = function (idn) {
        for (var i = 0; i < dtvCom.chs.length; i++) {
            if (dtvCom.chs[i].idn == idn) {
                return true;
            }
        }
        return false;
    };

    this.getChById = function (idn) {
        for (var i = 0; i < dtvCom.chs.length; i++) {
            if (dtvCom.chs[i].idn == idn) {
                return dtvCom.chs[i];
            }
        }
        return null;
    };
    /*
    * getSourceUrl
    */
    this.getSourceUrl = function () {
        var url = "";
        if (self.chs && self.chs.length > 0) {
            var channel = self.chs[sysCom.config.chIndex];
            if(!channel){
                return url;
            }
            var audioPid = 0;
            var audioType = 0;

            var videoPid = channel.video ? channel.video.pid : 0;
            var videoType = channel.video ? channel.video.type : 0;

            if (channel.audio && channel.audio.length > 1) {
                if(!channel.userData){
                    channel.userData = {};
                    channel.userData.audioSelect = 0;
                }

                if(!channel.userData.audioSelect){
                    channel.userData.audioSelect = 0;
                }

                if (channel.userData.audioSelect < channel.audio.length) {
                    audioPid = channel.audio[channel.userData.audioSelect].pid;
                    audioType = channel.audio[channel.userData.audioSelect].type;
                }
                else{
                    audioPid = channel.audio[0].pid;
                    audioType = channel.audio[0].type;
                    channel.userData.audioSelect = 0;
                }

                var params = {
                    chanId: channel.idn,
                    data: channel.userData
                };
                DB.dbSetChanUserData(params, function () {
                    utility.setH5Storage("CNS_DVB_CHS", self.chs);
                });
            }
            else if(channel.audio && channel.audio.length == 1){
                audioPid = channel.audio[0].pid;
                audioType = channel.audio[0].type;
            }

            url = "live://"
                + "signal=" + channel.carrier.signal
                + "&freq=" + channel.carrier.freq
                + "&symbol=" + channel.carrier.symbol
                + "&qam=" + channel.carrier.qam
                + "&spectrum" + 0
                + "&pcrPid=" + channel.pcrPid
                + "&aPid=" + audioPid
                + "&aStreamType=" + audioType
                + "&vPid=" + videoPid
                + "&vStreamType=" + videoType
                + "&pmtPid=" + channel.pmtPid
                + "&serviceId=" + channel.serviceId;
        }
        return url;
    };

    this.getChannelByCaLockService = function(chObj){
        for (var i = 0; i < dtvCom.chs.length; i++) {
            var ch = dtvCom.chs[i];
           if( ch.carrier.freq == chObj.frequency &&
               ch.carrier.symbol == chObj.symbolrate &&
               ch.carrier.qam == chObj.modulation &&
               ch.video.pid == chObj.videopid &&
               ch.pcrPid == chObj.pcrpid ){

               return self.getSourceUrlByCh(ch);
           }

        }
        return null;
    };

    this.getSourceUrlByCh = function(channel){
        var url = null;
        if(!channel){
            return url;
        }
        var audioPid = 0;
        var audioType = 0;

        var videoPid = channel.video ? channel.video.pid : 0;
        var videoType = channel.video ? channel.video.type : 0;

        if (channel.audio && channel.audio.length > 1) {
            if(!channel.userData){
                channel.userData = {};
                channel.userData.audioSelect = 0;
            }

            if(!channel.userData.audioSelect){
                channel.userData.audioSelect = 0;
            }

            if (channel.userData.audioSelect < channel.audio.length) {
                audioPid = channel.audio[channel.userData.audioSelect].pid;
                audioType = channel.audio[channel.userData.audioSelect].type;
            }
            else{
                audioPid = channel.audio[0].pid;
                audioType = channel.audio[0].type;
                channel.userData.audioSelect = 0;
            }
        }
        else if(channel.audio && channel.audio.length == 1){
            audioPid = channel.audio[0].pid;
            audioType = channel.audio[0].type;
        }

        url = "live://"
            + "signal=" + channel.carrier.signal
            + "&freq=" + channel.carrier.freq
            + "&symbol=" + channel.carrier.symbol
            + "&qam=" + channel.carrier.qam
            + "&spectrum" + 0
            + "&aPid=" + audioPid
            + "&vPid=" + videoPid
            + "&pcrPid=" + channel.pcrPid
            + "&aStreamType=" + audioType
            + "&vStreamType=" + videoType
            + "&pmtPid=" + channel.pmtPid
            + "&serviceId=" + channel.serviceId;

        return url;
    };

    this.getRecordUrl = function (idn) {
        var url = "";
        if (self.chs && self.chs.length > 0) {
            var index = -1;
            var channel = null;

            if (typeof idn === 'number') {
                index = self.getIndexByNo(idn);
            }

            if (index >= 0 && index < self.chs.length) {
                channel = self.chs[index];
            }

            if (!channel) {
                return "";
            }

            url = "pvrrec://"
                + "signal=" + channel.carrier.signal
                + "&freq=" + channel.carrier.freq
                + "&symbol=" + channel.carrier.symbol
                + "&qam=" + channel.carrier.qam
                + "&spectrum" + 0
                + "&vPid=" + channel.video.pid
                + "&pcrPid=" + channel.pcrPid
                + "&vStreamType=" + channel.video.type
                + "&pmtPid=" + channel.pmtPid
                + "&serviceId=" + channel.serviceId
                + "&duration=0";
        }

        return url;
    };

    this.getTimeShiftUrl = function (idn,path,time) {
        var url = "";
        if (self.chs && self.chs.length > 0) {
            var index = -1;
            var channel = null;

            if (typeof idn === 'number') {
                index = self.getIndexByNo(idn);
            }

            if (index >= 0 && index < self.chs.length) {
                channel = self.chs[index];
            }

            if (!channel) {
                return "";
            }
            var audioPid = 0;
            var audioType = 0;

            if (channel.audio && channel.audio.length > 1) {
                if(!channel.userData){
                    channel.userData = {};
                    channel.userData.audioSelect = 0;
                }

                if(!channel.userData.audioSelect){
                    channel.userData.audioSelect = 0;
                }

                if (channel.userData.audioSelect < channel.audio.length) {
                    audioPid = channel.audio[channel.userData.audioSelect].pid;
                    audioType = channel.audio[channel.userData.audioSelect].type;
                }
                else{
                    audioPid = channel.audio[0].pid;
                    audioType = channel.audio[0].type;
                    channel.userData.audioSelect = 0;
                }
            }
            else if(channel.audio && channel.audio.length == 1){
                audioPid = channel.audio[0].pid;
                audioType = channel.audio[0].type;
            }


            url = "pvrtimeshift://"
                + "signal=" + channel.carrier.signal
                + "&freq=" + channel.carrier.freq
                + "&symbol=" + channel.carrier.symbol
                + "&qam=" + channel.carrier.qam
                + "&spectrum" + 0
                + "&aPid=" + audioPid
                + "&vPid=" + channel.video.pid
                + "&pcrPid=" + channel.pcrPid
                + "&aStreamType=" + audioType
                + "&vStreamType=" + channel.video.type
                + "&pmtPid=" + channel.pmtPid
                + "&serviceId=" + channel.serviceId
                + "&duration="+time
                + "&disk="+path
                + "&folder=/PVR/TS";
        }

        return url;
    };

    this.getAudioArray = function(idn){
        var aud = [];
        if (self.chs && self.chs.length > 0) {
            var index = -1;
            var channel = null;

            if (typeof idn === 'number') {
                index = self.getIndexByNo(idn);
            }

            if (index >= 0 && index < self.chs.length) {
                channel = self.chs[index];
            }

            if (!channel) {
                return [];
            }

           aud = channel.audio;
        }

        return aud;
    };

    this.getLiveUrlByServiceId = function (serviceId) {
        var channel = null;
        var url = null;

        if (!serviceId) {
            console.log("getChannelByServiceId param error ");
            return null;
        }

        channel = this.getChannelByServiceId(serviceId);

        if (!channel) {
            console.log("getChannelByServiceId serviceId not in Channels ");
            return null;
        }

        var audioPid = 0;
        var audioType = 0;
        if (channel.audio && channel.audio.length > 1) {
            if(!channel.userData){
                channel.userData = {};
                channel.userData.audioSelect = 0;
            }

            if(!channel.userData.audioSelect){
                channel.userData.audioSelect = 0;
            }

            if (channel.userData.audioSelect < channel.audio.length) {
                audioPid = channel.audio[channel.userData.audioSelect].pid;
                audioType = channel.audio[channel.userData.audioSelect].type;
            }
            else{
                audioPid = channel.audio[0].pid;
                audioType = channel.audio[0].type;
                channel.userData.audioSelect = 0;
            }

            var params = {
                chanId: channel.idn,
                data: channel.userData
            };
            DB.dbSetChanUserData(params, function () {
                utility.setH5Storage("CNS_DVB_CHS", self.chs);
            });
        }
        else if(channel.audio && channel.audio.length == 1){
            audioPid = channel.audio[0].pid;
            audioType = channel.audio[0].type;
        }

        url = "live://"
            + "signal=" + channel.carrier.signal
            + "&freq=" + channel.carrier.freq
            + "&symbol=" + channel.carrier.symbol
            + "&qam=" + channel.carrier.qam
            + "&spectrum" + 0
            + "&aPid=" + audioPid
            + "&vPid=" + channel.video.pid
            + "&pcrPid=" + channel.pcrPid
            + "&aStreamType=" + audioType
            + "&vStreamType=" + channel.video.type
            + "&pmtPid=" + channel.pmtPid
            + "&serviceId=" + channel.serviceId;

        return url;
    };

    this.getChannelByCaLockService = function(chObj){
        for (var i = 0; i < dtvCom.chs.length; i++) {
            var ch = dtvCom.chs[i];
            if( ch.carrier.freq == chObj.frequency &&
                ch.carrier.symbol == chObj.symbolrate &&
                ch.carrier.qam == chObj.modulation &&
                ch.video.pid == chObj.videopid &&
                ch.pcrPid == chObj.pcrpid ){
                console.log("getChannelByCaLockService:"+i);
                return self.getSourceUrlByCh(ch);
            }

        }
        return null;
    };

    this.findChIndexByParams = function(chObj){
        for(var i = 0 ;i < dtvCom.chs.length; i++){
            var ch = dtvCom.chs[i];

            if(ch.carrier.freq == chObj.frequency &&
                ch.carrier.symbol == chObj.symbolrate &&
                ch.carrier.qam == chObj.modulation &&
                ch.video.pid == chObj.videopid &&
                ch.pcrPid == chObj.pcrpid)
            {
                return i;
            }
        }
        return -1;
    };

    this.getChannelByUrl = function (url) {
        if (url.substring(0, 7) != "live://") return null;
        var arr1 = url.split("&");
        var arr2 = arr1[13].split("=");
        var serviceId = parseInt(arr2[1]);

        return this.getChannelByServiceId(serviceId);
    };

    this.getChannelByName = function(name){
        var ch = null;
        for(var i = 0; i < self.ots.length;i++){
            if(self.ots[i].name == name){
                ch  = self.ots[i];
                break;
            }
        }
        return ch;
    };

    /*
    * 检查时段锁：检查当前时段是否加锁
    * return:   true:当前时段加锁     false:当前时段没有加锁
    */
    this.checkTimeLock = function () {
        if(!sysCom.config.WorkTimeSet){
            return false;
        }

        var startDate = new Date();
        startDate.setHours(sysCom.config.WorkTimeStart.hour);
        startDate.setMinutes(sysCom.config.WorkTimeStart.minute);

        var endDate = new Date();
        endDate.setHours(sysCom.config.WorkTimeEnd.hour);
        endDate.setMinutes(sysCom.config.WorkTimeEnd.minute);

        var curDate = new Date();

        if(startDate.getTime() >= endDate.getTime()){
            return false;
        }

        if(startDate.getTime() <= curDate.getTime()  && curDate.getTime() <= endDate.getTime()){
            return false;
        }
        else{
            return true;
        }
    };

    /*
    * 检查亲子锁：查看节目观看等级，与 设置的亲子等级
    * return:   true:观看等级低于亲子等级    false:观看等级高于亲子等级
    */
    this.checkParentalLock = function (epgRating) {
        if (epgRating < sysCom.config.ParentLockLevel) {
            return false;
        }
        else {
            return true;
        }
    };

    /*
     * 检查频道锁：
     * return:   true:有    false:无
     */
    this.checkChannelLock = function (ch) {
        var flag = false;

        if (!ch) {
            return false;
        }

        if (ch.userData && ch.userData.lock) {
            return true;
        }
        else {
            return false;
        }
    };

    /*
    * 设置频道锁
    * ch:频道   flag- true : lock   false: unlcok
    */
    this.setChannelLock = function (index, flag) {
        if (index < 0 || index > dtvCom.chs.length) {
            return;
        }
        //check userData
        if (!self.chs[index].userData) {
            self.chs[index].userData = {};
        }
        self.chs[index].userData.lock = flag ? 1 : 0;


        var params = {
            chanId: self.chs[index].id,
            data: self.chs[index].userData
        };
        DB.dbSetChanUserData(params, function () {
            utility.setH5Storage("CNS_DVB_CHS", self.chs);
        });
    };

    this.setAllChannelUnlock = function () {
        if (!dtvCom.chs.length) {
            return;
        }

        for (var i = 0; i < dtvCom.chs.length; i++) {
            if (!self.chs[i].userData) {
                self.chs[i].userData = {};
                continue;
            }
            self.chs[i].userData.lock = 0;

            var params = {
                chanId: self.chs[i].id,
                data: self.chs[i].userData
            };
            DB.dbSetChanUserData(params, function () {

            });
        }
        //check userData
        utility.setH5Storage("CNS_DVB_CHS", self.chs);

    };
    /*
     * 设置频道喜爱
     * ch:频道   flag- true : fav   false: unfav
     */
    this.setChannleFav = function (index, flag) {
        if (index < 0 || index > dtvCom.chs.length) {
            return;
        }

        //check userData
        if (!self.chs[index].userData) {
            self.chs[index].userData = {};
        }

        self.chs[index].userData.fav = flag ? 1 : 0;

        var params = {
            chanId: self.chs[index].id,
            data: self.chs[index].userData
        };

        //save
        DB.dbSetChanUserData(params, function () {
            utility.setH5Storage("CNS_DVB_CHS", self.chs);
        });

        //init fav channel list
        var favCnt = 0;
        self.chl[0].chs = new Array();
        for (var i = 0; i < self.chs.length; i++) {
            if (self.chs[i].userData != null && self.chs[i].userData.fav == 1) {
                self.chl[0].chs[favCnt] = self.chs[i];
                favCnt++;
            }
        }
    };
    this.checkChannelFav = function (ch) {
        var flag = false;

        if (!ch) {
            return false;
        }

        if (ch.userData && ch.userData.fav) {
            return true;
        }
        else {
            return false;
        }
    };
    this.changeAudio = function (params) {
        this.mp.mpSetAudioTrack(params, false);
    };

    this.updateChannels = function(chArray){
        var saveParams = {};
        saveParams.mode = 1;
        saveParams.chs = chArray;
        DB.dbSetChannels(saveParams,false);
    };


    //换台时,更新频道数据
    this.onChannelUpdate = function(obj){
        console.log("CS_EVT_CHANNEL_UPDATE logicNo:"+ obj.data.logicNo+"  tsid:"+obj.data.tsId+"  serviceid:"+obj.data.serviceId);
        var tsid = obj.data.tsId;
        var serviceid= obj.data.serviceId;
        var ch = self.getCurrentCh();
        console.log("CurrentChannel  logicNo:"+ch.logicNo+"  tsid:"+ch.tsId+"  serviceid:"+ch.serviceId+ "  name:"+ch.name + "   time:"+(new Date()).getTime());
        if(ch != null) {
            var chindex = self.getChannelIndexByTsServiceId(tsid,serviceid);
            var oldidn =    self.chs[chindex].idn;
            var oldUserData = self.chs[chindex].userData;
            self.chs[chindex] = obj.data;
            self.chs[chindex].idn = oldidn;
            self.chs[chindex].userData = oldUserData;
            self.chs[chindex].name = decordname(obj.data.name);
            self.chs[chindex].engname = decordname(obj.data.engname);
            self.chs[chindex].chiname = decordname(obj.data.chiname);
            if(ch.tsId == tsid && ch.serviceId == serviceid){
                if(self.doChangeChParams.needPlayCurrentChannel){
                    self.doChangeCh(true , self.doChangeChParams.callback);
                    console.log("CallBack  doChangeCh  logicNo:"+ch.logicNo+"  tsid:"+ch.tsId+"  serviceid:"+ch.serviceId+ "  name:"+ch.name + "   time:"+(new Date()).getTime());
                }
            }

            var chs = [];
            chs.push(self.chs[chindex]);
            self.updateChannels(chs);

            if(self.chs[chindex].carrier.freq == 339000){
                console.log("339000:"+JSON.stringify(self.chs[chindex]));
            }

            utility.setH5Storage("CNS_DVB_FORCEUPDATE",1);
        }

    };

    //后台psi-si有数据更新时
    this.onDbaseUpdate = function(obj){
        console.log("CS_EVT_DB_UPDATE="+JSON.stringify(obj.data));
        var i;
        var updateData = obj.data;
        if(updateData == null){
            return;
        }

        self.setUpdateType(updateData.type,true);

        switch(updateData.type)
        {
            case "update_prog_name":
                self.psiUpdateProgName(updateData);
                break;
            case "add_new_channels":
                self.psiAddNewChannels(updateData);
                break;
            case "update_logic_number":
                self.psiUpdateLogicNumber(updateData);
                break;
            case "update_prog_pid":
                self.psiUpdateProgPid(updateData);
                break;
            case "update_prog_catgory_or_type":
                self.psiUpdateCatgroyType(updateData);
                break;
            case "add_new_carrier":
                self.psiAddNewCarrier(updateData);
                break;
            case "delete_carrier":
                self.psiDeleteCarrier(updateData);
                break;
            case "delete_channels":
                self.psiDeleteChannels(updateData);
                break;
            case "update_network":
                self.psiUpdateNetwork(updateData);
                break;
            case "update_netname":
                self.psiUpdateNetName(updateData);
                break;
        }
    };

    this.psiUpdateProgName = function(updateData){
        console.log("update_prog_name "+JSON.stringify(updateData));
        var chs = [];
        for(var i = 0;i < updateData.data.length;i++) {
            var channelindex = self.getChannelIndexByTsServiceId(updateData.data[i].tsId,updateData.data[i].serviceId);
            console.log("update_prog_name tsId:"+updateData.data[i].tsId+"   serviceId"+updateData.data[i].serviceId+"    index:"+channelindex);
            if(channelindex >=0 && channelindex < self.chs.length)
            {

                console.log("update_prog_name old name="+self.chs[channelindex].name);
                self.chs[channelindex].name = decordname(updateData.data[i].name);
                self.chs[channelindex].engname = decordname(updateData.data[i].engname);
                self.chs[channelindex].chiname = decordname(updateData.data[i].chiname);
                console.log("update_prog_name new name="+self.chs[channelindex].name);

            }
            chs.push(self.chs[channelindex]);
        }
        utility.setH5Storage("CNS_DVB_FORCEUPDATE",1);
        self.updateChannels(chs);
    };

    this.psiAddNewChannels = function(updateData){
        //console.log("dbaseUpdata add_new_channels:"+JSON.stringify(updateData));
        self.reloadChData();

    };

    this.psiUpdateLogicNumber = function(updateData){
        //console.log("update_logic_number "+JSON.stringify(updateData));
        self.reloadChData();

    };

    this.psiUpdateProgPid = function(updateData){
        //console.log("update_prog_pid "+JSON.stringify(updateData));
        var chs = [];
        for(i = 0;i < updateData.data.length;i++)
        {
            var channelindex = self.getChannelIndexByTsServiceId(updateData.data[i].tsId,updateData.data[i].serviceId);
            console.log("update_prog_pid tsId:"+updateData.data[i].tsId+"   serviceId"+updateData.data[i].serviceId+"    index:"+channelindex);
            if(channelindex >=0 && channelindex < self.chs.length)
            {
                var idn = self.chs[channelindex].idn;
                var userData = self.chs[channelindex].userData;
                self.chs[channelindex] = updateData.data[i];
                self.chs[channelindex].idn =idn;
                self.chs[channelindex].userData = userData;
                self.chs[channelindex].name = decordname(updateData.data[i].name);
                self.chs[channelindex].engname = decordname(updateData.data[i].engname);
                self.chs[channelindex].chiname = decordname(updateData.data[i].chiname);

                chs.push(self.chs[channelindex]);
            }
            console.log("psiUpdateProgPid name="+self.chs[channelindex].name);

        }
        utility.setH5Storage("CNS_DVB_FORCEUPDATE",1);
        self.updateChannels(chs);
    };

    this.psiUpdateCatgroyType = function(updateData){
        //console.log("update_prog_catgory_or_type"+JSON.stringify(updateData));
        self.reloadChData();
    };

    this.psiAddNewCarrier = function(updateData){
        //console.log("add_new_carrier"+JSON.stringify(updateData));
        self.reloadChData();
    };

    this.psiDeleteCarrier = function(updateData){
        //console.log("delete_carrier "+JSON.stringify(updateData));
        self.reloadChData();
    };

    this.psiDeleteChannels = function(updateData){
        //console.log("delete_channels count="+JSON.stringify(updateData));
        self.reloadChData();
    };

    this.psiUpdateNetwork = function(updateData){
        //console.log("dbaseUpdata update_network:"+JSON.stringify(updateData));
    };

    this.psiUpdateNetName = function(updateData){
        //console.log("update_netname NetworkName="+JSON.stringify(updateData));
        sysCom.config.NetworkName = updateData.networksname;
        sysCom.saveConfig();
    };

    this.reloadChData = function(dirct){
        if(self.reloadTimer){
            clearInterval(self.reloadTimer);
            self.reloadTimer = null;
        }

        if(dirct){
            utility.setH5Storage("CNS_DVB_FORCEUPDATE",1);
            self.getChannels();
            self.getCategory();
            self.checkIndex();
            self.reloadTimer = null;
            return;
        }

        self.reloadTimer = setTimeout(function(){
            utility.setH5Storage("CNS_DVB_FORCEUPDATE",1);
            self.getChannels();
            self.getCategory();
            self.checkIndex();
            self.reloadTimer = null;
        },5*1000);
    };

    this.doCallback = function(){
        for(var i =0 ;i < self.psiCallbackArray.length;i++){
            if(self.psiCallbackArray[i].status){
                for(var j = 0; j < self.psiCallbackArray[i].cb.length; j++){
                    if(typeof self.psiCallbackArray[i].cb[j] === 'function'){
                        self.psiCallbackArray[i].cb[j]();
                    }
                }
                self.psiCallbackArray[i].status = false;
            }
        }
    };

    this.setUpdateType = function(type,status){
        for(var i = 0; i < self.psiCallbackArray.length;i++){
            if(self.psiCallbackArray[i].type == type){
                self.psiCallbackArray[i].status = status;
                break;
            }
        }
    };

    this.registerCallback = function(type,cb){

       for(var i = 0; i < self.psiCallbackArray.length;i++){
           if(self.psiCallbackArray[i].type == type){
               self.psiCallbackArray[i].cb.push(cb);
               break;
           }
       }
    };

    this.deleteCallback = function(type,cb){
        for(var i = 0;i < self.psiCallbackArray.length; i++){
            if(self.psiCallbackArray[i].type == type){
                for(var j = 0; j < self.psiCallbackArray[i].cb.length; j++){
                    if(self.psiCallbackArray[i].cb[j] == cb){
                        self.psiCallbackArray[i].cb.splice(j,1);
                        return;
                    }
                }
            }
        }
    };
}
var dtvCom = new DtvCom();
dtvCom.init();
if( g_url.indexOf("cview_app_6z18_cns") >=0) {
    dtvCom.start();//内置应用
}
else{
    setTimeout(dtvCom.start,500);
}
console.log("DtvCommon start end");