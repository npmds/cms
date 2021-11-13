var count_list = 0;
var count_view = 0;
window.img_array_list = new Array();
window.img_array_view = new Array();
// $("img").error(function () {
//     $(this).attr("src", "/images/no_img.png");
// });
$("img").on('error', function () {
    $(this).attr("src", "/images/no_img.png");
});

hotlinkview("wechat-view");

$(document).ready(function () {
    goTop();
    var rankConfig = {};
    rankConfig.TIMER_Clothing = null;
    $("li", ".ranking").mouseover(function () {
        var $this = $(this);
        rankConfig.TIMER_Clothing = setTimeout(function () {
            $this.addClass("cur").siblings().removeClass("cur");
        }, 200);
        return false
    }).mouseout(function () {
        if (rankConfig.TIMER_Clothing) {
            clearTimeout(rankConfig.TIMER_Clothing);
        }
    });
    if (typeof cur_location_url != "undefined" && cur_location_url.indexOf("wuxia") !== -1 && cur_location_url.indexOf("index.html") !== -1) {
        var tip_html = '<div class="alert alert-danger" role="alert" style="margin-top: 10px;margin-bottom: 0;"><span class="glyphicon glyphicon-send" aria-hidden="true"></span>  Sorry we don\'t support novel reading now. </div>';
        $("#carousel_aiisen").after(tip_html);
    }
});

function hotlinkview(cls) {
    $("img", "." + cls).each(function () {
        var img = $(this);
        var wd = $("." + cls).width();
        var src = img.attr("src");
        if (!src) {
            src = img.attr("data-original");
        }
        if (src) {
            if (src.indexOf("mmbiz.") !== -1) {
                //img.attr("src","//images.weserv.nl/?url="+src);
                var ifr = create_img_iframeview(src, wd);
                img.hide();
                img.after(ifr);
                img.remove();
            }
            // else if (src.indexOf("tiebapic.baidu.com") !== -1) {
            //     img.attr("src", src.replace("tiebapic.baidu.com", "cdn.tieba.moujishu.com"));
            // }
            // else if (src.indexOf("imgsrc.baidu.com") !== -1) {
            //     img.attr("src",src.replace("imgsrc.baidu.com", "cdn.baidu.moujishu.com"));
            // }
            else if (src.indexOf("sinaimg.cn") !== -1) {
                var cur_host = getHostName(src);
                var src_tmp = src.replace(cur_host, "cdn.sina.moujishu.com");
                src_tmp = src_tmp.replace("https://", "//");
                img.attr("src", src_tmp).removeAttr("data-src");
            }
        }
    });
}

function create_img_iframelist(url, wd, height) {
    var frameid = 'frameimg' + Math.random();
    var width = wd + "px";
    if (wd === "") {
        width = "100%";
    }
    window.img_list = '<img id="img" src=\'' + url + '?' + Math.random() + '\' style="width: ' + width + ';height: ' + height + 'px;" /><script>window.onload = function() { parent.document.getElementById(\'' + frameid + '\').style.height = document.getElementById(\'img\').height+\'px\'; }<' + '/script>';
    window.img_array_list[count_list] = window.img_list;
    var ifr = document.createElement('iframe');
    ifr.src = "javascript:parent.img_array_list[" + count_list + "];";
    ifr.frameBorder = "0";
    ifr.scrolling = "no";
    ifr.style.width = width;
    ifr.marginHeight = 0;
    ifr.marginWidth = 0;
    ifr.id = frameid;

    count_list++;
    return ifr;
}


function create_img_iframeview(url, width) {
    var frameid = 'frameimg' + Math.random();
    window.img_view = '<img id="img" src=\'' + url + '?' + Math.random() + '\' style="max-width: 100%;height: auto;" /><script>window.onload = function() { var f = parent.document.getElementById(\'' + frameid + '\') ;var ih = document.getElementById(\'img\').height;if(ih<=150){f.remove(f.selectedIndex);return false;}f.style.height = ih+\'px\'; }<' + '/script>';
    window.img_array_view[count_view] = window.img_view;
    var ifr = document.createElement('iframe');
    ifr.src = "javascript:parent.img_array_view[" + count_view + "];";
    ifr.frameBorder = "0";
    ifr.scrolling = "no";
    ifr.style.minHeight = "auto";
    if (width) {
        ifr.style.width = width + "px";
    }
    ifr.id = frameid;

    count_view++;
    return ifr;
}

function goTop() {
    $(function () {
        $("<style type='text/css'> .back-to-top:hover { background: linear-gradient(180deg,#455a64,#546e7a)!important; } .back-to-top { border-radius: 3px; color: #fff!important; line-height: 20px; display: none; transition: all .5s ease-in-out; background: linear-gradient(180deg,#90a4ae,#78909c); width: 40px; height: 40px; position: fixed; right: 10px; bottom: 40px; z-index: 1000001; cursor: pointer; } .back-to-top svg { position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: 10px; height: 10px; margin: auto; fill: #fff; overflow: hidden; vertical-align: middle; } </style>").appendTo("head"), $("body").append('<div class="back-to-top"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="349.629px" height="349.629px" viewBox="0 0 349.629 349.629" xml:space="preserve"><g><g><polygon points="174.827,73.433 0,253.42 23.434,276.19 174.827,120.318 326.216,276.196 349.629,253.42   "></polygon></g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g> <g></g></svg></div>');
        var o = $(".back-to-top");
        $(window).scroll(function () {
            $(window).scrollTop() >= 500 ? o.fadeIn() : o.fadeOut()
        }), o.click(function () {
            $("html,body").animate({scrollTop: 0}, 500)
        })
    })
}