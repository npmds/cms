/*!
 * Powered by uglifiyJS v2.6.1, Build by http://jsmin.6tie.net
 * build time: Tue Jul 21 2020 21:06:28 GMT+0800 (China Standard Time)
*/
function updateViewCount(){var t=$("#site_wrapper").data("id");t&&$.post("/MallAjax.do?method=updatePdViewCount",{id:t},function(t){})}$(document).ready(function(){setTimeout(updateViewCount,3e3)});