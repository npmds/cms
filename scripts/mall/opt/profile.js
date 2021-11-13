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
var first = true;
var vform;
var vform_email;
$(function () {
    $("#profile-left").addClass("active");
    $("#veri_code").focus(function () {
        $("#veri_img").attr("src", "/images/VerificationCode.jpg?t=" + new Date().getTime()).attr({"height": 28}).show();
    }).blur(function () {
        $("#veri_img").hide().attr("src", "/images/loading_login.gif").removeAttr("width").removeAttr("height");
    });


    vform = $('#validation-form').validate({
        errorElement: 'div',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        debug: true,
        rules: {
            password_old: {required: true, minlength: 6},
            password: {required: true, minlength: 6},
            confirm_password: {required: true, minlength: 5, equalTo: "#password"},
        },
        messages: {
            password_old: {required: "请输入旧密码", minlength: "密码长度不能小于 6 个字符"},
            password: {required: "请输入新密码", minlength: "密码长度不能小于 6 个字符"},
            confirm_password: {required: "请输入确认密码", minlength: "密码长度不能小于 6 个字符", equalTo: "两次密码输入不一致"},
        },
        highlight: function (e) {
            $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
        },
        success: function (e) {
            $(e).closest('.form-group').removeClass('has-error');//.addClass('has-info');
            $(e).remove();
        }
    });

    vform_email = $('#validation-form-email').validate({
        errorElement: 'div',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        debug: true,
        rules: {
            email: {required: true},
            verificationCode: {required: true},
        },
        messages: {
            email: {required: "请填写email", email: "请输入一个正确的邮箱"},
            verificationCode: {required: "请输入验证码"}
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

function changeEmailHandle(data) {
    if (data.code == 1) {
        $("#email_cur").val($('#email').val());
        $("#add_modal").modal('hide');
    }
}

function toChangeEmail() {
    $('#email').val("")
    $("#add_modal").modal('show');
}

function changePassword() {
    if (vform.form()) {
        ajax("?method=changePassword", "validation-form", "POST", null, true, true)
    }
}

function submitForm() {
    if (vform_email.form()) {
        ajax("?method=changeEmail", "validation-form-email", "POST", changeEmailHandle, true, true)
    }
}


var state = 0;

function getMessage(mobile) {
    var reg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if ("" == mobile) {
        popTip("请先输入邮箱！");
        $("#email").focus();
        return false;
    }
    if (!mobile.match(reg)) {
        popTip("邮箱格式不正确！");
        $("#email").focus();
        return false;
    }
    if ("" == $("#veri_code").val()) {
        popTip('请先验证码！');
        $("#veri_code").focus();
        return false;
    }

    if (state == 0) {
        state = "1";
        i = 120;
        $("#sendMobileCode").html("发送中...");
        $("#sendMobileCode").removeAttr("onclick");
        $("#btn_submit").attr("disabled", "true");
        $.post("/reg.html?method=sendMobileMessage", {"mobile": mobile, "veri_code": $("#veri_code").val(), "isValMobile": "true"}, function (datas) {
            state = "0";
            if (datas.code == 1) {
                popTip("邮件发送成功！！如收不到邮件：请留意垃圾箱", 5);
                clock();
                $("#btn_submit").removeAttr("disabled");
            } else {
                popTip(datas.msg);
                enabledSend();
                $("#btn_submit").attr("disabled", "true");
            }
        })
    }
}

function enabledSend() {
    $("#sendMobileCode").html("获取验证码");
    $("#sendMobileCode").attr("onclick", "getMessage($('#email').val());");
}

function clock() {
    i--;
    $("#sendMobileCode").html(i + "秒后获取");
    if (i > 0) {
        setTimeout("clock();", 1000);
    } else {
        state = "0";
        enabledSend();
        $("#email").removeAttr("readonly");
    }
}
