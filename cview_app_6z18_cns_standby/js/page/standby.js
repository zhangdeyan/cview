function StandbyPage(params, srcModule)
{
    this.dlgParam = [
        {uiType : UIFrame, id : "standbyFrame", l : 0, t : 0, w : UI.width, h : UI.height, type : "rect",color:"black"}
    ];

    this.open = function ()
    {
        this.defOpen();
        console.log("StandbyPage Open!");
    };

    this.close = function ()
    {
        this.defClose();
        console.log("StandbyPage Close");
    };

    this.start = function ()
    {
        console.log("StandbyPage start");
        Subtitle.subtStop(null,false);
        dtvCom.stop();
        dsmssCom.getAdData(true);
        AppManager.forceUpdate(false);
        //check app
    };

    this.stop = function () {
        console.log("StandbyPage stop");
        var update_ret = AppManager.getStaus(false);
        if(update_ret == 0) {
            sysCom.setMemConfig("current_app_list", []);
            sysCom.setMemConfig("apprenew", 1);//強制列表不存在，需要重新獲取
        }
    };

    this.onkey = function (e)
    {
        var ret = false;
        console.log("In StandbyPage module keyCode =" + e.keyCode);
        switch (e.keyCode) {
            case UI.KEY.BACKSPACE:

                break;
        }
        return ret;
    };
}

StandbyPage.prototype = UIModule.baseModule;