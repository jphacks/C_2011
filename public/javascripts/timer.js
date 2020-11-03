$(function() {
    $(".timer-btn").click(function() {
        switch ($(this).attr("id")) {

            // スタート処理
            case "timer-start":
                // スタートボタンを押した時の時刻取得
                var StartDate = new Date();
                StartTime = StartDate.getTime();
                
                // form value属性を変更
                //$("#startTime_rec").attr("value", StartTime)
        
                // タイマー表示
                IntervalTimer(StartTime)

                // ボタン変更
                $(this).hide();
                $("#timer-stop").show();
                $("#timer-split").show();
                break;

            // ストップ処理
            case "timer-stop":
                // ストップボタンを押した時の時刻取得
                var StopDate = new Date();
                OffsetTime = StopDate.getTime() - StartTime

                // タイマー表示
                DisplayTimer(OffsetTime);

                // ボタン変更
                $(this).hide();
                $("#timer-split").hide();
                $("#timer-restart").show();
                $("#timer-reset").show();
                break;

            // スプリット処理
            case "timer-split":
                // スプリットボタンを押した時の時刻取得
                var SplitDate = new Date();
                var SplitTime = SplitDate.getTime() - StartTime;
                var SplitTime_ = String(Math.floor(SplitTime / 10000000) % 10) + ":"
                                + String(ZeroPadding(Math.floor(SplitTime / 100000) % 100)) + ":"
                                + String(ZeroPadding(Math.floor(SplitTime / 1000) % 100)) + "."
                                + String(ZeroPadding(Math.floor(SplitTime / 10) % 100))

                // ログに追加
                $("#timer-log").append("<div class='SplitTime'>" + SplitTime_ + "</div>");
                break;

            // リスタート処理
            case "timer-restart":
                // オフセットを考慮したリスタートボタンを押した時刻取得
                var StartDate = new Date();
                StartTime = StartDate.getTime() - OffsetTime;

                // タイマー表示
                IntervalTimer(StartTime);

                // ボタン変更
                $(this).hide();
                $("#timer-split").hide();
                $("#timer-stop").show();
                break;

            // リセット処理
            case "timer-reset":
                // タイマー表示
                DisplayTimer(0);

                // ログの消去
                $("#timer-log").html("");

                // ボタン変更
                $(this).hide();
                $("#timer-restart").hide();
                $("#timer-start").show();
                break;
        }
    });


    // タイマー表示関数(43msごとに処理してます。43はテキトーに素数当てはめてます)
    function IntervalTimer(StartTime) {
        const Timer = setInterval(function() {
            // 経過時間取得
            var Process = new Date();
            var ElapsedTime = Process.getTime() - StartTime;
    
            // ディスプレイ表示
            DisplayTimer(ElapsedTime);
    
            // ストップ処理
            $("#timer-stop").click(() => clearInterval(Timer))
        }, 43);
    }
    
    // タイマーのディスプレイ表示
    function DisplayTimer(ElapsedTime) {
        $(".milliseconds").text(ZeroPadding(Math.floor(ElapsedTime / 10) % 100));
        $(".seconds").text(ZeroPadding(Math.floor(ElapsedTime / 1000) % 100));
        $(".minutes").text(ZeroPadding(Math.floor(ElapsedTime / 100000) % 100));
        $(".hours").text(Math.floor(ElapsedTime / 10000000) % 10);
    }
    
    // ゼロで桁埋めする関数
    function ZeroPadding(num){
        return ('00' + num).slice(-2);
    }
    
});
