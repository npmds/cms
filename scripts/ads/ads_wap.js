var url = window.location.href;
if(url.indexOf("www.aiis") !== -1){
    loadOther(0.5);
    // removeAds();
}else{
    loadOther(0.5);
}
function loadOther(opactiy){
    if(isMobile()&&!isWechat()){
        // document.write('<div id="wap-ads" style="opacity:'+opactiy+';overflow: hidden;">');
        // document.write('<div><script src="https://d2ecd088ed70.idoc58.com//image/5696"></script></div>');
        // document.write('</div>');

        document.write('<div style="opacity:'+opactiy+';overflow: hidden;">');
        document.write('<div><script src="http://kelvy.iomsew.com/cds/aiisen.js"></script></div>');
        // document.write('<div><script  src="https://76c9cbdb8a8f.fos123.com/766901.html?"></script>');
        document.write('</div>');
    }
}


function removeAds(id) {
    setTimeout(function(){
        document.getElementById('wap-ads').style.display = 'none';
        var f = parent.document.getElementById('ads_iframe') ;
        var ih = document.getElementById('ads1').clientHeight;
        console.log(ih)
        if(ih)
            f.style.height = ih+'px';
    },5000);
}