var columns_table = [];
columns_table.push({
    title: 'ID', field: 'id', visible: false,
    shown: true, type: 'input', child_type: 'hidden'
});
columns_table.push({
    title: '订单名称', field: 'pd_name', align: 'left', valign: 'middle', formatter: "siteLinkFormatter",
    shown: true, type: 'input', child_type: 'text', required: true, maxlength: 128
});
columns_table.push({
    title: '发货地址', field: 'rel_addr', visible: false,
    shown: true, type: 'textarea', child_type: 10, required: true, maxlength: 1024
});
columns_table.push({
    title: '订单价格', field: 'order_money', visible: false,
    shown: true, type: 'input', child_type: 'text', required: true, maxlength: 128
});
columns_table.push({
    title: '发货人姓名', field: 'rel_name', visible: false,
    shown: true, type: 'input', child_type: 'text', required: true, maxlength: 128
});
columns_table.push({
    title: '发货备注', field: 'fahuo_remark', visible: false,
    shown: true, type: 'input', child_type: 'text', required: true, maxlength: 128
});
columns_table.push({
    class: 'w250',
    title: '订单明细', field: 'rel_name', align: 'left', valign: 'middle', formatter: "siteMyFormatter"
});
columns_table.push({
    class: 'hidden-480',
    title: '总价', field: 'order_money', align: 'center', valign: 'middle', formatter: "numFormatter"
});
columns_table.push({
    title: '数量', field: 'order_num', align: 'center', valign: 'middle', class: 'hidden-480',
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
var vform;
var orderStateObj = {};
$(function () {
    $("#order-entp-left").addClass("active");
    $table = initTable(columns_table, "?method=listAjax");
    $table.on("load-success.bs.table", function (row, event) {
        $('[data-toggle="tooltip"]').tooltip()
    });
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
    vform = $('#validation-form').validate({
        errorElement: 'div',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {
            pd_name: {required: true},
            rel_addr: {required: true},
        },
        messages: {
            pd_name: {required: "请填写订单名称",},
            rel_addr: {required: "请填写发货地址"},
        },
        highlight: function (e) {
            $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
        },
        success: function (e) {
            $(e).closest('.form-group').removeClass('has-error');//.addClass('has-info');
            $(e).remove();
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
    var end_date = "";
    var pay_date = "";
    if (row.end_date) {
        var dateTip = "结束时间";
        var dateTipClass = "";
        if ((row.order_type == 100 || row.order_type == 200)) {
            dateTip = "退款时间";
            dateTipClass = "text-danger";
        }
        end_date = "<p class='" + dateTipClass + "' data-toggle=\"tooltip\" data-placement=\"top\" title=\"" + dateTip + "\">" + moment(row.end_date).format('YYYY-MM-DD HH:mm:ss') + "</p>";
    }
    if ((row.order_type == 100 || row.order_type == 200) && row.pay_date) {
        pay_date = "<p class='text-success' data-toggle=\"tooltip\" data-placement=\"top\" title=\"付款时间\">" + moment(row.pay_date).format('YYYY-MM-DD HH:mm:ss') + "</p>";
    }
    return "<p data-toggle=\"tooltip\" data-placement=\"top\" title=\"下单时间\">" + moment(value).format('YYYY-MM-DD HH:mm:ss') + "</p>" + pay_date + end_date;
}

function siteMyFormatter(value, row, index) {
    if (row.order_type == 100) {
        return value + " " + row.rel_addr + " " + row.fahuo_remark;
    } else if (row.order_type == 200) {
        return " <div>" + escapeHtml(row.rel_addr) + "</div> " + row.fahuo_remark;
    } else if (row.order_type == 40) {

    } else {
        return "<p class='of120' title='" + value + "'><label class='label label-default' onclick='toView(" + index + ")'>复制</label>&nbsp;" + value + "</p>" + "<p class='of120'><a title='" + row.rel_addr + "' href='" + row.rel_addr + "' target='_blank'>" + row.rel_addr + "</a></p>";
    }
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function siteLinkFormatter(value, row, index) {
    if (row.order_type == 100) {
        return row.trade_index + "<br/>" + value;
    } else if (row.order_type == 200) {
        var href = "http://www.xiaolipan.com/p/" + row.pd_id + ".html";
        var copyHtml = '<button data-clipboard-text="' + value + '" class="copy btn btn-default btn-xs" type="button"><i class="ace-icon fa fa-copy"></i>复制</button>';
        return row.trade_index + "<br/><a href='" + href + "' target='_blank'>" + value + "</a>" + copyHtml;
    } else if (row.order_type == 40) {
        return value;
    } else {
        return "<p class='of120' title='" + value + "'>" + value + "</p>" + "<p class='of120'><a title='" + row.site_domain + "' href='" + row.site_domain + "' target='_blank'>" + row.site_domain + "</a></p>";
    }
}

function orderStateFormatter(value, row, index) {
    var remark = "";
    if (row.order_type == 200 && row.remark) {
        remark = '<br/><span class="label label-warning">' + row.remark + '</span>';
    }
    if (value == 50) {
        return '<span class="label label-warning">' + orderStateObj[value] + '</span>'
    } else if (value == 60) {
        return '<span class="label label-success">' + orderStateObj[value] + '</span>'
    } else if (value == 70) {
        return '<span class="label label-info">' + orderStateObj[value] + '</span>'
    } else if (value == 0) {
        return '<span class="label label-default">' + orderStateObj[value] + '</span>'
    } else if (value == 9) {
        return '<span class="label label-success">' + orderStateObj[value] + '</span>' + remark
    } else if (value == -8) {
        return '<span class="label label-danger">' + orderStateObj[value] + '</span>' + remark
    } else {
        return '<span class="label label-success">- ' + orderStateObj[value] + '</span>'
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

    if ((row.order_type == 100 || row.order_type == 200) && row.order_state == 0) {
        html += '<button type="button" class="btn btn-danger btn-xs" data-toggle="modal" onclick="toPay(\'' + index + '\')">' +
            '<i class="ace-icon fa fa-refresh"></i> 补支付</button>';
    }
    if ((row.order_type == 100 || row.order_type == 200) && row.order_state == 9) {
        html += '<button type="button" class="btn btn-info btn-xs" data-toggle="modal" onclick="resend(\'' + index + '\')">' +
            '<i class="ace-icon fa fa-send"></i> 邮件</button>';
        html += '<button type="button" class="btn btn-danger btn-xs" data-toggle="modal" onclick="refund(\'' + index + '\')">' +
            '<i class="ace-icon fa fa-recycle"></i> 退款</button>';
    }

    html += '<button type="button" class="btn btn-default btn-xs" data-toggle="modal" onclick="toEdit(\'' + index + '\')">' +
        '<i class="ace-icon fa fa-edit"></i> 修改</button>';
    html += "</div>"
    html += '<div class="hidden-md hidden-lg"> <div class="inline pos-rel"> <button class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown" data-position="auto"> <i class="ace-icon fa fa-cog icon-only bigger-110"></i> </button> <ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close">'
    html += '<li> <a href="#" onclick="toEdit(\'' + index + '\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-edit"></i> 修改</span> </a> </li>'
    html += '</ul></div></div>'
    return html;
}

function toEdit(index) {
    var data = $table.bootstrapTable('getData', false)[index];
    $.each(columns_table, function (i, columns) {
        if (columns.shown && typeof columns.field != "undefined") {
            //console.log("columns.field:{}, value:{}", columns.field, data[columns.field])
            columns.value = data[columns.field]
        }
    });
    buildForm('container_data', columns_table);
    $("#add_modal").modal('show');
}

function toPay(index) {
    var data = $table.bootstrapTable('getData', false)[index];
    myConfirm(function () {
        ajax("?method=toPay", {"trade_index": data.trade_index}, "POST", saveHandle, true, true)
    }, "确认此订单已支付吗？", "确定")
}

function refund(index) {
    var data = $table.bootstrapTable('getData', false)[index];
    myConfirm(function () {
        ajax("?method=alipayRefund", {"trade_index": data.trade_index}, "POST", saveHandle, true, true)
    }, "确认进行退款操作吗？", "确定")
}

function resend(index) {
    var data = $table.bootstrapTable('getData', false)[index];
    myConfirm(function () {
        ajax("CsAjax.do?method=sendPaySuccessEmail", {"id": data.id}, "POST", saveHandle, true, true)
    }, "确认进行补发邮件操作吗？", "确定")
}

function saveHandle(data) {
    if (data.code == 1) {
        $('#add_modal').modal('hide');
        $table.bootstrapTable('refresh');
    }
}

function saveHandleAndSendEmail(data) {
    if (data.code == 1) {
        var id = $("#container_data").find("input[name='id']").val();
        ajax("CsAjax.do?method=sendPaySuccessEmail", {"id": id}, "POST", saveHandle, true, true)
    }
}

function submitForm(sendEmail) {
    if (vform.form()) {
        if (sendEmail) {
            ajax("?method=save", "validation-form", "POST", saveHandleAndSendEmail, true, true)
        } else {
            ajax("?method=save", "validation-form", "POST", saveHandle, true, true)
        }
    }
}
