document.write('<div class="row text-center" style="margin-left: 0;margin-right: 0">');
var adsTipHtml = '<div style=" background-color: #FFF; border-bottom: 3px solid #327ab7; padding: 10px 0; "> <h3 class="panel-title">赞助商链接</h3> </div>';
if(typeof site_enabled_g != "undefined" && site_enabled_g && typeof g_enabled_ads != "undefined" && g_enabled_ads) {
    document.writeln(adsTipHtml);
}
if (typeof site_enabled_b != "undefined" && site_enabled_b && typeof site_enabled_g != "undefined" && site_enabled_g) {
    document.write('<div class="col-sm-6">');
    loadGoogleAds();
    loadOther();
    document.write('</div>');
    document.write('<div class="col-sm-6">');
    loadBaiduAds("cms_left_bottom");
    document.write('</div>');
    if (typeof site_enabled_other != "undefined" && site_enabled_other && isMobile()) {
        loadThirdAds("cms_left_bottom");
    }
} else if (typeof site_enabled_g != "undefined" && site_enabled_g && typeof site_enabled_other != "undefined" && site_enabled_other) {
    document.write('<div class="col-sm-6">');
    loadGoogleAds();
    loadOther();
    document.write('</div>');
    document.write('<div class="col-sm-6">');
    loadThirdAds("cms_left_bottom");
    document.write('</div>');
} else if (typeof site_enabled_g != "undefined" && site_enabled_g && typeof site_enabled_alimama != "undefined" && site_enabled_alimama) {
    document.write('<div class="col-sm-6">');
    loadGoogleAds();
    loadOther();
    document.write('</div>');
    document.write('<div class="col-sm-6">');
    loadAlimama("cms_left_bottom");
    document.write('</div>');
} else if (typeof site_enabled_g != "undefined" && site_enabled_g && typeof site_enabled_e != "undefined" && site_enabled_e) {
    document.write('<div class="col-sm-6">');
    loadGoogleAds();
    loadOther();
    document.write('</div>');
    document.write('<div class="col-sm-6">');
    loadExoAds("cms_left_bottom");
    document.write('</div>');
} else if (typeof site_enabled_g != "undefined" && site_enabled_g) {
    if (isMobile()) {
        loadGoogleAds();
        loadOther();
    } else {
        document.write('<div class="col-sm-6">');
        loadGoogleAds();
        loadOther();
        document.write('</div>');
        document.write('<div class="col-sm-6">');
        loadGoogleAds();
        document.write('</div>');
    }
} else if (typeof site_enabled_b != "undefined" && site_enabled_b) {
    loadBaiduAds("cms_left_bottom");
    loadOther();
} else if (typeof site_enabled_alimama != "undefined" && site_enabled_alimama) {
    loadAlimama("cms_left_bottom");
    loadOther();
} else if (typeof site_enabled_e != "undefined" && site_enabled_e) {
    loadExoAds("cms_left_bottom");
}
document.write('</div>');
