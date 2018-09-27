/*传入参数
p = {
    ch: getCh(),    //频道获取函数
    areaId: 节点,
    url: logo图片文件地址,
    dat: 信息字符串,
};
启动函数start()，停止函数stop()
调用方法：  this.ticker = new Ticker(p);
            this.ticker.start();
            this.ticker.exit();
*/

function Ticker(p)
{
    var self = this;
    self.params = p;
    self.timer = null;
    self.chlist = [];
    self.showItemArray = [];

    // constructor
    console.log("Ticker constructed.");
    // Constructed end


    /*解析数据，检验数据是否有误*/
    this.parseText = function (){

        var txts = self.params.dat;
        txts=txts.replace(/\n/g,'*');
       console.log("txts:"+txts);

        if (self.params.getCurrentCh && self.params.areaId && self.params.dat && self.params.url) {
            str = self.params.dat.split("\r\n");
            //第一行  以逗号隔开的 逻辑频道号
            /*重复开始*/
            //第二行  显示规则
            //第三行  显示内容
        }
        else {
            return false;
        }

        console.log("str:"+JSON.stringify(str));

        str.pop();

        for(var i = 0; i < str.length;i++){
            console.log("i:"+str[i]);
        }


        self.chlist = self.getChList(str[0]);
        self.showItemArray = self.getShowItemArray(str);
        console.log("chlist:"+JSON.stringify(self.chlist));
        console.log("showItemArray:"+JSON.stringify(self.showItemArray));
        return true;
    };

    this.getChList = function(str){
        var chArray = [];
        if(!str || str == ""){
            return chArray;
        }

        chArray = str.split(",");

        for(var i = 0; i < chArray.length;i++){
            chArray[i] = parseInt(chArray[i],10);
        }

        return chArray;
    };

    this.getShowItemArray = function(str){
        var showItemArray = [];
        if(!str || str == "" || str.length <= 1){
            return showItemArray;
        }

        for(var i = 1; i< str.length; i=i+2){
            if(!str || str == ""){
                continue;
            }

            var item = {
                rulers:null,
                textArray:null
            };
            var rulerStr = str[i];
            var textStr = str[i+1];
            item.rulers = self.getRulers(rulerStr);
            item.textArray = self.getTextArray(textStr);
            item.runTime = self.getRunTime(self.getTextArrayLength(item.textArray),item.rulers.speed,item.rulers.period);
            showItemArray.push(item);
        }
        return showItemArray;
    };

    this.getTextArrayLength = function(textArray){
        var length = 0;
        if(!textArray || textArray.length == 0){
            return length;
        }
        for(var i = 0;i<textArray.length;i++){
            length += textArray[i].text.length;
        }
        return length;
    };

    this.getRunTime = function(length,speed,period){
        var mtime = 0;
        switch(parseInt(speed)){
            case 0:
                mtime = period * 60;
                break;
            case 1:
                mtime = (length / 0.5);
                break;
            case 2:
                mtime = (length / 0.75);
                break;
            case 3:
                mtime = (length / 1);
                break;
            case 4:
                mtime = (length / 1.5);
                break;
            case 5:
                mtime = (length / 2);
                break;
        }
        return mtime;
    };

    this.getRulers = function(rulerStr){
        if(!rulerStr){
            return null;
        }

        var rulers={
            startTime:null,
            endTime:null,
            period:null,
            defaultTextColor:null,
            defaultBgColor:null,
            textSize:null,
            frequency:null,
            speed:null,
            pos:null,
            colorTextNums:null,
            areaId:null,
            showCh:[],
            soLogo:null
        };
        //0800-2100/5 #FFFFFF#000000FF 25 5 2 1 1 000 0036,0041,0045,0050,0051,0052,0053,0055,0056,1000 na
        var temp = rulerStr.split(" ");
        rulers.startTime = (temp[0].split("/"))[0].split("-")[0];
        rulers.endTime = (temp[0].split("/"))[0].split("-")[1];
        rulers.period = (temp[0].split("/"))[1];
        rulers.defaultTextColor = "#" + temp[1].split("#")[1];
        rulers.defaultBgColor = "#" + temp[1].split("#")[2];
        rulers.textSize = temp[2];
        rulers.frequency = temp[3];
        rulers.speed = temp[4];
        rulers.pos = temp[5];
        rulers.colorTextNums = temp[6];
        rulers.areaId = temp[7];
        rulers.showCh = temp[8].split(",");
        if(rulers.showCh.length == 1 && rulers.showCh[0] == "*"){
            rulers.showCh = self.chlist;
        }
        else{
            for(var i = 0 ; i < rulers.showCh.length;i++){
                if(rulers.showCh[i].charAt(0) == '^'){
                    rulers.showCh.splice(i,1);
                    i--;
                }
                else{
                    rulers.showCh[i] = parseInt(rulers.showCh[i],10);
                }
            }
        }

        rulers.soLogo = temp[9];
        return rulers;
    };

    this.getTextArray = function(textStr){
        if(!textStr || textStr==""){
            return null;
        }
        //[#FFFF00]這是個循環五次每次預計三十秒的。。。。。頻道三六頻道四一頻道四五頻道五十頻道五一頻道五二頻道五三頻道五五頻道五六頻道一千[/]
        var textArray = [];
        var temp = textStr.split("[/]");
        for(var i = 0 ; i < temp.length;i++){
            if(temp[i].charAt(0) == '[' && temp[i].charAt(1) == '#'){
                var color = temp[i].slice(1,8);
                var text = temp[i].slice(9);
                var html = "<span style='color:"+color +"'>"+text +"</span>";
                var item = {
                    color:color,
                    text:text,
                    html:html
                };

                textArray.push(item);
            }
        }
        return textArray;
    };

    this.getTotalRunTime = function(showItemArray){
        var totalRunTime  = 0;
        for(var i = 0; i < showItemArray.length;i++){
            if(self.checkCurrentTimeCanShow(showItemArray[i].rulers)){2018/6/12
                totalRunTime += showItemArray[i].rulers.frequency * showItemArray[i].runTime;
            }
        }
        console.log("totalRunTime:"+totalRunTime);
        return totalRunTime;
    };

    this.getMinTickerTime = function(showItemArray){
        var minTickerTime  = 0;
        for(var i = 0; i < showItemArray.length;i++){
            if(self.checkCurrentTimeCanShow(showItemArray[i].rulers)){
                if(i == 0 ||  minTickerTime > showItemArray[i].rulers.period*60){
                    minTickerTime = showItemArray[i].rulers.period * 60;
                }
            }
        }
        console.log("minTickerTime:"+minTickerTime);
        return minTickerTime;
    };

    this.checkCurrentTimeCanShow = function(rulers){
        var startHour = parseInt(rulers.startTime.substring(0,2));
        var startMin = parseInt(rulers.startTime.substring(2));
        var startDate = new Date();
        startDate.setHours(startHour,startMin, 0, 0 );

        var endHour = parseInt(rulers.endTime.substring(0,2));
        var endMin = parseInt(rulers.endTime.substring(2));
        var endDate = new Date();
        endDate.setHours(endHour,endMin, 0, 0 );


        var currentDate = new Date();
        if(currentDate.getTime() > startDate.getTime() && currentDate.getTime() < endDate.getTime()){
            return true;
        }
        else{
            return false;
        }
    };

    this.checkAreaId = function(rules){
        if(rules.areaId == "000"){
            return true;
        }

        if(rules.areaId == self.params.areaId){
            return true;
        }

        return false;
    };

    this.checkChannel = function(rulers){
        var currentCh = self.params.getCurrentCh();
        for(var i = 0;i < rulers.showCh.length;i++){
            if(currentCh == rulers.showCh[i]){
                return true;
            }
        }
        return false;
    };

    this.createDialog = function(){
        var html = "";
        html += "<div id='cnsTICKERDialog'>";
        html += "</div>";
        $("body").append(html);
        $("#cnsTICKERDialog").css({
            'position':'absolute',
            'zIndex':'2'
        });
    };

    this.showTicker = function(){
        var rulers = self.showTickerListArray[self.showTickerListIndex].rulers;
        //设置默认底色和字体颜色以及字体大小
        $("#cnsTICKERDialog").css({
            'background-color':rulers.defaultBgColor,
            'color':rulers.defaultTextColor,
            'font-size':rulers.textSize*2+"px"
        });

        //添加显示内容
        $("#cnsTICKERDialog").append(self.showTickerListArray[self.showTickerListIndex].html);
        $("#cnsTICKERDialog span").css('white-space','nowrap');


        //屏幕上方 由右向左
        if(rulers.pos == 1){
            $("#cnsTICKERDialog").css({
                'top':'30px',
                'left':'1280px'
            });
            var w  = $("#cnsTICKERDialog").outerWidth();
            $("#cnsTICKERDialog").animate({left:-w+'px'},self.showTickerListArray[self.showTickerListIndex].runTime*1000,null,function(){
                $("#cnsTICKERDialog span").remove();
                self.showTickerListIndex++;
                self.startShowTickerBylist();
            });
        }
        else if(rulers.pos == 2){

        }
    };

    this.showTickerListIndex = 0;
    this.showTickerListArray = [];
    this.startShowTickerBylist = function(){

        if(self.showTickerListIndex >= self.showTickerListArray.length){
            self.showTickerListIndex = 0;
            self.showTickerListArray = [];
            console.log("index is not correct!");
            return;
        }

        //判断显示时间是否正确
        if(!self.checkCurrentTimeCanShow(self.showTickerListArray[self.showTickerListIndex].rulers)){
            self.showTickerListIndex++;
            self.startShowTickerBylist();
            console.log("time is not correct!");
            return;
        }

        //判断区域码是否正确
        if(!self.checkAreaId(self.showTickerListArray[self.showTickerListIndex].rulers)){
            self.showTickerListIndex++;
            self.startShowTickerBylist();
            console.log("aeraId is not correct!");
            return;
        }

        //判断显示时频道是否正确
        if(!self.checkChannel(self.showTickerListArray[self.showTickerListIndex].rulers)){
            self.showTickerListIndex++;
            self.startShowTickerBylist();
            console.log("channel is not correct!");
            return;
        }

        self.showTicker();
    };


    this.startShowTickerTimer = function(){
        setInterval(function(){
            if(self.showTickerListArray.length == 0){
                return;
            }

            if(self.showTickerListIndex == 0 && self.showTickerListArray.length > 0 && $("#cnsTICKERDialog").is(":animated")){
                return;
            }

            if(self.showTickerListIndex == 0 && self.showTickerListArray.length > 0 && !$("#cnsTICKERDialog").is(":animated")){
                self.startShowTickerBylist();
            }


        },1000);
    };

    this.addloop = function(item){
        item.timer = setInterval(function(){
            for(var j = 0; j < item.rulers.frequency; j++){
                self.showTickerListArray.push(item);
            }
        },item.rulers.period * 60 * 1000);
    };

    this.startTimer = function(){
        var html = "";
        self.showTickerListIndex = 0;
        self.showTickerListArray = [];
        for(var i = 0 ;i < self.showItemArray.length;i++){
            html = "";
            for(var j = 0; j < self.showItemArray[i].textArray.length;j++){
                html  +=  self.showItemArray[i].textArray[j].html;
            }

            var item = {
                rulers:self.showItemArray[i].rulers,
                html:html,
                runTime:self.showItemArray[i].runTime,
                timer:null
            };

            for(var j = 0; j < item.rulers.frequency; j++){
                self.showTickerListArray.push(item);
            }


            self.addloop(item);
        }

        self.startShowTickerTimer();
    };

    this.start = function(){
        //解析数据
        if(!self.parseText()){
            console.log("parseText failed!");
            return;
        }

        if(self.showItemArray.length <= 0){
            console.log("showItemArray length == 0!");
            return;
        }
        self.createDialog();
        //按照时间添加
        self.startTimer();
    };


}
