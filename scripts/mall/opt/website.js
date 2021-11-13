var columns_table = [];
columns_table.push({
    field: 'state', checkbox: true, align: 'center', valign: 'middle'
});
columns_table.push({
    title: 'ID', field: 'id', visible: false,
    shown: true, type: 'input', child_type: 'hidden'
});
columns_table.push({
    title: '网站名称', field: 'pd_name', align: 'center', valign: 'middle',
    shown: true, type: 'input', child_type: 'text', required: true, maxlength: 128
});
columns_table.push({
    title: '网站域名', field: 'site_domain', align: 'left', valign: 'middle', sortable: 'true', formatter: "siteDomainFormatter",
    shown: true, type: 'input', child_type: 'text', required: true, maxlength: 128
});
columns_table.push({
    title: '网站类别', field: 'cls_name', align: 'center', valign: 'middle', class: 'hidden-480'
});
columns_table.push({
    title: '百度权重', field: 'site_rank', align: 'center', valign: 'middle', class: 'hidden-480', formatter: "siteRankFormatter",
});
columns_table.push({
    title: '网站类别', field: 'cls_id', visible: false, class: 'hidden-480',
    shown: true, type: 'select', option: getBaseClass(), required: true
});
columns_table.push({
    title: '敏感词', field: 'is_spec_price', align: 'center', class: 'hidden-480',
    shown: true, type: 'select', option: getSiteAllow(), required: true, formatter: "siteAllowFormatter",
});
columns_table.push({
    title: '友链价格', field: 'price_ref', align: 'center', class: 'hidden-480',
    shown: true, type: 'input', child_type: 'text', required: true, maxlength: 4
});
columns_table.push({
    title: '销量', field: 'sales', align: 'center', class: 'hidden-480',
});
columns_table.push({
    title: '添加时间', field: 'add_date', align: 'center', valign: 'middle', class: 'hidden-480', sortable: 'true', formatter: "dateFormatter"
});
// columns_table.push({
//     title: '价格修改时间', field: 'audit_date', align: 'center', valign: 'middle', class: 'hidden-480', formatter: "dateFormatter"
// });
columns_table.push({
    title: '网站状态', field: 'is_sell', align: 'center', valign: 'middle', formatter: "statusFormatter", class: 'hidden-480',
    shown: true, type: 'select', option: getStatus(), required: true
});
// columns.push({title: 'Data Center', field: 'regions', align: 'left', valign: 'middle',formatter: "datacenterFormmater"});
// columns.push({title: 'Status',field: 'status',align: 'center',valign: 'middle',sortable:'true'});
// columns.push({title: 'Description',field: 'description',align: 'center',valign: 'middle',sortable:'true'});
// columns.push({title: 'EnvID', field: 'environment', align: 'center', valign: 'middle',sortable:'true'});
columns_table.push({title: '操作', align: 'center', class: "action1", formatter: "operateFormatter"});
var vform;
var $table;
$(function () {
    $("#website-left").addClass("active");
    $table = initTable(columns_table, "?method=listAjax");
    $table.on("load-success.bs.table", function (row, event) {
        $('[data-toggle="tooltip"]').tooltip()
    });
    vform = $('#validation-form').validate({
        errorElement: 'div',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {
            pd_name: {required: true},
            site_domain: {required: true, url: true},
            price_ref: {required: true, digits: true},
            cls_id: {required: true},
            is_spec_price: {required: true},
            is_sell: {required: true},
        },
        messages: {
            email: {required: "请填写网站名称",},
            site_domain: {required: "请填写网站域名", url: "请正确填写域名,需包含http或者https"},
            price_ref: {required: "请填写友链价格", digits: "请正确填写价格"},
            cls_id: {required: "请选择网站类别"},
            is_spec_price: {required: "请选择是否允许敏感词"},
            is_sell: {required: "请选择是否上架"},
        },
        highlight: function (e) {
            $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
        },
        success: function (e) {
            $(e).closest('.form-group').removeClass('has-error');//.addClass('has-info');
            $(e).remove();
        }
    });
});

function submitForm(btn) {
    if (vform.form()) {
        ajax("?method=save", "validation-form", "POST", saveHandle, true, true)
    }
}

function getBaseClass() {
    var options = [];
    $("#cls_id option").each(function () {
        options.push({"value": $(this).val(), "name": $(this).text()})
    });
    return options;
}

function getSiteAllow() {
    var options = [];
    $("#is_spec_price option").each(function () {
        options.push({"value": $(this).val(), "name": $(this).text()})
    });
    return options;
}

function getStatus() {
    var options = [];
    $("#is_sell option").each(function () {
        options.push({"value": $(this).val(), "name": $(this).text()})
    });
    return options;
}

function operateFormatter(value, row, index) {
    var html = '<div class="hidden-sm hidden-xs btn-group">';
    html += '<button type="button" class="btn btn-success btn-xs" data-toggle="modal" onclick="toEdit(\'' + index + '\')">' +
        '<i class="ace-icon fa fa-pencil"></i>&nbsp;修改</button>&nbsp;&nbsp;';
    html += '<button type="button" class="btn btn-warning btn-xs" data-toggle="modal" onclick="toUpdate(\'' + row.id + '\')">' +
        '<i class="ace-icon fa fa-refresh"></i>&nbsp;刷新</button>&nbsp;&nbsp;';
    html += '<button type="button" class="btn btn-danger btn-xs" data-toggle="modal" onclick="toDelete(\'' + row.id + '\')">' +
        '<i class="ace-icon fa fa-trash-o"></i>&nbsp;删除</button>&nbsp;&nbsp;';
    html += "</div>"
    html += '<div class="hidden-md hidden-lg"> <div class="inline pos-rel"> <button class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown" data-position="auto"> <i class="ace-icon fa fa-cog icon-only bigger-110"></i> </button> <ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close">'
    html += '<li> <a href="#" onclick="toEdit(\'' + index + '\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-pencil"></i> 修改</span> </a> </li>'
    html += '<li> <a href="#" onclick="toUpdate(\'' + row.id + '\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-refresh"></i> 刷新</span> </a> </li>'
    html += '<li> <a href="#" onclick="toDelete(\'' + row.id + '\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-trash-o"></i> 删除</span> </a> </li>'
    html += '</ul></div></div>'
    return html;
}

function dateFormatter(value, row, index) {
    return moment(value).format('YYYY-MM-DD');
}

function siteDomainFormatter(value, row, index) {
    return "<a href='/website/" + row.id + ".html' target='_blank'>" + value + "</a>";
}

function siteRankFormatter(value, row, index) {
    var rank = "<img src='https://cdn.jsdelivr.net/gh/aiservice/cms@latest/images/baiduapp/" + row.site_rank + ".png'>";
    var seoHtml = "百度收录：" + row.site_in_num;
    return "<span data-toggle=\"tooltip\" data-placement=\"top\" data-html=\"true\" title=\"" + seoHtml + "\">" + rank + "</span>";
}

function statusFormatter(value, row, index) {
    if (value == 1) {
        return '<span class="label label-success">已上架</span>'
    } else {
        return '<span class="label label-warning">未上架</span>'
    }
}

function toAdd() {
    $.each(columns_table, function (i, columns) {
        columns.value = "";
        columns.readonly = false;
        if (columns.field == "is_spec_price" || columns.field == "is_sell") {
            columns.value = "1";
        }
    });
    $("#p_date_tip").empty();
    buildForm('container_data', columns_table);
    $("#add_modal").modal({backdrop: true, keyboard: true, show: true});
}

function toEdit(index) {
    var data = $table.bootstrapTable('getData', false)[index];
    $.each(columns_table, function (i, columns) {
        if (columns.shown && typeof columns.field != "undefined") {
            //console.log("columns.field:{}, value:{}", columns.field, data[columns.field])
            columns.value = data[columns.field]
            if (columns.field == "is_spec_price") {
                columns.readonly = true;
            }
        }
    });
    buildForm('container_data', columns_table);
    $("#p_date_tip").html("最近一次修改时间:" + moment(data.audit_date).format('YYYY-MM-DD'));
    $("#add_modal").modal('show');
    // $("#add_modal").modal({backdrop: true, keyboard: true, show: true});
}

function toDelete(id) {
    myConfirm(function () {
        ajax("?method=delete", {"id": id}, "POST", saveHandle, true, true)
    }, "确定要删除此网站吗？", "删除")
}

function toUpdate(id) {
    myConfirm(function () {
        ajax("?method=updateSiteSeoInfo", {"id": id}, "POST", saveHandle, true, true)
    }, "确定要刷新网站权重信息吗？", "刷新")
}

function DeleteAll() {
    var ids = getIdSelections($table);
    if (ids && ids.length > 0) {
        myConfirm(function () {
            ajax("?method=delete", {"ids": ids.join(",")}, "POST", saveHandle, true, true)
        }, "确定要删除选中的网站吗？", "删除")
    } else {
        popTip("请先选择要删除的选项")
    }
}

function saveHandle(data) {
    if (data.code == 1) {
        $('#add_modal').modal('hide');
        $('#delete_modal').modal('hide');
        $table.bootstrapTable('refresh');
    }
}

function siteAllowFormatter(value, row, index) {
    if (value == 1) {
        return '<span class="label label-success">允许</span>'
    } else {
        return '<span class="label label-danger">不允许</span>'
    }
}