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
    $("#timer-start").click(function () {
        // スタートボタンを押した時の時刻取得
        var StartDate = new Date();
        StartTime = StartDate.getTime();

        // 登録処理
        const postAction = () => {
            const start = $("#startTime_rec").val(StartTime);
            ref.push({
                start: StartTime
            });
        };
        postAction();
        // TODOを表示する
        const dispTodo = (time) => {
            // TODO内容をリストの一番上に挿入
            const todo_html = time.value.start;
            $("#StartTime-log").append(`<div id="${time.id}">${todo_html}<button class="done">DONE</button></div>`);
        }
        // 初期表示と登録後のコールバック
        ref.on("child_added", (item) => {
            dispTodo({
                id: item.key,
                value: item.val()
            });
        });

        // 削除処理
        $(document).on('click', '.done', (event) => {
            const id = $(event.target).closest('div').attr('id');
            console.log(id)
            firebase.database().ref('timer_management/' + id).remove();
        });
        // 削除
        ref.on("child_removed", (snapshot) => {
            $("#" + snapshot.key).remove();
        });


        // タイマー表示
        IntervalTimer(StartTime)

        // ボタン変更
        $(this).hide();
        $("#timer-stop").show();
        $("#timer-split").show();
    })


    $("#timer-stop").click(function () {
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
    })


    $("#timer-split").click(function () {
        // スプリットボタンを押した時の時刻取得
        var SplitDate = new Date();
        var SplitTime = SplitDate.getTime() - StartTime;
        var SplitTime_ = String(Math.floor(SplitTime / 10000000) % 10) + ":"
            + String(ZeroPadding(Math.floor(SplitTime / 100000) % 100)) + ":"
            + String(ZeroPadding(Math.floor(SplitTime / 1000) % 100)) + "."
            + String(ZeroPadding(Math.floor(SplitTime / 10) % 100))

        // ログに追加
        $("#timer-log").append("<div class='SplitTime'>" + SplitTime_ + "</div>");
    })


    $("#timer-restart").click(function () {
        // オフセットを考慮したリスタートボタンを押した時刻取得
        var StartDate = new Date();
        StartTime = StartDate.getTime() - OffsetTime;

        // タイマー表示
        IntervalTimer(StartTime);

        // ボタン変更
        $(this).hide();
        $("#timer-reset").hide();
        $("#timer-split").show();
        $("#timer-stop").show();
    })

    
    $("#timer-reset").click(function () {
        // タイマー表示
        DisplayTimer(0);

        // ログの消去
        $("#timer-log").html("");

        // ボタン変更
        $(this).hide();
        $("#timer-restart").hide();
        $("#timer-start").show();
    })


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

});
