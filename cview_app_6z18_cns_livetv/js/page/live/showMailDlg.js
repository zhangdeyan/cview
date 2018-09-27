function MailShowDlg(bgImg,backImg){
    var self = this;

    var id = "CH_LiveShowMailDlg";

    self.params = null;

    function create(){
        var html = '<div id="'+id+'">';
        html += '<p class="mail_title">' + Lp.getValue("mailInfo") + '</p>';
        html += '<div class="mail_content">';
        html += '<p class="content_title"></p>';
        html += '<p class="content_text"></p>';
        html += '</div>';
        html += '<div class="mail_footer">';
        html += '<img class="mail_ico" src="'+backImg+'">';
        html += '<p class="mail_icoTxt">' + Lp.getValue("Up_Page") + '</p>';
        html += '</div>';
        html += '</div>';
        $("body").append(html);

        $("#"+id).css({
            'background-image': "url("+bgImg+")", 'background-size': '100% 100%',
            'position': 'absolute', 'top': '100px', 'left': '230px', 'width': '820px', 'height': '505px' ,'z-index':3
        });


        $(".mail_title").css({
            'width': '820px', 'height': '60px', 'font-size': '28px', 'color': '#A6A6A6', 'text-align': 'center',
            'line-height': '65px'
        });


        $(".mail_content").css({'width': '690px', 'height': '380px', 'margin': '0 50px'});

        $(".content_title").css({
            'height': '70px', 'font-size': '25px', 'color': 'white', 'text-align': 'center', 'margin-top': '5px'
        });

        $(".content_text").css({'height': '310px', 'font-size': '20px', 'color': 'white','word-break':'break-all'});
        $(".mail_footer").css({
            'width': '120px', 'height': '20px', 'line-height': '20px', 'margin': '15px 350px',
            'font-size': '18px', 'color': '#A6A6A6'
        });
        $(".mail_ico").css({'float': 'left', 'margin-right': '5px'});
        $(".mail_icoTxt").css({'float': 'left'});

        //邮件内容
        self.mailcontent = self.mailcontent.replace(/(\r\n)|(\n)/g, '<br />');

        $(".content_title").text(params.title?params.title:"");

        $(".content_text").html(params.text?params.text:"");

        $("#"+id).attr('tabindex', 1);

        $("#"+id).focus();
        $("#mail:focus").css({'outline': 'none'});
        $("#"+id).keydown(function (e) {
            console.log("in mail:" + e.keyCode);
            switch (e.keyCode) {
                case UI.KEY.BACKSPACE:
                case UI.KEY.ENTER:
                    self.close();
                    break;
                default:
                    break;
            }
        });
    }

    this.show = function(params){
        self.params = params;
        if($('#'+id).length <= 0)
        {
            console.log("create caMailDlg");
            create();
        }
    };

    this.close = function(){
        if($('#'+id).length > 0) {
            console.log("close caMailDlg");
            $('#'+id).remove();
        }
    };

    return this;
}