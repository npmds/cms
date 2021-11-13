var columns_table = [];
columns_table.push({
    title: 'Zoom进会编号', field: 'order_num', align: 'center', valign: 'middle', sortable: 'true'
});
columns_table.push({
    title: '姓名', field: 'rel_name', align: 'left', valign: 'middle', class: "w80"
});
columns_table.push({
    title: '邮箱', field: 'fahuo_remark', align: 'left', valign: 'middle'
});
columns_table.push({
    title: '电话', field: 'rel_addr', align: 'left', valign: 'middle'
});
columns_table.push({
    title: '费用类型', field: 'pd_name', align: 'left', valign: 'middle', sortable: 'true', class: "w120"
});

columns_table.push({
    title: '费用', field: 'order_money', align: 'center', valign: 'middle', formatter: "numFormatter"
});

columns_table.push({
    title: '下单时间', field: 'add_date', align: 'center', valign: 'middle', sortable: 'true', formatter: "dateFormatter", class: "w180"
});
var $table;
$(function () {
    var pd_id = $("#data-table").data("pd_id");
    $table = initTable(columns_table, "?method=listAjax&pd_id=" + pd_id);
    $table.on("load-success.bs.table", function (row, event) {
        $('[data-toggle="tooltip"]').tooltip()
    });
});

function dateFormatter(value, row, index) {
    var end_date = "";
    var pay_date = "";
    if (row.order_type == 100 && row.pay_date) {
        pay_date = "<p class='text-success' data-toggle=\"tooltip\" data-placement=\"top\" title=\"付款时间\">" + moment(row.pay_date).format('YYYY-MM-DD HH:mm:ss') + "</p>";
    }
    return "<p data-toggle=\"tooltip\" data-placement=\"top\" title=\"下单时间\">" + moment(value).format('YYYY-MM-DD HH:mm:ss') + "</p>" + end_date + pay_date;
}