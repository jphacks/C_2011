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
var timer_state = "stop";


/////////// スタート処理 ///////////
function TimerStartFunction(timing) {
    // 登録処理
    push_DB(timing);
    // タイマー表示
    IntervalTimer(timing);
    // ボタン変更
    $("#timer-start").hide();
    $("#timer-stop").show();
    $("#timer-split").show();
    timer_state = "start";
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
    timer_state = "paused";
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
    timer_state = "start";
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
    // ログ消去
    $("#timer-log").text("")
    // ボタン変更
    $("#timer-reset").hide();
    $("#timer-restart").hide();
    $("#timer-start").show();
    timer_state = "stop";
}

// リセットボタンを押した時の処理
$("#timer-reset").click(function () {
    TimerResetFunction();
});


/////////// 同期処理 ///////////
// 同期ボタンを押した時の処理
$(document).on("click", ".timer-sync", function () {
    // 時間取得
    DB_id = $(this).parent().attr("id");
    firebase.database().ref('timer_management/' + DB_id).once("value", (item) => StartTime = item.val().start)
    // タイマー表示
    if (typeof Timer !== 'undefined') {
        clearInterval(Timer);
    };
    IntervalTimer(StartTime);
    // ログ消去
    $("#timer-log").text("")
    // ボタン変更
    $("#timer-start").hide();
    $("#timer-reset").hide();
    $("#timer-restart").hide();
    $("#timer-stop").show();
    $("#timer-split").show();
    timer_state = "start";
});

// 同期消去ボタンを押した時の処理
$(document).on("click", ".sync-reset", function () {
    DB_id = $(this).parent().attr("id");
    delete_DB()
});


/////////// データベース関連の関数 ///////////
// データベース登録
const push_DB = (time) => {
    var name_ = $("#UserName-box").val();
    if (name_ == "") {
        name_ = "user"
    }
    var today = new Date()
    var currentTime = today.getFullYear() + "/" 
                        + String(today.getMonth() + 1) + "/"
                        + today.getDate() + " " 
                        + ZeroPadding(today.getHours()) + ":" 
                        + ZeroPadding(today.getMinutes()) + ":" 
                        + ZeroPadding(today.getSeconds());
    ref.push({
        start: time,
        date: currentTime,
        UserName: name_
    });
};

// データベースの削除
const delete_DB = () => {
    firebase.database().ref('timer_management/' + DB_id).remove();
};

// データベースに追加された時に挿入するhtmlコードÏ
const htmlInsert = (time) => {
    DB_id = time.id
    $("#DB-log").append(
        `<div id="${time.id}" class="DB-log-one">
                <div>User &thinsp; : &thinsp; ${time.value.UserName}</div>
                <div>Date &thinsp; : &thinsp; ${time.value.date}</div>
                <button class="timer-sync">同期</button>
                <button class="sync-reset">消去</button>
            </div>`
    );
}

// データベースが追加された時の処理
ref.on("child_added", (item) => {
    htmlInsert({
        id: item.key,
        value: item.val()
    });
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
