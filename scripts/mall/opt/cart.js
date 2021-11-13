var columns_table = [];
columns_table.push({
    field: 'state', checkbox: true, align: 'center', valign: 'middle'
});
columns_table.push({
    title: 'ID', field: 'id', visible: false,
});
columns_table.push({
    title: '网站名称', field: 'pd_name', align: 'center', valign: 'middle',
});
columns_table.push({
    title: '网站域名', field: 'site_domain', align: 'left', valign: 'middle', class: 'hidden-480', formatter: "siteDomainFormatter",
});
columns_table.push({
    title: '单价(元)', field: 'pd_price', align: 'center', valign: 'middle', class: 'hidden-480',
});
columns_table.push({
    title: '敏感词', field: 'site_allow', align: 'center', valign: 'middle', class: 'hidden-480', formatter: "siteAllowFormatter",
});
columns_table.push({
    title: $("#month_select").html(), field: 'pd_count', align: 'center', valign: 'middle', formatter: "pdNumFormatter",
});
columns_table.push({title: '操作', align: 'center', valign: 'middle', class: "action1", formatter: "operateFormatter"});
var $table;
var vform;
$(function () {
    $("#cart-left").addClass("active");
    $table = initTable(columns_table, "?method=listAjax");
    $table.on("check.bs.table", function (row, event) {
        calcPrice();
    });
    $table.on("uncheck.bs.table", function (row, event) {
        calcPrice();
    });
    $table.on("check-all.bs.table", function (row, event) {
        calcPrice();
    });
    $table.on("uncheck-all.bs.table", function (row, event) {
        calcPrice();
    });
    // var lab_balance = parseFloat($("#lab_balance").text());
    // if (lab_balance <= 0) {
    //     $("#id_chongzhi").show();
    // }

    vform = $('#validation-form').validate({
        errorElement: 'div',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {
            rel_name: {required: true},
            rel_addr: {required: true, url: true},
        },
        messages: {
            rel_name: {required: "请填写链接文字"},
            rel_addr: {required: "请填写链接地址", url: "请正确链接地址,需包含http或者https"},
        },
        highlight: function (e) {
            $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
        },
        success: function (e) {
            $(e).closest('.form-group').removeClass('has-error');//.addClass('has-info');
            $(e).remove();
        }
    });

    setTimeout(getShippingAddr, 2000)
});

function calcPrice() {
    var lab_linkcount = 0;
    var lab_amount = 0;
    $.map($table.bootstrapTable('getSelections'), function (row) {
        lab_linkcount++;
        var month = parseFloat($("#sm_" + row.id).val());
        var price = parseFloat(row.pd_price);
        console.log("month:{}, price:{}", month, price);
        lab_amount += (month * price);
    });
    $("#lab_linkcount").text(lab_linkcount);
    $("#lab_amount").text(lab_amount);
}

function operateFormatter(value, row, index) {
    var html = '<div class="hidden-sm hidden-xs btn-group">';
    html += '<button type="button" class="btn btn-danger btn-xs" data-toggle="modal" onclick="toDelete(\'' + row.id + '\')">' +
        '<i class="ace-icon fa fa-trash-o"></i>&nbsp;删除</button>&nbsp;&nbsp;';
    html += "</div>"
    html += '<div class="hidden-md hidden-lg"> <div class="inline pos-rel"> <button class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown" data-position="auto"> <i class="ace-icon fa fa-cog icon-only bigger-110"></i> </button> <ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close">'
    html += '<li> <a href="#" onclick="toDelete(\'' + row.id + '\')" class="tooltip-info" data-rel="tooltip"> <span class="red"> <i class="ace-icon fa fa-trash-o"></i> 删除</span> </a> </li>'
    html += '</ul></div></div>'
    return html;
}

function siteDomainFormatter(value, row, index) {
    return "<a href='/website/" + row.id + ".html' target='_blank'>" + value + "</a>";
}

function siteAllowFormatter(value, row, index) {
    if (value == 1) {
        return '<span class="label label-success">允许</span>'
    } else {
        return '<span class="label label-danger">不允许</span>'
    }
}

var month_data = [
    {value: '1', name: "1个月"},
    {value: '2', name: "2个月"},
    {value: '3', name: "3个月"},
    {value: '6', name: "6个月"},
    {value: '12', name: "12个月"},
];

function pdNumFormatter(value, row, index) {
    var html = "<select onchange='selectMonth(" + row.id + ")' name=\"pd_count\" id='sm_" + row.id + "' class='m_select'>";
    $.each(month_data, function (idx, obj) {
        var select = "";
        if (value == obj.value) {
            select = "selected"
        }
        html += '<option value="' + obj.value + '" ' + select + '>' + obj.name + '</option>';
    });
    html += "</select>"
    return html;
}

function toDelete(id) {
    myConfirm(function () {
        ajax("?method=delete", {"id": id}, "POST", saveHandle, true, true)
    }, "确定要删除此选项吗？", "删除")
}

function DeleteAll() {
    var ids = getIdSelections($table);
    if (ids && ids.length > 0) {
        myConfirm(function () {
            ajax("?method=delete", {"ids": ids.join(",")}, "POST", saveHandle, true, true)
        }, "确定要删除选中的选项吗？", "删除")
    } else {
        popTip("请先选择要删除的选项")
    }
}

function saveHandle(data) {
    $('#delete_modal').modal('hide');
    $table.bootstrapTable('refresh');
}

function selectMonth(id) {
    if (id) {
        var value = $("#sm_" + id).val();
        ajax("?method=update", {"id": id, "value": value}, "POST", function () {
            calcPrice();
        }, false, true)
    }
}

function batchSelectMonth(obj) {
    if (obj.value) {
        $(".m_select").val(obj.value);
        ajax("?method=update", {"value": obj.value}, "POST", function () {
            calcPrice();
        }, false, true)
    }
}

function next() {
    var ids = getIdSelections($table);
    if (ids && ids.length > 0) {
        var yue = parseFloat($("#lab_balance").text());
        var sum_price = parseFloat($("#lab_amount").text());
        if (sum_price > yue) {
            popTip("余额不足,请先充值");
            return false;
        }
        var addr = $("#shipping_addr").val();
        if (addr == "") {
            popTip("请先选择推广链接");
            return false;
        }
        myConfirm(function () {
            ajax("?method=confirmOrder", {"ids": ids.join(","), "addr_id": addr}, "POST", confirmOrderHandle, true, true)
        }, "确认要购买链接订单？", "确认")
    } else {
        popTip("请先选择要购买的链接")
    }
}

var columns_table_addr = [];

columns_table_addr.push({
    title: '链接文字', field: 'rel_name', align: 'center', valign: 'middle',
    shown: true, type: 'input', child_type: 'text', required: true, maxlength: 128
});
columns_table_addr.push({
    title: '链接地址', field: 'rel_addr', align: 'left', valign: 'middle',
    shown: true, type: 'input', child_type: 'text', value: "http://", required: true, maxlength: 128
});

function toAdd() {
    buildForm('container_data', columns_table_addr);
    $("#add_modal").modal({backdrop: true, keyboard: true, show: true});
}

function submitForm() {
    if (vform.form()) {
        ajax("?method=saveShippingAddr", "validation-form", "POST", getShippingAddr, true, true)
    }
}

function getShippingAddr() {
    $('#add_modal').modal('hide');
    ajax("?method=getShippingAddr", "validation-form", "POST", getShippingAddrHandle, false, true)
}

function getShippingAddrHandle(data) {
    if (data.code == 1) {
        var html = "<option value=\"\">请选择要推广的链接</option>"
        var datas = data.datas;
        $.each(datas, function (idx, obj) {
            html += '<option value="' + obj.id + '">' + obj.rel_name + '(' + obj.rel_addr + ')</option>';
        });
        $("#shipping_addr").empty().append(html);
    }
}

function confirmOrderHandle(data) {
    if (data.code == 1) {
        $("#pay-opt").addClass("hidden");
        $("#pay-success-tip").removeClass("hidden");
        ;
    }
}