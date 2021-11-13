var columns_table = [];
columns_table.push({
    title: '类型', field: 'bi_get_memo', align: 'center', valign: 'middle',
});
columns_table.push({
    title: '操作前金额', field: 'bi_no_before', align: 'center', class: 'hidden-480', formatter: "numFormatter"
});
columns_table.push({
    title: '本次金额', field: 'bi_no', align: 'center', valign: 'middle', formatter: "biFormatter"
});
columns_table.push({
    title: '操作后金额', field: 'bi_no_after', align: 'center', class: 'hidden-480', formatter: "numFormatter"
});
columns_table.push({
    title: '时间', field: 'add_date', align: 'center', valign: 'middle', sortable: 'true', formatter: "dateFormatter"
});
var $table;
$(function () {
    $("#mydianzibi-left").addClass("active");
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
});

function dateFormatter(value, row, index) {
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
}
