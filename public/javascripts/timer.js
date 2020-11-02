$("#timer-btn").click(function() {

    // 開始ボタンの時の処理
    if($(this).hasClass("timer-start")) {
        // 現在時刻取得
        var date = new Date()
        console.log(date.getTime())

        // クラス変更
        $(this).addClass("timer-stop");
        $(this).removeClass("timer-start");
        $(this).text("停止");
    } 

    // 停止ボタンの時の処理
    else {
        // クラス変更
        $(this).addClass("timer-start");
        $(this).removeClass("timer-stop");
        $(this).text("開始");
    }
});