var columns_table = [];
columns_table.push({
    class: 'hidden-480',
    title: '我的网站', field: 'rel_name', align: 'left', valign: 'middle', formatter: "siteMyFormatter"
});
columns_table.push({
    title: '上链网站', field: 'pd_name', align: 'left', valign: 'middle', formatter: "siteLinkFormatter"
});
columns_table.push({
    title: '总价', field: 'order_money', align: 'center', valign: 'middle', formatter: "numFormatter"
});
columns_table.push({
    title: '购买月数', field: 'order_num', align: 'center', valign: 'middle', class: 'hidden-480',
});
columns_table.push({
    title: '时间', field: 'add_date', align: 'center', valign: 'middle', sortable: 'true', formatter: "dateFormatter"
});
columns_table.push({
    title: '状态', field: 'order_state', align: 'center', valign: 'middle', formatter: "orderStateFormatter"
});
var $table;
var orderStateObj = {};
$(function () {
    $("#order-left").addClass("active");
    $table = initTable(columns_table, "?method=listAjax");
    $('#begin_date').datetimepicker({
        locale: 'zh-cn',
        format: 'YYYY-MM-DD'
    });
    $('#end_date').datetimepicker({
        locale: 'zh-cn',
        format: 'YYYY-MM-DD',
        useCurrent: false
    });
    $("#begin_date").on("dp.change", function (e) {
        $('#end_date').data("DateTimePicker").minDate(e.date);
    });
    $("#end_date").on("dp.change", function (e) {
        $('#begin_date').data("DateTimePicker").maxDate(e.date);
    });
    $("#order_state option").each(function () {
        if ($(this).val() != "") {
            orderStateObj[$(this).val()] = $(this).text();
        }
    });
});

function dateFormatter(value, row, index) {
    var end_date = "<p>" + moment(row.end_date).format('YYYY-MM-DD HH:mm:ss') + "</p>";
    return "<p>" + moment(value).format('YYYY-MM-DD HH:mm:ss') + "</p>" + end_date;
}

function siteMyFormatter(value, row, index) {
    return "<p class='of120' title='" + value + "'>" + value + "</p>" + "<p class='of120'><a title='" + row.rel_addr + "' href='" + row.rel_addr + "' target='_blank'>" + row.rel_addr + "</a></p>";
}

function siteLinkFormatter(value, row, index) {
    return "<p class='of120' title='" + value + "'>" + value + "</p>" + "<p class='of120'><a title='" + row.site_domain + "' href='" + row.site_domain + "' target='_blank'>" + row.site_domain + "</a></p>";
}

function orderStateFormatter(value, row, index) {
    if (value == 50) {
        return '<span class="label label-warning">' + orderStateObj[value] + '</span>'
    } else if (value == 60) {
        return '<span class="label label-success">' + orderStateObj[value] + '</span>'
    } else if (value == 70) {
        return '<span class="label label-info">' + orderStateObj[value] + '</span>'
    } else {
        return '<span class="label label-default">- ' + orderStateObj[value] + '</span>'
    }
}