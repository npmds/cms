var columns_table = [];
columns_table.push({
    title: '我的网站', field: 'pd_name', align: 'left', valign: 'middle', formatter: "siteLinkFormatter"
});
columns_table.push({
    title: '待上链接', field: 'rel_name', align: 'left', valign: 'middle', formatter: "siteMyFormatter"
});
columns_table.push({
    class: 'hidden-480',
    title: '总价', field: 'order_money', align: 'center', valign: 'middle', formatter: "numFormatter"
});
columns_table.push({
    title: '购买月数', field: 'order_num', align: 'center', valign: 'middle', class: 'hidden-480',
});
columns_table.push({
    class: 'hidden-480',
    title: '时间', field: 'add_date', align: 'center', valign: 'middle', sortable: 'true', formatter: "dateFormatter"
});
columns_table.push({
    title: '状态', field: 'order_state', align: 'center', valign: 'middle', formatter: "orderStateFormatter"
});
columns_table.push({
    title: '操作', align: 'center', valign: 'middle', formatter: "optFormatter"
});
var $table;
var orderStateObj = {};
$(function () {
    $("#order-entp-left").addClass("active");
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
    var clipboard = new ClipboardJS(".copy");
    clipboard.on('success', function (e) {
        popTip("复制成功:" + e.text);
    });
    clipboard.on('error', function (e) {
        popTip("复制失败:" + e);
    });
});

function dateFormatter(value, row, index) {
    var end_date = "<p>" + moment(row.end_date).format('YYYY-MM-DD HH:mm:ss') + "</p>";
    return "<p>" + moment(value).format('YYYY-MM-DD HH:mm:ss') + "</p>" + end_date;
}

function siteMyFormatter(value, row, index) {
    return "<p class='of120' title='" + value + "'><label class='label label-default' onclick='toView(" + index + ")'>复制</label>&nbsp;" + value + "</p>" + "<p class='of120'><a title='" + row.rel_addr + "' href='" + row.rel_addr + "' target='_blank'>" + row.rel_addr + "</a></p>";
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

function optFormatter(value, row, index) {
    var html = '<div class="hidden-sm hidden-xs btn-group">';
    if (row.order_state == 50) {
        html += '<button type="button" class="btn btn-success btn-xs" data-toggle="modal" onclick="checkLink(\'' + index + '\')">' +
            '<i class="ace-icon fa fa-link"></i> 上链</button>';
    }
    if (row.order_state == -20) {
        html += '<button type="button" class="btn btn-danger btn-xs" data-toggle="modal" onclick="checkLinkError(\'' + index + '\')">' +
            '<i class="ace-icon fa fa-bug"></i> 故障</button>';
    }

    html += '<button type="button" class="btn btn-default btn-xs" data-toggle="modal" onclick="toView(\'' + index + '\')">' +
        '<i class="ace-icon fa fa-copy"></i> 复制</button>';
    html += "</div>"
    html += '<div class="hidden-md hidden-lg"> <div class="inline pos-rel"> <button class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown" data-position="auto"> <i class="ace-icon fa fa-cog icon-only bigger-110"></i> </button> <ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close">'
    if (row.order_state == 50) {
        html += '<li> <a href="#" onclick="toEdit(\'' + index + '\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-link"></i> 上链</span> </a> </li>'
    }
    if (row.order_state == -20) {
        html += '<li> <a href="#" onclick="toDelete(\'' + row.id + '\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-bug"></i> 故障</span> </a> </li>'
    }
    html += '<li> <a href="#" onclick="toView(\'' + index + '\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-copy"></i> 复制</span> </a> </li>'
    html += '</ul></div></div>'
    return html;
}

function toView(index) {
    var data = $table.bootstrapTable('getData', false)[index];
    $("#rel_name").val(data.rel_name);
    $("#rel_addr").val(data.rel_addr);
    $("#view_modal").modal('show');
}

function checkLink(index) {
    var data = $table.bootstrapTable('getData', false)[index];
    myConfirm(function () {
        ajax("?method=checkLink", {"id": data.id, "domainSource": data.site_domain, "domainTarget": data.rel_addr, "nameTarget": data.rel_name}, "POST", saveHandle, true, true)
    }, "确认已经上链了吗？", "检查上链")
}

function checkLinkError(index) {
    var data = $table.bootstrapTable('getData', false)[index];
    myConfirm(function () {
        ajax("?method=checkLink", {"id": data.id, "domainSource": data.site_domain, "domainTarget": data.rel_addr, "nameTarget": data.rel_name}, "POST", saveHandle, true, true)
    }, "确认故障已经处理？", "检查故障")
}

function saveHandle(data) {
    if (data.code == 1) {
        $table.bootstrapTable('refresh');
    }
}