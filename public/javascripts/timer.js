$("#timer-btn").click(function() {
    if($(this).hasClass("timer-start")) {
        $(this).addClass("timer-stop");
        $(this).removeClass("timer-start");
        $(this).text("停止");
        console.log("aaaaa");
    } else {
        $(this).addClass("timer-start");
        $(this).removeClass("timer-stop");
        $(this).text("開始");
    }
});