loadJs("5ca402b6fcd37c0e");

function loadJs(id) {
    // if (typeof site_id != "undefined" && site_id === 1919) {
    //     var zanUrl = "http://zan.igoodtv.com";
    //     var zanName = "万首赞美诗歌";
    //     document.writeln('<div class="panel panel-info"> <div class="panel-heading"> <h3 class="panel-title">好消息：</h3> </div> <div class="panel-body"> <a href="' + zanUrl + '" target="_blank">赞美诗歌网</a>已上线，提供高清的赞美诗歌MP4视频，请赶快下载:<a href="' + zanUrl + '" target="_blank"><code>' + zanName + '</code></a>，防止资源失效！ </div> </div>');
    // }
    // var zan = "点赞";
    // var zan_img = "<a href=\"/dashang.html\" target=\"_blank\"><img src=\"https://i.loli.net/2020/01/19/UWO4g26GmCjFdTA.jpg\" style=\"margin-bottom: 5px\"/></a>";
    // if (typeof is_english != "undefined" && is_english) {
    //     zan = "Donate";
    //     zan_img = "";
    // }
    // zan_img = "";
    // document.write('<div style=" text-align: center; height: 100px; ">' + zan_img + '<a href="/dashang.html" target="_blank" class="btn" style="color: #ec7259; background-color: #fff; border-color: #ec7259; border-radius: 8px; "><span>' + zan + '</span></a></div>');
    document.write('<div class="addthis_inline_share_toolbox"></div>');
    setTimeout(function () {
        (function () {
            var d = document, s = d.createElement('script');
            s.src = '//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-' + id;
            (d.head || d.body).appendChild(s);
        })();
    }, 3000);
}

