$(document).ready(function () {
    $(".mana-text").eq(0).text(time_dialogue());
    $(".mana-text").eq(1).text(random_dialogue())
});

function time_dialogue() {
    var currentTime = new Date().getHours()
    if (5 <= currentTime && currentTime <= 10) {
        return "おはよう！今日も一日頑張ろう！";
    } else if (11 <= currentTime && currentTime <= 20) {
        return "こんにちは！今日も練習頑張ってね！";
    } else {
        return "練習お疲れ様！明日の練習も頑張れ！";
    }
}

function random_dialogue() {
    var rand_num = Math.random() * 3;
    console.log(rand_num)
    if (0 <= rand_num && rand_num < 1) {
        return "今日の調子はどう？";
    } else if (1 <= rand_num && rand_num < 2) {
        return "ストレッチも欠かさずにね！";
    } else {
        return "次の大会で自己新記録出せるといいね！";
    }
}
