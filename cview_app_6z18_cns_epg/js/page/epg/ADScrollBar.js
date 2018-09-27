function ADScrollBar(pos) {
    var self = this;
    var id = "EPGScrollBar";
    var channel = " ";
    var time = " ";
    var program = " ";
    var img = " ";


    this.params = null;


    function create() {

        var html = '<div id="' + id + '">';
        html += '<div class="Channel_Time">';
        html += '<div class="channelContent">';
        if (self.params.channel.length > 0) {
            console.log("marquee:" + self.params.channel.length);
            if ((self.params.channel.length-2) * 22 > (pos.w) * (pos.a[0]) * 0.55) {
                html += '<marquee behavior="scroll" direction="left" loop="-1" onMouseOut="this.start()" onMouseOver="this.stop()">' + self.params.channel + '</marquee> </div>';
                console.log("execute");
            } else {
                html += self.params.channel + '</div>';
            }
        } else {
            html += "  " + '</div>';
        }
        html += '<div class="time">' + (self.params.time.length > 0 ? self.params.time : " ") + '</div>';
        html += '</div>';

        html += '<div class="Program_Name">';
        html += '<div class="programContent">';
        if (self.params.program.length > 0) {
            if ((self.params.program.length-2) * 22 > pos.w * (pos.a[1] - 0.02)) {
                console.log("marquee2");
                html += '<marquee behavior="scroll" direction="left" loop="-1" onMouseOut="this.start()" onMouseOver="this.stop()">' + self.params.program + '</marquee>' + '</div>';
            } else {
                html += self.params.program + '</div>';
            }
        } else {
            html += "  " + '</div>';
        }
        html += '</div>';

        html += '<div class="Lock_Img">';
        html += '<img  class="Img" src="' + self.params.img + '" />';
        html += '</div>';
        html += '</div>';

        $("body").append(html);

        var marginTop = pos.h * 0.2;
        var H = pos.h * 0.8;

        $("#" + id).css({
            'background-size': '100% 100%',
            'left': pos.l + 'px',
            'top': pos.t + 'px',
            'outline':'none',
            'position': 'absolute',
            'width': pos.w + 'px',
            'height': pos.h + 'px',
            'background-color': '#030101',
            'z-index':0,
        });

        $(".Channel_Time").css({
            'position': 'absolute',
            'width': pos.w * pos.a[0] + 'px',
            'height': pos.h + 'px',
            'background-color': '#030101',

        });

        // $(".channelNo").css({
        //     'position':'absolute',
        //     'width': pos.w * pos.a[0]*0.05 + 'px',
        //     'top':marginTop+'px',
        //     'height': H+'px',
        //     'font-size': '22px',
        //     'color': '#ababab',
        // });

        $(".channelContent").css({
            'position': 'absolute',
            'left': pos.w * pos.a[0] * 0.03 + 'px',
            'width': pos.w * pos.a[0] * 0.52 + 'px',
            'top': marginTop + 'px',
            'height': H + 'px',
            'font-size': '22px',
            'color': '#ababab',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
        });

        $(".time").css({
            'position': 'absolute',
            'left': pos.w * pos.a[0] * 0.55 + 'px',
            'width': pos.w * pos.a[0] * 0.45 + 'px',
            'top': marginTop + 'px',
            'height': H + 'px',
            'font-size': '22px',
            'color': '#ababab',
        });

        $(".Program_Name").css({
            'position': 'absolute',
            'width': pos.w * pos.a[1] + 'px',
            'height': pos.h + 'px',
            'left': pos.w * pos.a[0] + 'px',
            'background-color': '#030101'
        });

        $(".programContent").css({
            'position': 'absolute',
            'left': pos.w * pos.a[1] * 0.03 + 'px',
            'top': marginTop + 'px',
            'height': H + 'px',
            'font-size': '22px',
            'color': '#ababab',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
        });

        $(".Lock_Img").css({
            'position': 'absolute',
            'width': pos.w * pos.a[2] + 'px',
            'height': pos.h + 'px',
            'left': pos.w * pos.a[0] + pos.w * pos.a[1] + 'px',
            'background-color': '#030101'
        });
        $(".Img").css({
            'position': 'absolute',
            'top': marginTop + 'px',
            'right': pos.w * pos.a[2] * 0.1 + 'px',
        });

        $("#" + id).attr('tabindex', 1);

        console.log("Create completed !");

    };


    this.show = function (params) {
        if (!params) {
            console.log("return");
            return;
        } else {
            self.params = params;
        }
        self.close();
        create();
        console.log("id:" + ($("#" + id).css('width')));


    };

    this.close = function (){
        if ($('#' + id).length > 0) {
            console.log("close Program DetailDlg");
            $('#' + id).remove();
        }
    };


    return this;

}