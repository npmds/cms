/**
 * Created by ethanwoo on 2017/4/1.
 */
$(document).ready(function () {
    //addActive();
});

function addActive() {
    try {
        var type = window.location.hash.substr(1);
        console.log("type:", type);
        $(".submenu li").removeClass("active");
        if (type) {
            $("#" + type).addClass("active");
        }
    } catch (e) {
        console.log(e)
    }
}

/**
 * Common AJAX Method
 * @param url
 * @param jqueryFrom
 * @param type
 * @param successFunctionName
 * @param showLoading
 * @param async
 * @param completeFunctionName
 * @returns {boolean}
 */
function ajax(url, formIdOrData, type, successFunctionName, showLoading, async) {
    if (url == "" || url == undefined) {
        return false;
    }
    if (type == "" || type == undefined) {
        type = 'POST';
    }
    if (async == undefined) {
        async = true;
    }
    if (showLoading == undefined) {
        showLoading = true;
    }
    var tmpData = formIdOrData;
    if (typeof formIdOrData === "string") {
        tmpData = $("#" + formIdOrData).serialize();
    }
    console.log('ajax parameter=', tmpData);
    $.ajax({
        url: url,
        data: tmpData,
        type: type,
        async: async,
        beforeSend: function () {
            if (showLoading) {
                showLoadingLayer();
            }
        },
        success: function (data, textStatus, jqXHR) {
            console.log("ajax(" + url + ") and the response is: ", data)
            if (showLoading) {
                hideLoadingLayer();
            }
            if (data.code == "1") {
                if (showLoading) {
                    popTip(data.msg)
                }
            } else {
                if (showLoading) {
                    popTip(data.msg)
                }
            }
            if (successFunctionName != undefined && successFunctionName != "") {
                successFunctionName(data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            hideLoadingLayer();
            if (type != 'GET') {
                popTip(textStatus);
            }
        }
    });
}

function showLoadingLayer() {
    if (typeof window.layer != "undefined" && window.layer) {
        layer.open({type: 2});
    }
}

function hideLoadingLayer() {
    if (typeof window.layer != "undefined" && window.layer) {
        layer.closeAll();
    }
}

function popTip(msg, time) {
    if (typeof window.layer != "undefined" && window.layer) {
        var t = 3;
        if (typeof time != "undefined" && time) {
            t = time;
        }
        layer.open({content: msg, skin: 'msg', time: t});
    } else {
        alert(msg);
    }
}

/**
 table_params = {
        "table_id":"process_table",
        "ajax_url":"/wf/process/show_process",
        "is_server":true,
        "search_params":params
        "onLoadSuccessFunc":onLoadSuccess
    }
 * table_id*:The table ID to be paged,required
 * ajax_url*:ajax get data url,required
 * is_server*: true-server paged，false-client paged,required
 * search_params: E.g:{user_name_like:"abc"},not required
 * onLoadSuccessFunc: callback function load success,not required
 */
var pageTable = function (table_params) {
    var table_id = table_params.table_id;
    var ajax_url = table_params.ajax_url;
    var is_server = table_params.is_server;
    var search_params = table_params.search_params;
    var onLoadSuccessFunc = table_params.onLoadSuccessFunc;
    var onPostBody = table_params.onPostBody;
    var showFooter = table_params.showFooter;


    var sidePagination = "client";
    var search = true;
    if (typeof is_server === 'boolean' && is_server) {
        sidePagination = "server";
        search = false;
    }

    pagetable_params = {
        url: ajax_url,
        pagination: true,
        search: search,
        //showColumns: true,  //Show drop-down box Check the columns to be displayed
        // showRefresh: true,
        buttonsClass: "info btn-sm",
        //queryParamsType : "undefined",
        //ajaxOptions: {async : async},
        queryParams: function queryParams(params) {   //set search params
            var param = {
                limit: params.limit,   //Page size, do not have to manually change their own.
                offset: params.offset,  //Page number, do not have to manually change their own.
                order: params.order,  //asc desc
                sort: params.sort,  //Sort the column name
                is_server: is_server
            };
            if (typeof search_params === 'object') {
                param = $.extend(param, search_params)
            }
            return param;
        },
        sidePagination: sidePagination,
        //onLoadSuccess: onLoadSuccessFunc
        //pageNumber: 1,
        //pageSize: 10,
        //pageList: [10, 25, 50, 100],
    }
    if (typeof onLoadSuccessFunc === 'function') {
        pagetable_params = $.extend(pagetable_params, {"onLoadSuccess": onLoadSuccessFunc})
    }
    if (typeof onPostBody === 'function') {
        pagetable_params = $.extend(pagetable_params, {"onPostBody": onPostBody})
    }
    if (typeof showFooter === 'boolean') {
        pagetable_params = $.extend(pagetable_params, {"showFooter": showFooter})
    }
    var exportTypes = table_params.exportTypes;
    var exportDataType = table_params.exportDataType;
    var exportOptions = table_params.exportOptions;
    var columns = table_params.columns;
    if (typeof columns === 'object') {
        pagetable_params = $.extend(pagetable_params, {"columns": columns})
    }
    if (typeof exportDataType === 'string') {
        pagetable_params = $.extend(pagetable_params, {"exportDataType": exportDataType})
    }
    if (typeof exportOptions === 'object') {
        pagetable_params = $.extend(pagetable_params, {"exportOptions": exportOptions})
    }

    var maintainSelected = table_params.maintainSelected;
    if (typeof maintainSelected === 'boolean') {
        pagetable_params = $.extend(pagetable_params, {"maintainSelected": maintainSelected})
    }

    var responseHandler = table_params.responseHandler;
    if (typeof responseHandler === 'function') {
        pagetable_params = $.extend(pagetable_params, {"responseHandler": responseHandler})
    }
    var $table = $("#" + table_id);
    $table.bootstrapTable(pagetable_params);
    return $table;
}

/**
 var table_params = {
    table_id:"process_table",
    is_server:true,
    search_params:params
}

 * desc: click search button to set query params and ajax refresh the table
 * table_id:The table ID to be paged,required
 * is_server*: true or false
 * search_params: E.g:{user_name_like:"abc"},not required
 */
var pageTableSearch = function (table_params) {
    var table_id = table_params.table_id;
    var is_server = table_params.is_server;
    var search_params = table_params.search_params;
    if (typeof search_params != 'object') {
        search_params = {}
    }
    //$("#"+table_id).bootstrapTable('refresh', {query: search_params});
    $("#" + table_id).bootstrapTable("refreshOptions", {
        queryParams: function (params) {
            var param = {
                limit: params.limit,
                offset: params.offset,
                order: params.order,
                sort: params.sort,
                is_server: is_server
            };
            if (typeof search_params === 'object') {
                param = $.extend(param, search_params)
            }
            return param;
        }
    });
}

function initTable(columns_table, url, table_id) {
    var tId = "data-table";
    if (typeof table_id != "undefined") {
        tId = table_id;
    }
    var table_params = {
        table_id: tId,
        ajax_url: url,
        clickToSelect: true,
        is_server: true,
        columns: columns_table
        // onLoadSuccessFunc: onLoadSuccess
    }
    return pageTable(table_params);
}

function initTableSearch(columns_table, url, search_params) {
    var tId = "data-table";
    var table_params = {
        table_id: tId,
        ajax_url: url,
        clickToSelect: true,
        is_server: true,
        columns: columns_table,
        search_params: search_params
        // onLoadSuccessFunc: onLoadSuccess
    }
    return pageTable(table_params);
}

function searchData(table_id) {
    var tId = "data-table";
    if (typeof table_id != "undefined") {
        tId = table_id;
    }
    var params = {}
    var fields = $("#queryForm").serializeArray();
    $.each(fields, function (i, val) {
        if (val.value != "" && val.value != null) {
            params[val.name] = $.trim(val.value)
        }
    });
    var _params = {
        table_id: tId,
        is_server: true,
        search_params: params
    }
    console.log("_params", _params)
    pageTableSearch(_params);
}


/**
 * Build Form Element when page initial.
 * @param containerId: container's ID which form elements in.
 * @param formParameter: what elements you need.
 *
 */
function buildForm(containerId, formParameter) {
    if (formParameter === undefined || formParameter === '' || formParameter.length === 0) {
        return;
    }
    var rowHtml = '<div class="form-group"> ' +
        '<label class="control-label col-xs-12 col-sm-3 no-padding-right">TITLE:</label> ' +
        '<div class="col-xs-12 col-sm-9"> <div class="clearfix">CONTENT</div></div> ' +
        '</div>'

    var html = '';
    var elementHtml = '';

    for (var i = 0; i < formParameter.length; i++) {
        if (formParameter[i].shown !== undefined && formParameter[i].shown) {
            var title = formParameter[i].title;

            // if(formParameter[i].required){
            //     title='<span class="required">*</span> '+formParameter[i].title;
            // }

            var default_value = "";
            console.log(formParameter[i])
            if (typeof formParameter[i].value !== "undefined" && (formParameter[i].value != "" || formParameter[i].value == 0)) {
                default_value = formParameter[i].value;
            }
            var maxlength = '';
            if (formParameter[i].maxlength != undefined) {
                maxlength = ' maxlength="' + formParameter[i].maxlength + '"';
            }
            var readonly = '';
            if (formParameter[i].readonly != undefined && formParameter[i].readonly) {
                readonly = ' readonly="' + formParameter[i].readonly + '"';
            }

            if (formParameter[i].type == 'input') {
                if (formParameter[i].child_type == 'checkbox' || formParameter[i].child_type == 'radio') {
                    var option = '';
                    $.each(formParameter[i].label, function (key, value) {
                        option += '<div><label class="line-height-1 blue"><input type="' + formParameter[i].child_type + '" checked name="' + formParameter[i].field + '" value="' + key + '">&nbsp;' + value + '</label></div>';
                    });
                    elementHtml = option;
                } else {
                    elementHtml = '<input type="' + formParameter[i].child_type + '"' + maxlength + readonly + ' class="form-control" name="' + formParameter[i].field + '" value="' + default_value + '"/>';
                }
            }

            if (formParameter[i].type == 'textarea') {
                elementHtml = '<textarea class="form-control unborder" name="' + formParameter[i].field + '" rows="3">' + default_value + '</textarea>';
            }

            if (formParameter[i].type == 'select') {
                var option = '';
                var class_name = "form-control";
                if (formParameter[i].className != undefined) {
                    class_name = formParameter[i].className;
                }


                if ($.isArray(formParameter[i].option)) {
                    var options = formParameter[i].option;

                    for (var j = 0; j < options.length; j++) {
                        var selected = "";
                        if (options[j].value != "" && default_value == options[j].value) {
                            selected = "selected"
                        }
                        option += '<option value="' + options[j].value + '" ' + selected + '>' + options[j].name + '</option>';
                    }
                }

                var eventFunction = "";
                if (formParameter[i].event != undefined && formParameter[i].event != '') {
                    eventFunction = formParameter[i].event + '=' + formParameter[i].eventAction + '(this); ';
                }
                var multiple = "";
                if (formParameter[i].multiple) {
                    multiple = "multiple";
                }
                elementHtml = '<select class="' + class_name + '" ' + multiple + ' name="' + formParameter[i].field + '" ' + eventFunction + '>' + option + '</select>';
            }

            if (formParameter[i].child_type == 'hidden') {
                html += elementHtml;
            } else {
                html += rowHtml.replace('TITLE', title).replace('CONTENT', elementHtml);
            }
        }
    }

    $('#' + containerId).html(html);
}

function getIdSelections(table) {
    return $.map(table.bootstrapTable('getSelections'), function (row) {
        return row.id
    })
}

/**
 * 自定义的弹出确认框
 * @param callback 回调函数
 * @param heading 标题
 * @param content 内容
 * @param okButtonTxt 确认的btn文案 默认文案 确认
 * @param cancelButtonTxt 取消的btn文案 默认文案 取消
 */
var myConfirm = function (callback, content, okButtonTxt, cancelButtonTxt) {
    var heading = '操作提示';
    content = content || '您确定要操作吗？';
    okButtonTxt = okButtonTxt || '确认';
    cancelButtonTxt = cancelButtonTxt || '取消';
    var okCss = "btn btn-success btn-sm";
    var okIcon = "fa fa-check";
    if (okButtonTxt == '删除') {
        okCss = "btn btn-danger btn-sm";
        okIcon = "fa fa-trash-o";
    }
    var confirmModal = $('<div class="modal fade" id="delete_modal" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> <h4 class="modal-title" id="delModalLabel">' + heading + '</h4> </div> <div class="modal-body">' + content + '</div> <div class="modal-footer"> <button type="button" id="okButton" class="' + okCss + '"><i class="ace-icon ' + okIcon + '"></i>' + okButtonTxt + '</button> <button type="button" class="btn btn-default btn-sm" data-dismiss="modal"><i class="ace-icon fa fa-times"></i>' + cancelButtonTxt + '</button> </div> </div> </div> </div>');
    //点击确认的操作
    confirmModal.find('#okButton').click(function (event) {
        if (typeof callback === 'function') {
            callback();
        }
        confirmModal.modal('hide');
    });
    //显示model框
    confirmModal.modal('show');
}

function numFormatter(value, row, index) {
    return value.toFixed(2)
}

function biFormatter(value, row, index) {
    if (row.bi_chu_or_ru == 1) {
        return '<span class="label label-success">+ ' + value.toFixed(2) + '</span>'
    } else {
        if (row.bi_get_type == -10) {
            var really_bi = (value - row.bi_rate).toFixed(2);
            return '<span class="label label-danger" data-toggle="tooltip" data-placement="right" title="到账金额：' + really_bi + ', 手续费：' + row.bi_rate.toFixed(2) + '">- (' + really_bi + '+' + row.bi_rate.toFixed(2) + ')</span>'
        } else {
            return '<span class="label label-danger">- ' + value.toFixed(2) + '</span>'
        }
    }
}