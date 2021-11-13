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
var first = true;
var vform;
$(function () {
    $("#chongzhi-left").addClass("active");
    $("#myTab a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        var tagId = $(this).attr("href");
        if (tagId.indexOf("record") !== -1) {
            if (first) {
                console.log("init table...");
                $table = initTable(columns_table, "?method=listAjax");
                first = false;
            }
        }
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

    $("#check-money span").click(function () {
        var $this = $(this);
        $this.siblings().removeClass("btn-danger");
        $this.addClass("btn-danger")
        var money = $this.data("money");
        $("#cash_count").val(money);
    })

    vform = $('#validation-form').validate({
        errorElement: 'div',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        debug: true,
        rules: {
            other_money: {required: true, digits: true},
        },
        messages: {
            other_money: {required: "请填写充值金额", digits: "请正确填写充值金额"},
        },
        highlight: function (e) {
            $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
        },
        success: function (e) {
            $(e).closest('.form-group').removeClass('has-error');
            $(e).remove();
        }
    });

});

function saveHandle(data) {
    if (data.code == 1) {
        $("#pay_modal").modal('show');
        var payData = data.datas;
        $("#img").attr("src", payData.img);
        $("#oid").val(payData.oid);
        $("#fee").text(payData.fee);
        startCheck();
    }
}

function submitForm() {
    if (vform.form()) {
        ajax("?method=chongzhi", "validation-form", "POST", saveHandle, true, true)
    }
}

function dateFormatter(value, row, index) {
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
}

function xxx() {
    var mony = $("#other_money").val();
    console.log(mony)
    if (mony == "") {
        $("#cash_count").val(100);
        $("#check-money span").each(function () {
            var $this = $(this);
            if ($this.data("money") == 100) {
                $this.addClass("btn-danger");
            } else {
                $this.removeClass("btn-danger");
            }
        });
    } else if (isNaN(mony)) {
        $("#other_money").val('');
    } else {
        $("#cash_count").val(parseInt(mony));
        $("#check-money span").each(function () {
            $(this).removeClass("btn-danger");
        });
    }
}

var Timer = document.getElementById("time");
var m = 5, s = 0;

function startCheck() {
    erphpOrder = setInterval(function () {
        $.ajax({
            type: "GET",
            data: "orderId=" + $("#oid").val(),
            dataType: "json",
            url: "?method=check",
            success: function (a) {
                if (a.code == 1) {
                    clearInterval(erphpOrder);
                    popTip(a.msg);
                    setTimeout(function () {
                        location.href = "cart.html";
                    }, 2000)

                } else if (a.code == -1) {
                    clearInterval(erphpOrder);
                    popTip(a.msg);
                }
            },
            error: function () {
            }
        });
    }, 5000);
    erphpTimer = setInterval(function () {
        wppayCountdown()
    }, 1000);
}

function wppayCountdown() {
    Timer.innerHTML = "支付倒计时：<span>0" + m + "分" + s + "秒</span>";
    if (m == 0 && s == 0) {
        clearInterval(erphpOrder);
        clearInterval(erphpTimer);
        $(".qr-code").append('<div class="expired"></div>');
        m = 4;
        s = 59;
    } else if (m >= 0) {
        if (s > 0) {
            s--;
        } else if (s == 0) {
            m--;
            s = 59;
        }
    }
}