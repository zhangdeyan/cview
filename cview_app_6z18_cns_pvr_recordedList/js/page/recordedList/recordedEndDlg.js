function PlayEndDlg(params){
    var self = this;

    self.params = params;

    self.item = null;

    this.endDlgParams = [
        {
            uiType : UIFrame,
            id : "endDlgBgFrame",
            l : 490,
            t : 285,
            w : 300,
            h : 200,
            type : "img",
            imgNames : ["images/end_dialogue_bg_300x150"],
            stretch : "HV",
            focusMoveMode:"circle"
        },
        {uiType:UIButton,id:"exit",ol:10,ot:16,w:280,h:50,dt:0,
            value:Lp.getValue("exit"),HAlign:"center",font:uiCom.font.F20,
            color:"grey",focusColor:"white",
            styleClass:"way_bt"
        },
        {uiType:UIButton,id:"replay",ol:10,ot:82,w:280,h:50,dt:0,
            value:Lp.getValue("replay"),HAlign:"center",font:uiCom.font.F20,
            color:"grey",focusColor:"white",
            styleClass:"way_bt"
        },
        {uiType:UIButton,id:"delete",ol:10,ot:148,w:280,h:50,dt:0,
            value:Lp.getValue("delete"),HAlign:"center",font:uiCom.font.F20,
            color:"grey",focusColor:"white",
            styleClass:"way_bt"
        }
    ];

    this.create = function(){
        self.endDlg = UI.createGroup(self.endDlgParams, "endDlg", params.win);
        self.endDlg.proc= self.proc;
        self.endDlg.visibility = -1;
    };

    this.show = function(item){
        self.item = item;
        self.startDlg_PreFocusWin = params.win.getFocusWin();
        self.endDlg.visibility = 1;
        self.endDlg.getChild("exit").setFocus(true);
        self.endDlg.update();
    };

    this.close = function(){
        self.startDlg_PreFocusWin.setFocus(true);
        self.endDlg.visibility = -1;
        self.endDlg.update();
    };

    this.onkeyEnter = function(){
        var id = self.endDlg.getFocusWin().id;
        self.close();
        if(id == "exit"){
            self.params.exitFun();
        }
        else if(id == "replay"){
            self.params.replayFun();
        }
        else if(id == "delete"){
            self.params.deleteFun();
        }
    };

    this.proc = function(e){
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.ENTER:
                self.onkeyEnter();
                break;
            case UI.KEY.BACKSPACE:
                self.close();
                self.params.exitFun();
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };
    self.create();
}