var columns_table = [];
columns_table.push({
    field: 'state', checkbox: true, align: 'center'
});
columns_table.push({
    title: 'ID', field: 'id', visible: false,
    shown: true, type: 'input', child_type: 'hidden'
});
columns_table.push({
    title: '标题', field: 'title', align: 'center', formatter: "nameFormatter",
    shown: true, type: 'input', child_type: 'text', required: true, maxlength: 128
});
columns_table.push({
    title: '外链', field: 'direct_uri', visible: false,
    shown: true, type: 'input', child_type: 'text', maxlength: 128
});
columns_table.push({
    title: '图片', field: 'image_path_out', align: 'center', class: 'hidden-480', formatter: "picFormatter",
    shown: true, type: 'input', child_type: 'text', required: true, maxlength: 128
});
columns_table.push({
    title: '有效时间', field: 'is_use_invalid_date', visible: false,
    shown: true, type: 'select', option: getSelect('is_use_invalid_date'), event: 'onChange', eventAction: 'onSelect', required: true
});
columns_table.push({
    title: '广告位置', field: 'is_top', visible: false,
    shown: true, type: 'select', option: getSelect('is_top'), required: true
});
columns_table.push({
    title: '添加时间', field: 'add_time', align: 'center', class: 'hidden-480', sortable: 'true', formatter: "dateFormatter"
});
columns_table.push({
    title: '失效时间', field: 'invalid_date', align: 'center', sortable: 'true', formatter: "dateFormatter1",
    shown: true, type: 'date', required: true
});
columns_table.push({
    title: '排序值', field: 'order_value', align: 'center', sortable: 'true', class: 'hidden-480',
    shown: true, type: 'input', child_type: 'text', required: true, maxlength: 4
});
columns_table.push({
    title: '是否删除', field: 'is_del', align: 'center', class: 'hidden-480',
    shown: true, type: 'select', option: getSelect("is_del"), required: true, formatter: "isDelFormatter"
});
columns_table.push({title: '操作', align: 'center', class: "action1", formatter: "operateFormatter"});
var vform;
var $table;
$(function () {
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

    var tableTmp = $("#data-table");
    var type = tableTmp.data("type");
    var mod_id = tableTmp.data("mod-id");
    $table = initTable(columns_table, "?method=listAjax&type=" + type + "&mod_id=" + mod_id);
    $table.on("load-success.bs.table", function (row, event) {
        $('[data-toggle="tooltip"]').tooltip()
    });
    vform = $('#validation-form').validate({
        errorElement: 'div',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {
            title: {required: true},
            direct_uri: {required: true, url: true},
            image_path_out: {required: false, url: true},
        },
        messages: {
            title: {required: "请填写标题"},
            direct_uri: {required: "请填写链接", url: "请正确填写,需包含http或者https"},
            image_path_out: {required: "请填写图片URL", url: "请正确填写,需包含http或者https"},
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

function getSelect(id) {
    var options = [];
    $("#" + id + " option").each(function () {
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

function dateFormatter(value, row, index) {
    return moment(value).format('YYYY-MM-DD');
}

function dateFormatter1(value, row, index) {
    if (value && value != "") {
        var cur_date = moment(value);
        var end_date = moment();
        var diff = cur_date.diff(end_date);
        if (diff > 0) {
            return '<span class="label label-success">' + moment(value).format('YYYY-MM-DD') + '</span>'
        } else {
            return '<span class="label label-danger">' + moment(value).format('YYYY-MM-DD') + '</span>'
        }
    }
    return ""
}

function nameFormatter(value, row, index) {
    var href = "<a href='http://" + row.direct_uri + "' target='_blank'>" + row.direct_uri + "</a>";
    return row.title + '(' + href + ")";
}

function picFormatter(value, row, index) {
    if (row.image_path_out != '') {
        return '<img src="' + row.image_path_out + '" alt="" height="30" />'
    }
    return "";
}

function toAdd() {
    buildForm('container_data', columns_table);
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
    buildForm('container_data', columns_table);
    $("#add_modal").modal('show');
}

function toDelete(id) {
    myConfirm(function () {
        ajax("?method=delete", {"id": id}, "POST", saveHandle, true, true)
    }, "确定要删除此信息吗？", "删除")
}

function refreshAdsCache() {
    myConfirm(function () {
        ajax("?method=refreshAdsCache", {}, "POST", "", true, true)
    }, "确定更新广告缓存吗？")
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

function onSelect(obj) {
    var $this = $(obj);
    var $date = $("input[name='invalid_date']");
    console.log($this.val());
    if ($this.val() == 0) {
        $date.rules("remove");
    } else {
        $date.rules("add", {required: true, messages: {required: "请填写失效日期"}});
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