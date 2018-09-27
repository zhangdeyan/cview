function ProgramDlg(okImg) {
    var self = this;
    var id = "ProgramDlg";
    this.params = null;


    function create() {
        var html = '<div id="' + id + '">';
        html += '<div class="Detail_title">';
        html += '<div class="Program_title">';
        // html += '<div class="Program_title">' + '<marquee behavior="scroll" direction="left" loop="-1" onMouseOut="this.start()" onMouseOver="this.stop()">' + (self.params.ProgramTitle.length > 0 ? self.params.ProgramTitle : "   ") + '</marquee>' + '</div>';
        if(self.params.ProgramTitle.length > 0 ){
            if((self.params.ProgramTitle.length*24) > 300 ){
                html += '<marquee behavior="scroll" direction="left" loop="-1" onMouseOut="this.start()" onMouseOver="this.stop()">'+self.params.ProgramTitle + '</marquee>'+'</div>';
            }else{
                html +=self.params.ProgramTitle + '</div>';
            }
        }else {
            html+="    "+'</div>';
        }
        html += '<div class="timer">' + (self.params.Timer.length > 0 ? self.params.Timer : "00/00 00:00-00:00") + '</div>';
        html += '</div>'; //end title

        html += '<div class="Program_content" >';
        html += '<p class="content_text" >' + (self.params.ProgramContext.length > 0 ? self.params.ProgramContext : "br/") + '</p>';
        if (self.params.ProgramContext.length*24 > (560*6)){
            html += '<div class="sliderWrap" >';
            html += '<div class="slider" >';
            html += '</div>';
            html += '</div>';
        }
        html += '</div>'; //end content
        html += '<div class="Program_footer">';
        html += '<img class="Program_ico" src="' + okImg + '"/>';
        html += '<span class="Program_icoTxt">' + Lp.getValue("Close")+ '</span>';
        html += '</div>';
        html += '</div>';
        $("body").append(html);

        $("#" + id).css({
            'background-size': '100% 100%', 'border': '5px #05d7ff solid', 'border-radius': '20px',
            'position': 'absolute', 'top': '120px', 'left': '340px', 'width': '600px', 'height': '300px',
            'background-color': '#030101','outline':'none',
            'z-index':2
        });

        $(".Detail_title").css({'width': '600px', 'height': '50px'});

        $(".Program_title").css({
            'width': '300px', 'height': '40px', 'font-size': '24px', 'color': '#ffffff', 'text-align': 'left',
            'line-height': '50px',
            'margin': '5 10px',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
        });

        $(".timer").css({
            'width': '200px', 'height': '20px', 'font-size': '18px', 'color': '#747474',
            'line-height': '50px',
            'margin-left': '400px', 'margin-top': '-40px'
        });

        $(".Program_content").css({
            'position': 'absolute',
            'width': '560px',
            'height': '200px',
            'margin': '0 20px',
            'background-color': '#ffffff',
            'overflow': 'hidden',
        });
        $(".content_text").css({
            'position': 'absolute',
            'font-size': '24px',
            'color': '#1c1c1c',
        });
        $(".sliderWrap").css({
            'position': 'absolute',
            'top': '0',
            'right': '0',
            'height': '100%',
            'width': '10px',
            'background-color': '#ffffff',
            'border-radius': '10px'
        });
        $(".slider").css({
            'position': 'absolute',
            'width': '10px',
            'right': '0',
            'height': '40px',
            'background': '#ababab',
            'border-radius': '10px',
            'cursor': 'pointer',
        });
        $(".Program_footer").css({
            'top': '85%',
            'position': 'absolute',
            'width': '500px',
            'height': '20px',
            'line-height': '20px',
            'margin': '8px 35px',
            'font-size': '22px',
            'color': '#ffffff'
        });
        $(".Program_ico").css({'position': 'absolute', 'left': '40%'});
        $(".Program_icoTxt").css({'position': 'absolute', 'left': '48%'});


        $("#" + id).attr('tabindex', 1);
        $("#" + id).focus();
        $("#Program:focus").css({'outline': 'none'});

        //键盘事件
        $("#" + id).keydown(function (e) {
            var ev = e || window.event;
            var ret = false;
            console.log("in Program:" + ev.keyCode);
            switch (ev.keyCode) {
                case UI.KEY.LEFT:
                case UI.KEY.RIGHT:
                case UI.KEY.CHNUP:
                case UI.KEY.CHNDOWN:
                case UI.KEY.FUNRED:
                case UI.KEY.RECORD:
                case UI.KEY.FUNGREEN:
                case UI.KEY.FUNYELLOW:
                case UI.KEY.BACKSPACE:
                    ev.preventDefault();
                    ev.stopPropagation();
                    ret = true;
                    break;
                case UI.KEY.ENTER:
                    self.close();
                    ev.preventDefault();
                    ev.stopPropagation();
                    ret = true;
                    break;
                case UI.KEY.DOWN:
                    y += 10;
                    move();
                    ev.preventDefault();
                    ev.stopPropagation();
                    ret = true;
                    break;
                case UI.KEY.UP:
                    y -= 10;
                    move();
                    ev.preventDefault();
                    ev.stopPropagation();
                    ret = true;
                    break;

            }
        });

        // 鼠标滑动
        $(".slider").mousedown(function (e) {
            var ev = e || window.event;
            var disY = ev.clientY - (parseFloat($(".slider").css('top')));

            $("#" + id).mousemove(function (e) {
                var ev = e || window.event;
                y = ev.clientY - disY;
                move();
            });

            $("#" + id).mouseup(function () {
                $("#" + id).mousemove = null;
            });
            return false;
        });


    };

    var y = 0;


    function move() {
        //获取slider的最大偏移量

        var maxSliderHeight = (parseFloat($(".sliderWrap").css('height'))) - (parseFloat($(".slider").css('height')));


        //获取文本的最大偏移量

        var maxMiddleHeight = (parseFloat($(".content_text").css('height'))) - (parseFloat($(".Program_content").css('height')));
        console.log("y:" + y);

        if (y <= 0) {
            y = 0;
        }

        if (y >= maxSliderHeight) {
            y = maxSliderHeight
        }

        var scaleY = y / maxSliderHeight;
        $(".slider").css('top', y);
        console.log("文本移动:" + (-(scaleY * maxMiddleHeight)));
        $(".content_text").css('top', -(scaleY * maxMiddleHeight));
    }

    this.show = function (params) {
        if (!params) {
            return;
        }else {
            self.params = params;
        }

        if ($('#' + id).length <= 0) {
            create();
        }
    };

    this.close = function () {
        if ($('#' + id).length > 0) {
            console.log("close Program DetailDlg");
            $('#' + id).remove();
            self.params.openTimer();
        }
    };

    return this;
}