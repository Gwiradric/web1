document.addEventListener("DOMContentLoaded", initJS);

function initJS() {
    "use strict";

    function createCaptcha() {
        let captcha = [];
        let charArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
        for (let i = 0; i < max_captcha; i++) {
            let random = Math.floor(Math.random() * charArray.length + 1);
            captcha.push(charArray[random]);
        }
        let valueCaptcha = document.getElementById("captcha");
        valueCaptcha.innerHTML = captcha.join("");
        valueCaptcha.value = captcha.join("");
    }

    function checkCaptcha() {
        let genCaptcha = document.getElementById("captcha");
        let result = document.getElementById("captchaResult");
        if (genCaptcha.value == inputCaptcha.value) {
            result.innerHTML = "VALID CAPTCHA";
        }
        else {
            result.innerHTML = "INVALID CAPTCHA";
            document.getElementById("form").reset();
            createCaptcha();
        }
    }

    const max_captcha = 5;

    createCaptcha();

    let inputCaptcha = document.getElementById("captchaInput");
    inputCaptcha.addEventListener("change", checkCaptcha);
}

