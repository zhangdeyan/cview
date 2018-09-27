function signalInfoDialog()
{
    var self = this;

    this.timer = null;

    self.params = null;

    self.status = false;

    var diaId = "signalInfoDialog";
    function create(){
        var html = "";
        html += "<div id='"+diaId+"'>";

        html += "<div id='"+diaId+"_title'>"+self.params.title;
        html += "</div>";

        html += "<div id='"+diaId+"_content'>";
        html += "<ul id='"+diaId+"_content_ul'>";
        for(var i = 0; i < self.params.itemArray.length; i++){
            html += '<ol id="'+diaId+"_ul_ol_"+i+'">';
            html += "<div class='"+diaId+"_left'>" +self.params.itemArray[i].name+"</div>";
            html += "<div class='"+diaId+"_right'>" +self.params.itemArray[i].content+"</div>";
            html += "</ol>";
        }
        html += "</ul>";
        html += "</div>";

        html += "<div id='"+diaId+"_font'>";
        html += "<img src='./black/images/ico_ok.png'> "+self.params.back;
        html += "  <img src='./black/images/ico_back.png'> "+self.params.back;
        html += "</div>";

        html += "</div>";

        $("body").append(html);

        var rect = {w:800,h:640};
        rect = self.getCenterPosition(rect,1280,720);
        $("#"+diaId).css({
            'position':'absolute',
            'zIndex':'2',
            'left':rect.l+'px',
            'top':rect.t+'px',
            'width':rect.w+'px',
            'background-color':'rgba(0,0,0,0.8)',
            'border':'4px solid #0080FF',
            'border-radius':'10px'
        });

        $("#"+diaId+"_title").css({
            'left':'0px',
            'top':'0px',
            'width':rect.w+'px',
            'height':60+'px',
            'color': 'white',
            'text-align':'center',
            'line-height':60+'px',
            'font-size':'24px',
            'margin':'0px'
        });

        $("#"+diaId+"_content").css({
            'padding-top':'10px',
            'margin-left':rect.w*0.02+'px',
            'width':rect.w*0.96+'px',
            'border-radius':'20px',
            'overflow':'hidden',
        });

        $("#"+diaId+"_content_ul ol").css({
            //'border':'1px solid yellow'
            'height':40+'px',
        });

        $("#"+diaId+"_content_ul ol ."+diaId+"_left").css({
            'float':'left',
            'width':rect.w*0.38+'px',
            'text-align':'right',
            'color': '#a0a0a0',
            'font-size':'22px'
        });

        $("#"+diaId+"_content_ul ol ."+diaId+"_right").css({
            'float':'right',
            'width':rect.w*0.58+'px',
            'text-align':'left',
            'color':'white',
            'font-size':'22px'
        });

        $("#"+diaId+"_font").css({
            'left':'0px',
            'top':'0px',
            'width':rect.w+'px',
            'height':60+'px',
            'color': 'white',
            'text-align':'center',
            'line-height':60+'px',
            'font-size':'20px',
            'margin':'0px'
        });

        var ele = document.getElementById(diaId);
        ele.setAttribute('tabindex', 1);
        ele.focus();
        //设置按键处理
        ele.onkeydown=function (e) {
            if(e.keyCode == 13 || e.keyCode == 8){
                self.hide();
                e.stopPropagation();
                e.preventDefault();
            }
        };

        $("#"+diaId).blur(function(){
            self.hide();
        });
    }

    this.show = function(params){
        self.params = params;
        self.hide();
        create();
        self.openUpdateTimer();
        self.status = true;
    };

    this.hide = function(){
        if($("#"+diaId).length > 0)
        {
            $("#"+diaId).remove();
        }
        self.stopUpdateTimer();
        self.status = false;
    };

    this.openUpdateTimer = function(){
        self.timer = setInterval(function(){
            self.params = self.getSignalInfo();
            self.setSignalInfo();

        },1000);
    };

    this.stopUpdateTimer = function(){
        if(self.timer){
            clearInterval(self.timer);
            self.timer = null;
        }
    };

    this.getCenterPosition = function(rect,w,h){
        rect.t = (h-rect.h)/2;
        rect.l = (w-rect.w)/2;
        return rect;
    };

    this.getSignalInfo = function(){
        var ch = dtvCom.getCurrentCh();
        var tunerInfo = Tuner.tunerGetStatus({id:0},false);
        var deviceInfo = utility.getDeviceInfo(false);
        var caNum = CA.getCardNo(false);
        var cmInfo = CableModem.cmGetIpInfo(false);
        var netInfo = NetWork.networkGet("eth1",false);

        var sigInfoParams = {
            "title":Lp.getValue("Singal_Check"),
            "back":Lp.getValue("exit"),
            "itemArray":[
                {
                    name:Lp.getValue("channel")+":",
                    content:""
                },
                {
                    name:Lp.getValue("Frequency")+"(KHz)"+":",
                    content:""
                },
                {
                    name:Lp.getValue("Symbol_rate")+"(Ks/sec)"+":",
                    content:""
                },
                {
                    name:"QAM"+":",
                    content:""
                },
                {
                    name:Lp.getValue("Signal")+"BER"+":",
                    content:"0"
                },
                {
                    name:"SNR:",
                    content:"0"
                },
                {
                    name:Lp.getValue("Signal_Strength")+":",
                    content:"0"
                },
                {
                    name:Lp.getValue("STB_Serial_Number")+":",
                    content:""
                },
                {
                    name:Lp.getValue("Smart_Card_Number")+":",
                    content:""
                },
                {
                    name:"CM IP:",
                    content:"N/A"
                },
                {
                    name:"STB IP:",
                    content:"0.0.0.0"
                },
                {
                    name:"SI "+Lp.getValue("info1")+":",
                    content:""
                },
                {
                    name:Lp.getValue("other_info1")+":",
                    content:""
                }
            ]
        };

        sigInfoParams.itemArray[0].content = "CH" + ch.idn +" "+ch.name;
        sigInfoParams.itemArray[1].content = ch.carrier.freq;
        sigInfoParams.itemArray[2].content = ch.carrier.symbol;
        sigInfoParams.itemArray[3].content = ch.carrier.qam;

        sigInfoParams.itemArray[4].content = tunerInfo.errRate;
        sigInfoParams.itemArray[5].content = tunerInfo.snr+"dB";
        sigInfoParams.itemArray[6].content = tunerInfo.strength+"dBuV";

        sigInfoParams.itemArray[7].content = deviceInfo.sn;
        sigInfoParams.itemArray[8].content = caNum.errorcode == 0 ? caNum.cardno :"0000000000000000";
        sigInfoParams.itemArray[9].content = cmInfo.wanIp;
        sigInfoParams.itemArray[10].content = netInfo.ip;
        sigInfoParams.itemArray[11].content = "ONID:"+ch.oriNetworkId+" TSID:"+ch.tsId + " SID:"+ch.serviceId;
        var v_ecmpid = "N/A";
        var vpid = "N/A";
        var a_ecmpid = "N/A";
        var apid = "N/A";
        if(ch.video){
            v_ecmpid = ch.video.ecmPid;
            vpid = ch.video.pid;
        }

        if(ch.audio && ch.audio.length >= 0){
            a_ecmpid = ch.audio[0].ecmPid;
            apid = ch.audio[0].pid;
        }
        sigInfoParams.itemArray[12].content = "V-ECMPID:"+v_ecmpid + " A-ECMPID:"+a_ecmpid
            +" VPID:"+vpid+" APID:"+apid;
        return sigInfoParams;
    };

    this.setSignalInfo = function(){
        for(var i = 0; i < self.params.itemArray.length;i++){
            $("#"+diaId+"_ul_ol_"+i+" ."+diaId+"_right").text(self.params.itemArray[i].content);
        }
    };

}