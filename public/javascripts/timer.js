$(function() {
    $(".timer-btn").click(function() {

        // 開始ボタンの処理
        if($(this).attr("id") == "timer-start") {
            // 現在時刻取得
            var Start = new Date();
            var StartTime = Start.getTime();
        
            // タイマー表示
            const Timer = setInterval(function() {
                var Process = new Date();
                var ElapsedTime = Process.getTime() - StartTime;
                console.log(ElapsedTime);
                $("#timer-end").click(clearInterval(Timer))
            }, 1000);

            // ボタン変更
            $(this).hide();
            $("#timer-end").show();
        }
        
        // 停止ボタンの処理
        else {
            // ボタン変更
            $(this).hide();
            $("#timer-start").show();

        }
    });
});
