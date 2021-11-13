var loginForm = $(".login-form");
var valid;
$(document).ready(function () {
    $("#veri_code").focus(function () {
        $("#veri_img").attr("src", "/images/VerificationCode.jpg?t=" + new Date().getTime()).attr({"height": 28}).show();
    }).blur(function () {
        $("#veri_img").hide().attr("src", "/images/loading_login.gif").removeAttr("width").removeAttr("height");
    });

    valid = loginForm.validate({
        rules: {
            verificationCode: {required: true},
            veri_email: {required: true},
            password: {required: true, minlength: 6},
            confirm_password: {required: true, minlength: 5, equalTo: "#password"},
            email: {required: true, email: true}
        },
        messages: {
            email: {required: "请填写email", email: "请输入一个正确的邮箱"},
            verificationCode: {required: "请输入验证码"},
            veri_email: {required: "请输入邮箱验证码"},
            password: {required: "请输入密码", minlength: "密码长度不能小于 6 个字符"},
            confirm_password: {required: "请输入密码", minlength: "密码长度不能小于 6 个字符", equalTo: "两次密码输入不一致"},
        }
    });

});

function AjaxRequest() {
    if (valid.form()) { //判断校验是否符合规则
        $.ajax({
            type: "POST",
            url: "/reg.html?method=reg",
            data: loginForm.serialize(),
            dataType: "json",
            error: function (request, settings) {
                alert("出错");
            },
            success: function (data) {
                if (data.code === "1") {
                    popTip(data.msg)
                    window.setTimeout(function () {
                        location.href = "/manager/customer/index.html";
                    }, 2000);

                } else {
                    popTip(data.msg)
                }
            }
        });
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