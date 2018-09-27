
function resInit(){

    var gctx = document.getElementById("canvasMain").getContext("2d");

    var path = "";

    var res = new UIRes(path+"black/");
    UI.set("frameLength",30);
    UI.set("ctx",gctx);
    UI.set("res",res);
    UI.start();
    return res;
}

function resLoader(res,endProc){

	var defaultImgs = [
        //dialog
        "dialog/dialog_bg.png",
        "dialog/password_bg.png",
        "dialog/password_bg1.png",
        "dialog/password_inputBox.png",
        "dialog/password_inputBox1.png",
        "dialog/ico_ok.png",
        "dialog/ico_back.png",

        //volume
        "dialog/ico_sound.png",
        "dialog/mute.png",
        "dialog/volumn_bar.png",

        //video frame
        "video/DBC_background_picture.jpg",
        "video/eventLocked.jpg",
        "video/no_certification.jpg",
        "video/no_smartCard.jpg",
        "video/noSign.jpg"

	];
    var userImgs = [
        //recordingByTime
        "user/pvrScheT_background.jpg",
        "user/channel_column_background.png",
        "user/recordway_column_background.png",
        "user/timeset_column_background.png",
        "user/title_bg.png",

        "user/channelGroup_highlightWithFocus.png",
        "user/channelGroup_highlightWithNoFocus.png",
        "user/channelGroup_normal.png",

        "user/selectBox_week_highlight.png",
        "user/selectBox_week_normal.png",


        "user/ico_selected_gray.png",
        "user/ico_back.png",
        "user/ico_blue.png",
        "user/ico_ok.png",
        "user/ico_yellow.png",

        "user/recordWayBtn_highlight.png",
        "user/recordWayBtn_normal.png",
        "user/selectBox_time_highlight.png",
        "user/selectBox_time_normal.png",
        "user/btnBg_highlight_100x45.png",
        "user/btnBg_normal_100x45.png"
    ];

	var imgs = defaultImgs.concat(userImgs);
    res.load(imgs,endProc);
}
function resUserRegister(res){
    
}

function resDefaultRegister(res){

}


function starter(endProc){
    var res = resInit();
    resLoader(res,function(num)
	{
        resDefaultRegister(res);
        resUserRegister(res);
        endProc(num);
    });
}
