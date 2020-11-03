$(function() {
    $(".timer-btn").click(function() {

        // 開始ボタンの処理
        if($(this).attr("id") == "timer-start") {
            // 開始ボタンを押した時の時刻取得
            var Start = new Date();
            StartTime = Start.getTime();
        
            // タイマー表示
            IntervalTimer(StartTime)

            // ボタン変更
            $(this).hide();
            $("#timer-end").show();
        }

        // 停止ボタンの処理
        else {
            // 停止ボタンを押した時の時刻取得
            var End = new Date();
            var EndTime = End.getTime();

            // タイマー表示
            DisplayTimer(EndTime - StartTime);

            // ボタン変更
            $(this).hide();
            $("#timer-start").show();
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
    
            // 停止ボタンの処理
            $("#timer-end").click(() => clearInterval(Timer))
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
