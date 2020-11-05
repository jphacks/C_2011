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
        push_DB(timing);
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
        // タイマー表示
        if (typeof Timer !== 'undefined') {
            clearInterval(Timer);
        };
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
        var temp = getElapsedTime(SplitTime)
        var SplitTime_ = String(temp.hour) + ":"
            + String(ZeroPadding(temp.minute)) + ":"
            + String(ZeroPadding(temp.second)) + "."
            + String(ZeroPadding(temp.millisecond));
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
        push_DB(timing);
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
    // 同期ボタンを押した時の処理
    $(document).on("click", ".timer-sync", function () {
        // 時間取得
        StartTime = $(this).parent().find(".starttime_temp").text();//////////////変更予定
        DB_id = $(this).parent().attr("id");//////////////////////////変更予定
        // タイマー表示
        if (typeof Timer !== 'undefined') {
            clearInterval(Timer);
        };
        IntervalTimer(StartTime);
        // ボタン変更
        $("#timer-start").hide();
        $("#timer-reset").hide();
        $("#timer-restart").hide();
        $("#timer-stop").show();
        $("#timer-split").show();
    });

    // 同期消去ボタンを押した時の処理
    $(document).on("click", ".sync-reset", function () {
        var ResetTime = $(this).text();
        delete_DB()
    });


    /////////// データベース関連の関数 ///////////
    // データベース登録
    const push_DB = (time) => {
        name_ = $("#UserName-box").val();
        ref.push({
            start: time,
            UserName : name_
        });
    };

    // データベースの削除
    const delete_DB = () => {
        firebase.database().ref('timer_management/' + DB_id).remove();
    };

    // TODOを表示する
    const dispTodo = (time) => {
        DB_id = time.id
        $("#StartTime-log").append(
            `<div id="${time.id}">
                <div class="starttime_temp">${time.value.start}</div>
                <div>${time.value.UserName}</div>
                <button class="timer-sync">同期</button>
                <button class="sync-reset">消去</button>
            </div>`
        );
    }

    // データベースが追加された時の処理
    ref.on("child_added", (item) => {
        dispTodo({
            id: item.key,
            value: item.val()
        });
        //firebase.database().ref('timer_management/' + item.key).once("value", (aaa) => console.log(aaa.val().start))
    });

    // データベースが削除された時の処理
    ref.on("child_removed", (item) => {
        $("#" + item.key).remove();
    });


    /////////// その他の関数 ///////////
    // タイマー表示関数(43msごとに処理してます。43はテキトーに素数当てはめてます)
    function IntervalTimer(StartTime) {
        Timer = setInterval(function () {
            // 経過時間取得
            var Process = new Date();
            var ElapsedTime = Process.getTime() - StartTime;
            // ディスプレイ表示
            DisplayTimer(ElapsedTime);
        }, 43);
    }

    // タイマーのディスプレイ表示
    function DisplayTimer(ElapsedTime) {
        var temp = getElapsedTime(ElapsedTime);
        $(".milliseconds").text(ZeroPadding(temp.millisecond));
        $(".seconds").text(ZeroPadding(temp.second));
        $(".minutes").text(ZeroPadding(temp.minute));
        $(".hours").text(temp.hour);
    }

    // msから時間に変更
    function getElapsedTime(ElapsedTime) {
        var TimeConstructor = new Date(ElapsedTime);
        var TimeObject = {
            hour: TimeConstructor.getHours() - 9,
            minute: TimeConstructor.getMinutes(),
            second: TimeConstructor.getSeconds(),
            millisecond: Math.floor(TimeConstructor.getMilliseconds() / 10)
        }
        return TimeObject
    }

    // ゼロで桁埋めする関数
    function ZeroPadding(num) {
        return ('00' + num).slice(-2);
    }

});