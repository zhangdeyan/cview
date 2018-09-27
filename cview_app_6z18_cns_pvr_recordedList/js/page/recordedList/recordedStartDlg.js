function PlayStartDlg(params){
    var self = this;

    self.params = params;

    self.item = null;

    this.startDlgParams = [
        {
            uiType : UIFrame,
            id : "startDlgBgFrame",
            l : 490,
            t : 285,
            w : 300,
            h : 150,
            type : "img",
            imgNames : ["images/end_dialogue_bg_300x150"],
            stretch : "HV"
        },
        {uiType:UIButton,id:"lastPostionPlay",ol:10,ot:16,w:280,h:50,dt:0,
            value:Lp.getValue("playLastPostion"),HAlign:"center",font:uiCom.font.F20,
            color:"grey",focusColor:"white",
            styleClass:"way_bt"
        },
        {uiType:UIButton,id:"BeginPostionPlay",ol:10,ot:82,w:280,h:50,dt:0,
            value:Lp.getValue("BeginPlay"),HAlign:"center",font:uiCom.font.F20,
            color:"grey",focusColor:"white",
            styleClass:"way_bt"
        }
    ];

    this.create = function(){
        self.startDlg = UI.createGroup(self.startDlgParams, "startDlg", params.win);
        self.startDlg.proc= self.proc;
        self.startDlg.visibility = -1;
    };

    this.show = function(item){
        self.item = item;
        self.startDlg_PreFocusWin = params.win.getFocusWin();
        self.startDlg.visibility = 1;
        self.startDlg.getChild("lastPostionPlay").setFocus(true);
        self.startDlg.update();
    };

    this.close = function(){
        self.startDlg_PreFocusWin.setFocus(true);
        self.startDlg.visibility = -1;
        self.startDlg.update();
    };

    this.onkeyEnter = function(){
        var id = self.startDlg.getFocusWin().id;

        self.close();

        if(id == "lastPostionPlay"){
            params.playItem(self.item);
        }
        else{
            self.item.userData.lastPlayTime = 0;
            params.editItem(self.item);
            params.playItem(self.item);
        }
    };

    this.proc = function(e){
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.DOWN:
            case UI.KEY.UP:
                if(self.startDlg.getFocusWin().id=="lastPostionPlay"){
                    self.startDlg.getChild("BeginPostionPlay").setFocus(true);
                    self.startDlg.update();
                }
                else{
                    self.startDlg.getChild("lastPostionPlay").setFocus(true);
                    self.startDlg.update();
                }
                break;
            case UI.KEY.ENTER:
                self.onkeyEnter();
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

    self.create();
}