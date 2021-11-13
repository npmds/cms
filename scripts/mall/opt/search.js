var columns_table = [];
// columns_table.push({
//     field: 'state', title: '网站名称', align: 'center', valign: 'middle'
// });
columns_table.push({
    title: 'ID', field: 'id', visible: false,
});
columns_table.push({
    title: '网站名称', field: 'pd_name', align: 'center', valign: 'middle', formatter: "nameFormatter",
});
columns_table.push({
    title: '网站域名', field: 'site_domain', align: 'left', valign: 'middle', sortable: 'true', class: 'hidden-sm hidden-xs', formatter: "siteDomainFormatter",
});
columns_table.push({
    title: '网站类别', field: 'cls_name', align: 'center', valign: 'middle', class: 'hidden-sm hidden-xs'
});
columns_table.push({
    title: '敏感词', field: 'is_spec_price', align: 'center', class: 'hidden-sm hidden-xs', formatter: "siteAllowFormatter"
});
columns_table.push({
    title: '百度权重', field: 'site_rank', align: 'center', valign: 'middle', sortable: 'true', formatter: "siteRankFormatter",
});
columns_table.push({
    title: '百度收录', field: 'site_in_num', align: 'center', valign: 'middle', sortable: 'true', class: 'hidden-sm hidden-xs',
});
columns_table.push({
    title: '销量', field: 'sales', align: 'center', class: 'hidden-480', class: 'hidden-sm hidden-xs', sortable: 'true',
});
columns_table.push({
    title: '价格/月', field: 'price_ref', align: 'center', class: 'hidden-480', sortable: 'true', formatter: "priceFormatter"
});

columns_table.push({title: '操作', align: 'center', class: "action1", formatter: "operateFormatter"});
var $table;
$(function () {
    $("#website-left").addClass("active");
    var params_search = {}
    var fields = $("#queryForm").serializeArray();
    $.each(fields, function (i, val) {
        if (val.value != "" && val.value != null) {
            params_search[val.name] = $.trim(val.value)
        }
    });
    $table = initTableSearch(columns_table, "?method=listAjax", params_search);
    // $table.on("load-success.bs.table", function (row, event) {
    // console.log(event)
    // $('[data-toggle="tooltip"]').tooltip()
    // });
    var $checkClsId = $("#check-cls span");
    $checkClsId.click(function () {
        var $this = $(this);
        $this.siblings().removeClass("btn-danger");
        $this.addClass("btn-danger")
        var money = $this.data("value");
        $("#cls_id").val(money);
    });
    var clsId = $("#cls_id").val();
    if (clsId != "") {
        $checkClsId.removeClass("btn-danger");
        $checkClsId.each(function () {
            var $this = $(this);
            if ($this.data("value") == clsId) {
                $this.addClass("btn-danger")
            }
        });
    }

    var $priceBegin = $("#price_ge");
    var $priceEnd = $("#price_le");
    $("#check-price span").click(function () {
        var $this = $(this);
        $this.siblings().removeClass("btn-danger");
        $this.addClass("btn-danger")
        var value = $this.data("value");
        if (isNaN(value)) {
            var sp = value.split("-")
            $priceBegin.val(sp[0]);
            $priceEnd.val(sp[1]);
        } else {
            $priceEnd.val(value);
        }
    });

    var $siteAge = $("#site_age_ge");
    $("#check-site-age span").click(function () {
        var $this = $(this);
        $this.siblings().removeClass("btn-danger");
        $this.addClass("btn-danger")
        $siteAge.val($this.data("value"));
    });
});

function operateFormatter(value, row, index) {
    var html = '<div class="btn-group">';
    html += '<button type="button" class="btn btn-danger btn-sm" data-toggle="modal" onclick="addToCart(\'' + row.id + '\')">' +
        '加入购物车</button>&nbsp;&nbsp;';
    return html;
}

function priceFormatter(value, row, index) {
    return '￥' + value;
}

function nameFormatter(value, row, index) {
    return "<a href='/website/" + row.id + ".html' target='_blank'>" + row.pd_name + "</a>";
}

function siteDomainFormatter(value, row, index) {
    return "<a href='" + row.site_domain + "' target='_blank'>" + row.site_domain + "</a>";
}

function siteRankFormatter(value, row, index) {
    var rank = "<img src='https://cdn.jsdelivr.net/gh/aiservice/cms@latest/images/baiduapp/" + row.site_rank + ".png'>";
    var seoHtml = "百度收录：" + row.site_in_num;
    return "<span data-toggle=\"tooltip\" data-placement=\"top\" data-html=\"true\" title=\"" + seoHtml + "\">" + rank + "</span>";
}

function siteAllowFormatter(value, row, index) {
    if (value == 1) {
        return '<span class="label label-success">允许</span>'
    } else {
        return '<span class="label label-danger">不允许</span>'
    }
}