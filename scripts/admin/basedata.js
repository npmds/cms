var columns_table = [];
columns_table.push({
    field: 'state', checkbox: true, align: 'center'
});
columns_table.push({
    title: 'ID', field: 'id', visible: false,
    shown: true, type: 'input', child_type: 'hidden'
});
columns_table.push({
    title: 'MOD_ID', field: 'mod_id', visible: false,
    shown: true, type: 'input', child_type: 'hidden'
});
columns_table.push({
    title: 'TYPE', field: 'type', visible: false,
    shown: true, type: 'input', child_type: 'hidden'
});
columns_table.push({
    title: '编码', field: 'type_value', align: 'center', class: 'hidden-480'
});
columns_table.push({
    title: '名称', field: 'type_name', align: 'center', formatter: "nameFormatter",
    shown: true, type: 'input', child_type: 'text', required: true, maxlength: 128
});
columns_table.push({
    title: 'URL', field: 'type_url', align: 'center', class: 'hidden-480',
    shown: true, type: 'input', child_type: 'text', required: true, maxlength: 256
});
columns_table.push({
    title: '备注', field: 'remark', align: 'center', class: "w400", formatter: "remarkFormatter",
    shown: true, type: 'textarea', child_type: 20, required: true, maxlength: 1024
});
columns_table.push({
    title: '排序值', field: 'order_value', align: 'center', sortable: 'true', class: 'hidden-480',
    shown: true, type: 'input', child_type: 'text', required: true, maxlength: 4
});
columns_table.push({
    title: '添加时间', field: 'add_date', align: 'center', class: 'hidden-480', sortable: 'true', formatter: "dateFormatter"
});
columns_table.push({
    title: '是否删除', field: 'is_del', align: 'center', class: 'hidden-480',
    shown: true, type: 'select', option: getIsDel(), required: true, formatter: "isDelFormatter"
});
columns_table.push({title: '操作', align: 'center', class: "action1", formatter: "operateFormatter"});
var vform;
var $table;
var base_data_type;
var mod_id;
$(function () {
    var tableTmp = $("#data-table");
    base_data_type = tableTmp.data("type");
    mod_id = tableTmp.data("mod-id");
    $table = initTable(columns_table, "?method=listAjax&type=" + base_data_type, "data-table", 25);
    $table.on("load-success.bs.table", function (row, event) {
        $('[data-toggle="tooltip"]').tooltip()
    });
    vform = $('#validation-form').validate({
        errorElement: 'div',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {
            type_name: {required: true},
            type_url: {required: true}
        },
        messages: {
            type_name: {required: "请填写名称"},
            type_url: {required: "请填写URL"}
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

function getIsDel() {
    var options = [];
    $("#is_del option").each(function () {
        options.push({"value": $(this).val(), "name": $(this).text()})
    });
    return options;
}


function operateFormatter(value, row, index) {
    var html = '<div class="hidden-sm hidden-xs btn-group">';
    html += '<button type="button" class="btn btn-success btn-xs" data-toggle="modal" onclick="toEdit(\'' + index + '\')">' +
        '<i class="ace-icon fa fa-pencil"></i>&nbsp;修改</button>&nbsp;&nbsp;';
    html += '<button type="button" class="btn btn-danger btn-xs" data-toggle="modal" onclick="toDelete(\'' + row.id + '\')">' +
        '<i class="ace-icon fa fa-trash-o"></i>&nbsp;删除</button>&nbsp;&nbsp;';
    html += "</div>";
    html += '<div class="hidden-md hidden-lg"> <div class="inline pos-rel"> <button class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown" data-position="auto"> <i class="ace-icon fa fa-cog icon-only bigger-110"></i> </button> <ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close">'
    html += '<li> <a href="#" onclick="toEdit(\'' + index + '\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-pencil"></i> 修改</span> </a> </li>'
    html += '<li> <a href="#" onclick="toDelete(\'' + row.id + '\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-trash-o"></i> 删除</span> </a> </li>'
    html += '</ul></div></div>';
    return html;
}

function remarkFormatter(value, row, index) {
    if (row.type == 100) {
        var html = '<div class="hidden-sm hidden-xs btn-group">';
        html += '<button type="button" class="btn btn-purple btn-xs" data-toggle="modal" onclick="genIndexHtml(\'' + row.id + '\')">' +
            '<i class="ace-icon fa fa-home"></i>&nbsp;首页静态化</button>&nbsp;&nbsp;';
        html += '<button type="button" class="btn btn-success btn-xs" data-toggle="modal" onclick="openLink(\'' + index + '\',\'config\')">' +
            '<i class="ace-icon fa fa-fire"></i>&nbsp;网站配置</button>&nbsp;&nbsp;';
        html += '<button type="button" class="btn btn-xs" data-toggle="modal" onclick="initWebSiteInfo(\'' + row.id + '\')">' +
            '<i class="ace-icon fa fa-bars"></i>&nbsp;初始化节点</button>&nbsp;&nbsp;';
        html += '<button type="button" class="btn btn-warning btn-xs" data-toggle="modal" onclick="openLink(\'' + index + '\',\'ads\')">' +
            '<i class="ace-icon fa fa-check"></i>&nbsp;广告配置</button>&nbsp;&nbsp;';
        html += "</div>";

        html += '<div class="hidden-sm hidden-xs btn-group" style="margin-top: 5px">';
        html += '<button type="button" class="btn btn-purple btn-xs" data-toggle="modal" onclick="openLink(\'' + index + '\',\'cls\')">' +
            '<i class="ace-icon fa fa-list"></i>&nbsp;类别管理</button>&nbsp;&nbsp;';
        html += '<button type="button" class="btn btn-success btn-xs" data-toggle="modal" onclick="openLink(\'' + index + '\',\'link\')">' +
            '<i class="ace-icon fa fa-link"></i>&nbsp;友情链接</button>&nbsp;&nbsp;';
        html += '<button type="button" class="btn btn-xs" data-toggle="modal" onclick="openLink(\'' + index + '\',\'scroll\')">' +
            '<i class="ace-icon fa fa-picture-o"></i>&nbsp;首页轮播图</button>&nbsp;&nbsp;';
        html += '<button type="button" class="btn btn-warning btn-xs" data-toggle="modal" onclick="genSiteMapAll(\'' + row.id + '\')">' +
            '<i class="ace-icon fa fa-sitemap"></i>&nbsp;网站地图</button>&nbsp;&nbsp;';
        html += "</div>";

        html += '<div class="hidden-md hidden-lg"> <div class="inline pos-rel"> <button class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown" data-position="auto"> <i class="ace-icon fa fa-cog icon-only bigger-110"></i> </button> <ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close">'
        html += '<li> <a href="#" onclick="genIndexHtml(\'' + row.id + '\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-home"></i> 首页静态化</span> </a> </li>'
        html += '<li> <a href="#" onclick="openLink(\'' + index + '\',\'config\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-fire"></i> 网站配置</span> </a> </li>'
        html += '<li> <a href="#" onclick="initWebSiteInfo(\'' + row.id + '\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-bars"></i> 初始化节点</span> </a> </li>'
        html += '<li> <a href="#" onclick="openLink(\'' + index + '\',\'ads\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-check"></i> 网站配置</span> </a> </li>'

        html += '<li> <a href="#" onclick="openLink(\'' + index + '\',\'cls\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-list"></i> 类别管理</span> </a> </li>'
        html += '<li> <a href="#" onclick="openLink(\'' + index + '\',\'link\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-link"></i> 友情链接</span> </a> </li>'
        html += '<li> <a href="#" onclick="openLink(\'' + index + '\',\'scroll\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-picture-o"></i> 首页轮播图</span> </a> </li>'
        html += '<li> <a href="#" onclick="genSiteMapAll(\'' + row.id + '\')" class="tooltip-info" data-rel="tooltip"> <span class="blue"> <i class="ace-icon fa fa-sitemap"></i> 网站地图</span> </a> </li>'
        html += '</ul></div></div>';
        return html;
    }
    return "";
}

function dateFormatter(value, row, index) {
    return moment(value).format('YYYY-MM-DD');
}

function nameFormatter(value, row, index) {
    if (row.type == 100) {
        return "<a href='http://" + row.type_url + "' target='_blank'>" + row.type_name + "</a>";
    }
    return row.type_name;
}

function toAdd() {
    debugger
    $.each(columns_table, function (i, columns) {
        if (columns.field === "mod_id") {
            columns.value = mod_id;
        } else if (columns.field === "type") {
            columns.value = base_data_type;
        } else {
            columns.value = "";
        }
    });
    buildForm('container_data_lg', columns_table);
    $("#add_modal").modal({backdrop: true, keyboard: true, show: true});
}

function toEdit(index) {
    var data = $table.bootstrapTable('getData', false)[index];
    $.each(columns_table, function (i, columns) {
        if (columns.shown && typeof columns.field != "undefined") {
            //console.log("columns.field:{}, value:{}", columns.field, data[columns.field])
            columns.value = data[columns.field]
        }
    });
    buildForm('container_data_lg', columns_table);
    $("#add_modal").modal('show');
}

function toDelete(id) {
    myConfirm(function () {
        ajax("?method=delete", {"id": id}, "POST", saveHandle, true, true)
    }, "确定要删除此信息吗？", "删除")
}

function DeleteAll() {
    var ids = getIdSelections($table);
    if (ids && ids.length > 0) {
        myConfirm(function () {
            ajax("?method=delete", {"ids": ids.join(",")}, "POST", saveHandle, true, true)
        }, "确定要删除选中的信息吗？", "删除")
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

function isDelFormatter(value, row, index) {
    if (value == 1) {
        return '<span class="label label-danger">已删除</span>'
    } else {
        return '<span class="label label-success">未删除</span>'
    }
}

function genIndexHtml(website_id) {
    myConfirm(function () {
        ajax("ZhuaQu.do?method=genIndexHtml", {"website_id": website_id}, "POST", genIndexHtmlHandle, true, true)
    }, "确认要静态化首页吗？", "确认")
}

function genSiteMapAll(website_id) {
    myConfirm(function () {
        ajax("ZhuaQu.do?method=genSiteMapAll", {"website_id": website_id}, "POST", genSiteMapAllHandle, true, true)
    }, "确认要生成网站地图吗？", "确认")
}

function initWebSiteInfo(website_id) {
    myConfirm(function () {
        ajax("?method=initWebSiteInfo", {"id": website_id}, "POST", "", true, true)
    }, "确定初始化网站节点吗？", "确认")
}

function genIndexHtmlHandle(data) {
    $("#tip_content").html(data.msg);
    $('#tip_modal').modal('show');
}

function genSiteMapAllHandle(data) {
    $("#tip_content").html(data.msg);
    $('#tip_modal').modal('show');
}

function openLink(index, type) {
    var row = $table.bootstrapTable('getData', false)[index];
    var website_id = row.id;
    var site = JSON.parse(row.remark);
    var url = "", title = site.app_name + " : ";
    if (type === 'link') {
        url = "Link.do?mod_id=" + site.mod_id_link;
        title += "友情链接管理";
    }
    if (type === 'cls') {
        url = "BasePdClass.do?cls_scope=" + site.cls_scope + "&mod_id=" + site.mod_id;
        title += "类别管理";
    }
    if (type === 'scroll') {
        url = "Link.do?mod_id=" + site.mod_id_scroll;
        title += "首页轮播图管理";
    }
    if (type === 'config') {
        url = "ZhuaQu.do?method=edit&website_id=" + website_id;
        title += "网站配置";
    }
    if (type === 'ads') {
        var url = "CsAjax.do?method=gotoConfig&website_id=" + website_id;
        title += "广告配置";
    }
    console.log(site)
    $.jBox("iframe:" + url, {
        title: title,
        top: '10px',
        width: $(window).width() - 50,
        height: $(window).height() - 30,
        buttons: {'关闭': true}
    });
}