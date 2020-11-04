// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDyvg2XGshl7PjbuRegWiIF2TelusS_jWg",
    authDomain: "c2011-webapp.firebaseapp.com",
    databaseURL: "https://c2011-webapp.firebaseio.com",
    projectId: "c2011-webapp",
    storageBucket: "c2011-webapp.appspot.com",
    messagingSenderId: "1006358141829",
    appId: "1:1006358141829:web:3a597f1a2990b68d1d82ec"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const ref = database.ref('timer_management');


$(function () {
    /////////// スタート処理 ///////////
    function TimerStartFunction(timing) {
        // 登録処理
        push_DB(state = "start", time = timing);
        // タイマー表示
        IntervalTimer(timing)
        // ボタン変更
        $("#timer-start").hide();
        $("#timer-stop").show();
        $("#timer-split").show();
    };

    // スタートボタンを押した時の処理
    $("#timer-start").click(function () {
        StartTime = new Date().getTime();
        TimerStartFunction(StartTime);
    });


    /////////// ストップ処理 ///////////
    function TimerStopFunction(timing) {
        // 登録処理
        delete_DB();
        push_DB(state = "stop", time = StartTime);
        // タイマー表示
        DisplayTimer(timing);
        // ボタン変更
        $("#timer-stop").hide();
        $("#timer-split").hide();
        $("#timer-restart").show();
        $("#timer-reset").show();
    };

    // ストップボタンを押した時の処理
    $("#timer-stop").click(function () {
        OffsetTime = new Date().getTime() - StartTime;
        TimerStopFunction(OffsetTime);
    });


    /////////// スプリット処理　///////////
    function TimerSplitFunction(SplitTime) {
        // スプリットタイム
        var SplitTime_ = String(Math.floor(SplitTime / 10000000) % 10) + ":"
            + String(ZeroPadding(Math.floor(SplitTime / 100000) % 100)) + ":"
            + String(ZeroPadding(Math.floor(SplitTime / 1000) % 100)) + "."
            + String(ZeroPadding(Math.floor(SplitTime / 10) % 100));
        // ログに追加
        $("#timer-log").append("<div class='SplitTime'>" + SplitTime_ + "</div>");
    };

    // スプリットボタンを押した時の時刻取得
    $("#timer-split").click(function () {
        var SplitTime = new Date().getTime() - StartTime;
        TimerSplitFunction(SplitTime)
    });


    /////////// リスタート処理　///////////
    function TimerRestartFunction(timing) {
        // 登録処理
        delete_DB();
        push_DB(state = "start", time = timing);
        // タイマー表示
        IntervalTimer(timing);
        // ボタン変更
        $("#timer-restart").hide();
        $("#timer-reset").hide();
        $("#timer-split").show();
        $("#timer-stop").show();
    };

    // リスタートボタンを押した時の処理
    $("#timer-restart").click(function () {
        StartTime = new Date().getTime() - OffsetTime;
        TimerRestartFunction(StartTime);
    })


    /////////// リセット処理 ///////////
    function TimerResetFunction() {
        // タイマー表示
        DisplayTimer(0);
        // ログの消去
        $("#timer-log").html("");
        // データベースから削除
        delete_DB();
        // ボタン変更
        $("#timer-reset").hide();
        $("#timer-restart").hide();
        $("#timer-start").show();
    }

    // リセットボタンを押した時の処理
    $("#timer-reset").click(function () {
        TimerResetFunction();
    });


    /////////// 同期処理 ///////////
    $(".timer-sync").click(function() {
        var timing = $(this).parent().attr("div").text();
        TimerStartFunction(timing);
    });


    // タイマー表示関数(43msごとに処理してます。43はテキトーに素数当てはめてます)
    function IntervalTimer(StartTime) {
        const Timer = setInterval(function () {
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
    function ZeroPadding(num) {
        return ('00' + num).slice(-2);
    }

    // データベース登録
    const push_DB = (state, time) => {
        ref.push({
            state: state,
            start: time
        });
    };

    // データベースの削除
    const delete_DB = () => {
        const id = $("#StartTime-log").find("div").attr("id");
        firebase.database().ref('timer_management/' + id).remove();
    };

    // TODOを表示する
    const dispTodo = (time) => {
        if (time.value.state == "start") {
            const todo_html = time.value.start;
            $("#StartTime-log").append(`
                <div id="${time.id}">${todo_html}<button class="timer-sync">同期</button></div>
            `);
        }
    }

    // データベースが追加された時の処理
    ref.on("child_added", (item) => {
        dispTodo({
            id: item.key,
            value: item.val()
        });
    });

    // データベースが削除された時の処理
    ref.on("child_removed", (item) => {
        $("#" + item.key).remove();
    });

});