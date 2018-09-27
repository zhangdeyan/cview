function resInit()
{

    var gctx = document.getElementById("canvasMain").getContext("2d");

    var path = "";
    var res = new UIRes(path + "black/");
    UI.set("frameLength", 30);
    UI.set("ctx", gctx);
    UI.set("res", res);
    UI.start();

    return res;
}

function resLoader(res, endProc)
{


    var defaultImgs = [];
    var userImgs = [];

    var imgs = defaultImgs.concat(userImgs);
    res.load(imgs, endProc);
}

function resUserRegister(res)
{

}

function resDefaultRegister(res)
{

}


function starter(endProc)
{
   var res = resInit();

       resLoader(res, function (num) {
           resDefaultRegister(res);
           resUserRegister(res);
           endProc(num);
       });

}