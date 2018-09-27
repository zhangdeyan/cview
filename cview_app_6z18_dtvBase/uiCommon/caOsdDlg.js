function CaOsdDialog(bkImg){
    var self = this;

    this.timer = null;

    self.params = null;

    this.getDialogId = function(pos,name){
        return (name+"_"+pos);
    };

    function create(pos){
        var html = "";

        html += "<div id='" + self.getDialogId(pos,"CaOsdDialog") +"'>";
        html += "<div id='"+ self.getDialogId(pos,"CaOsdText") +"'></div>";
        html += "</div>";

        $("body").append(html);

        $("#"+self.getDialogId(pos,"CaOsdDialog")).css({
            'position':'absolute',
            'zIndex':'2',
            'top':'30px',
            'left':'0px',
            'color':'black',
            //'width':'1280px',
            'font-size':'40px'
        });

        $("#"+self.getDialogId(pos,"CaOsdText")).css({
            'position':'relative'
        });
    }
    this.show = function(params){

        if(!params){
            return;
        }

        self.hide(params.pos);


        if($("#"+self.getDialogId(params.pos,"CaOsdDialog")).length <= 0){
            create(params.pos);
        }

        $("#"+self.getDialogId(params.pos,"CaOsdText")).text(""+params.osd);

        if(params.pos == 1)
        {
            $("#"+self.getDialogId(params.pos,"CaOsdDialog")).css("top","30px");
            //$("#"+self.getDialogId(params.pos,"CaOsdDialog")).css('background-image',"url("+bkImg+")");
            $("#"+self.getDialogId(params.pos,"CaOsdDialog")).css({
                'background-color':"white",
                'white-space':'nowrap'
            });
            var w = $("#"+self.getDialogId(params.pos,"CaOsdDialog")).width();
            console.log("w:"+w);
            if(w < 1280){
                $("#"+self.getDialogId(params.pos,"CaOsdDialog")).css("width","1280px");
            }
            Move(params.pos);
        }
        else if(params.pos == 2)
        {
            $("#"+self.getDialogId(params.pos,"CaOsdDialog")).css("top","650px");
            //$("#"+self.getDialogId(params.pos,"CaOsdDialog")).css('background-image',"url("+bkImg+")");

            $("#"+self.getDialogId(params.pos,"CaOsdDialog")).css({
                'background-color':"white",
                'white-space':'nowrap'
            });
            var w = $("#"+self.getDialogId(params.pos,"CaOsdDialog")).width();
            console.log("w:"+w);
            if(w < 1280){
                $("#"+self.getDialogId(params.pos,"CaOsdDialog")).css("width","1280px");
            }

            Move(params.pos);
        }
        else if(params.pos == 3){
            $("#"+self.getDialogId(params.pos,"CaOsdDialog")).css({
                'position':'absolute',
                'zIndex':'2',
                'top':'0px',
                'left':'0px',
                'width':'1280px',
                'height':'720px',
                'color':'black',
                'word-break':'break-all',
                'background-color':"white",
                'overflow':'hidden',
                'display':'table'
            });

            $("#"+self.getDialogId(params.pos,"CaOsdText")).css({
                'text-align':'center',
                'display':'table-cell',
                'vertical-align':'middle'
            });
        }
        else if(params.pos == 4){
            $("#"+self.getDialogId(params.pos,"CaOsdDialog")).css({
                'position':'absolute',
                'zIndex':'2',
                'top':'0px',
                'left':'0px',
                'height':'360px',
                'color':'black',
                'width':'1280px',
                'word-break':'break-all',
                'background-color':"white",
                'overflow':'hidden',
                'display':'table'
            });

            $("#"+self.getDialogId(params.pos,"CaOsdText")).css({
                'text-align':'center',
                'display':'table-cell',
                'vertical-align':'middle'
            });
        }
    };
    function Move(pos)
    {
        var w = $("#"+self.getDialogId(pos,"CaOsdText")).width();
        $("#"+self.getDialogId(pos,"CaOsdText")).css("left","1280px");
        $("#"+self.getDialogId(pos,"CaOsdText")).animate({left:-w},1000*30,function(){
            Move(pos);
        });
    }

    this.hide = function(pos){

        if($("#"+self.getDialogId(pos,"CaOsdDialog")).length > 0)
        {
            $("#"+self.getDialogId(pos,"CaOsdText")).stop();
            $("#"+self.getDialogId(pos,"CaOsdDialog")).remove();
        }
    };

    return this;
}
