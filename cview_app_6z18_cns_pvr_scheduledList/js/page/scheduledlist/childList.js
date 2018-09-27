function ChildList(params)
{
    var self = this;
    self.deleteList = new Array();
    this.childParams = [
        {uiType:UIFrame,id:"childListFrame",l:240,t:115,w:800,h:500,type:"img",imgNames:["user/folderList_bg_820x500"],stretch:"HV",visibility:1},
        {uiType:UILabel,id:"titleLabel",ol:20,ot:10,w:500,h:40,font:uiCom.font.F20,color:"grey",HAlign:"left",value:""},
        {uiType:UILabel,id:"listNum",ol:700,ot:10,w:100,h:40,font:uiCom.font.F20,color:"grey",HAlign:"center",value:""},
        {
            uiType : UILabel, id : "proName", ol : 100, ot : 50, w : 120, h : 40,
            font : uiCom.font.F20, color : "#62815a", value : Lp.getValue("programName")
        },

        {
            uiType : UILabel, id : "startDate", ol : 410, ot : 50, w : 100, h : 40,
            font : uiCom.font.F20, color : "#62815a", value : Lp.getValue("start_date")
        },

        {
            uiType : UILabel, id : "start_end_time", ol :540, ot : 50, w : 140, h : 40,
            font : uiCom.font.F20, color : "#62815a", value : Lp.getValue("start_end_time")
        },
        {
            uiType:UITable,id:"listTable",ol:10,ot:80,w:780,h:375,lineRectWidth:0,
            lineHWidth:0,lineVWidth:0,lineColor:"#505050",color:"grey",font:uiCom.font.F20,
            cols:5,rows:0,rowsOnePage:8,focusColor:"white",
            skin:{
                normalBar : {type : "none"},
                selectBar : {type : "img", imgNames : ["user/epgList_markselected"], stretch : "HV"},
                focusBar : {type : "img", imgNames : ["user/epgList_selected"], stretch : "HV"}
            }

        },
        {
            uiType:UIImg,id:"iconRed",ol:260,ot:465,w:25,h:25,src:"user/ico_red",stretch:"HV"
        },
        {
            uiType : UILabel, id : "deleteLabel", ol : 300, ot : 465, w : 130, h : 40,
            font : uiCom.font.F18, color : "#62815a", value : Lp.getValue("cancel_recording")
        },
        {
            uiType:UIImg,id:"iconBack",ol:440,ot:465,w:45,h:25,src:"user/ico_back",stretch:"HV"
        },
        {
            uiType : UILabel, id : "deleteLabel", ol : 500, ot : 465, w : 80, h : 40,
            font : uiCom.font.F18, color : "#62815a", value : Lp.getValue("Back")
        }
    ];

    this.createChildListDlg = function(){
        self.childlistDlg = UI.createGroup(self.childParams,"childList",params.parent.win);
        self.childTitleLabel = self.childlistDlg.getChild("titleLabel");
        self.childListNum = self.childlistDlg.getChild("listNum");
        self.childlistTb = self.childlistDlg.getChild("listTable");
        self.childlistTb.setColWidthArr([
            self.childlistTb.w*0.1,
            self.childlistTb.w*0.4,
            self.childlistTb.w*0.18,
            self.childlistTb.w*0.18,
            self.childlistTb.w*0.1
        ]);
        self.childlistTb.proc = self.childlistTbProc;
        self.childlistDlg.proc = self.childlistProc;
    };

    this.childlistProc = function(e){
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.FUNRED:
                self.onkeyRed();
                break;
            case UI.KEY.BACKSPACE:
                self.close();
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };

    this.childlistTbProc = function(e){
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.UP:
                self.childlistTb.listUp();
                self.updateNum();
                params.parent.win.update();
                break;
            case UI.KEY.DOWN:
                self.childlistTb.listDown();
                self.updateNum();
                params.parent.win.update();
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };

    this.updateNum = function(){
        var totalNum = self.childlistTb.rows;
        var curIndex = self.childlistTb.curIndex + 1;
        self.childListNum.value = ""+curIndex+"/"+totalNum;
    };

    this.initChildListDlg = function(){
        self.childTitleLabel.value = Lp.getValue("recording_list")+" > "+params.title;
        self.childListNum.value = "1/"+params.data.length;

        var taData = [];
        for(var i = 0; i < params.data.length; i++){
            taData[i] = new Array();
            //分级图标
            console.log("params.data[i].level:"+params.data[i].level);
            taData[i][0] = {type : "img", img : getEpgImgByRate(params.data[i].level)};
            //第多少集
            taData[i][1] = params.data[i].name;
            //开始日期
            taData[i][2] = params.data[i].startDate;
            //录制开始结束时间
            taData[i][3] = params.data[i].startEndTime;
            //录制状态
            taData[i][4] = params.data[i].recordStatus ? {type:"img",img:"recordinglist/ico_recording",alignH:"right",alignV:"center"} : null;
        }
        self.childlistTb.removeItems();
        self.childlistTb.addItems(taData);
        self.updateNum();
        self.childlistDlg.update();
    };

    this.show = function()
    {
        self.createChildListDlg();
        self.initChildListDlg();
        self.preFocusWin = params.parent.win.getFocusWin();
        self.childlistDlg.visibility = 1;
        self.childlistTb.setFocus(true);
        params.parent.win.update();
    };

    this.close = function(){
        self.childlistDlg.destroy();
        params.parent.deleteSerialItems(self.deleteList);
        self.preFocusWin.setFocus(true);
        params.parent.win.update();
    };

    this.onkeyRed = function(){
        if(params.data.length <= 0 ) {
            return;
        }
        self.showDelete();
    };

    this.deleteCurItem = function(){
        var index = self.childlistTb.curIndex;
        var e = params.data[self.childlistTb.curIndex].event;
        //删除列表中添加
        self.deleteList.push(e);
        //tasklist 中删除
        params.data.splice(self.childlistTb.curIndex,1);

        self.initChildListDlg();
    };

    this.showDelete = function(){
        if(self.deleteDlg)
        {
            self.deleteDlg.close();
        }

        var text =  Lp.getValue("delete_recording_item_confirm");

        var pr = {
            proc : self.deleteDialogProc,
            win : params.parent.win,
            frame : {w : 400, h : 200, t : 0, bg : "dialog/dialog_bg"},
            title : {dt : 7, font : uiCom.font.F20, color : "white", value : Lp.getValue("recording_prom_info")},
            content : {dw : -30, dt : 0, dh : -10, dl : 2, labelDt : 10, firstRowHeadSpace : "", font : uiCom.font.F20,
                color : "white",
                msg : text,
                bgColor : "",
                HAlign : "center",
                labelDt:50
            },
            nav : {
                dt : 14,
                dl : 100,
                color : "white",
                font : uiCom.font.F20,
                groupSpace : 30,
                group : [
                    {
                        img : "user/ico_ok",
                        text : Lp.getValue("Ok"),
                        fun : function()
                        {
                            self.deleteDlg.close(true);
                            self.deleteCurItem();

                        },
                        key : UI.KEY.ENTER
                    }
                    ,
                    {
                        img : "user/ico_back",
                        text : Lp.getValue("Back"),
                        fun : function()
                        {
                            self.deleteDlg.close(true);
                        },
                        key : UI.KEY.BACKSPACE
                    }
                ]
            }
        };

        self.deleteDlg = new TextDialog(pr);
        self.deleteDlg.show();
    };

    this.deleteDialogProc = function(e){
        var ret = true;
        console.log("in deleteDialogProc");
        switch(e.keyCode){
            case UI.KEY.UP:
                self.deleteDlg.onkeyUp();
                break;
            case UI.KEY.DOWN:
                self.deleteDlg.onkeyDown();
                break;
            default:
                self.deleteDlg.onkeyDefault(e.keyCode);
                break;
        }
        return ret;
    };
}