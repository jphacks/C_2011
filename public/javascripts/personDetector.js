//カメラの一覧取得
const cameraDeviceIds = [/* { deviceId, label } */];
const cameraOptions = document.getElementById("video-options");
navigator.mediaDevices.enumerateDevices().then(function (mediaDevices) {
    for (let len = mediaDevices.length, i = 0; i < len; i++) {
        const item = mediaDevices[i];
        // NOTE: カメラデバイスの場合、 kind プロパティには "videoinput" が入っている:
        if (item.kind === "videoinput") {
            const deviceId = item.deviceId;
            const label = item.label;
            // NOTE: ここでデバイスID（とラベル）を適当な変数に保存しておく
            cameraDeviceIds.push({ deviceId, label });
            const option = document.createElement("option");
            option.text = label;
            option.value = deviceId;
            cameraOptions.appendChild(option);
        }
    }
});
//カメラの起動
var video;
function startWebcam() {
    video = $('#video_display').get(0);
    vendorUrl = window.URL || window.webkitURL;

    navigator.getMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

    navigator.mediaDevices.getUserMedia({
        video: {
            deviceId: document.getElementById("video-options").value
        },
        audio: false
    }).then(function (stream) {
        localStream = stream;
        video.srcObject = stream;
        video.play();
        $("#video_display").attr({
            "width": "" + video.clientWidth,
            "height": "" + video.clientHeight
        });
        $("#predict_display").attr({
            "width": "" + video.clientWidth,
            "height": "" + video.clientHeight
        })
        $("#stop_webcam").click(() => {
            stream.getTracks().forEach(track => track.stop())
        });
    }).catch(function (error) {
        alert("Something wrong with webcam!");
    });
}
$("#start_webcam").click(() => startWebcam());

//学習済みモデルを読み込み（実際にはpredict()に参照されるまで読み込まない）
var net;
async function loadModel() {
    net = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        multiplier: 0.5,
        quantBytes: 2
    })
}
loadModel();

//検出（最初の検出は，モデル読み込みのため少し遅れる）
async function predict() {
    /**
     * One of (see documentation below):
     *   - net.segmentPerson
     *   - net.segmentPersonParts
     *   - net.segmentMultiPerson
     *   - net.segmentMultiPersonParts
     * See documentation below for details on each method.
     */
    const segmentation = await net.segmentMultiPerson(document.getElementById("video_display"), {
        flipHorizontal: false,
        internalResolution: 'medium',
        segmentationThreshold: 0.7
    });
    console.log(segmentation);
    if ($("#predict_display").length > 0)
        plotPrediction(segmentation);
    countPersons(segmentation);
}

// 0.1secごとにpredictを呼び出す
var interval;
$("#start_predict").click(() => {
    clearInterval(interval);
    interval = setInterval(predict, 1000 / 10);
});
$("#stop_predict").click(() => {
    clearInterval(interval);
    interval = setTimeout(() => {
        if ($("#predict_display").length > 0) {
            var canvas = $("#predict_display").get(0);
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, 1000);
});

//検出結果の描画
function plotPrediction(seg) {
    //描画のためのコンテキストを取得，画面をクリア
    var canvas = $("#predict_display").get(0);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLine(ctx, canvas.width / 2, 0, canvas.width / 2, canvas.height);

    //取得したseqmentationのkeypointをすべて描画
    seg.forEach(person => {
        person.pose.keypoints.forEach(keypoint => {
            var pos = keypoint.position;
            if (keypoint.score > 0
                && pos.x > 0 && pos.x < canvas.width
                && pos.y > 0 && pos.y < canvas.height)
                drawRectByPosition(ctx, pos);
        })
    })
}

//人数の数え上げ
var personCounter_list = []
function countPersons(seg) {
    if (personCounter_list.push({ count: seg.length, time: new Date().getTime() }) > 4)
        personCounter_list.shift();
    detect();
}

const comingStr = "coming some people!";
const leaveStr = "leave all people!";
var detection_stat = leaveStr;
function detect() {
    if (personCounter_list.length >= 4) {
        if ((personCounter_list[0].count == 0
            && personCounter_list[1].count == 0
            && personCounter_list[2].count > 0
            && personCounter_list[3].count > 0)
            || (personCounter_list[0].count > 0
                && personCounter_list[1].count > 0
                && personCounter_list[2].count > 0
                && personCounter_list[3].count > 0)) {
            if (detection_stat.indexOf(leaveStr) >= 0) {
                detection_stat = comingStr;
                console.log(comingStr);
            }
        }
        else if ((personCounter_list[0].count > 0
            && personCounter_list[1].count > 0
            && personCounter_list[2].count == 0
            && personCounter_list[3].count == 0)
            || (personCounter_list[0].count == 0
                && personCounter_list[1].count == 0
                && personCounter_list[2].count == 0
                && personCounter_list[3].count == 0)) {
            if (detection_stat.indexOf(comingStr) >= 0) {
                detection_stat = leaveStr;
                console.log(leaveStr);
            }
        }
    }
    if ($("#debug_print").length > 0)
        document.getElementById("debug_print").textContent = detection_stat;
}

//直線描画
function drawLine(context, from_x, from_y, to_x, to_y) {
    context.beginPath();
    context.moveTo(from_x, from_y);
    context.lineTo(to_x, to_y);
    context.strokeStyle = 'red';
    context.lineWidth = 10;
    context.stroke();
}

//positionを中心とした四角形を描画
function drawRectByPosition(context, position) {
    const size = 10;
    // パスをリセット
    context.beginPath();
    // レクタングルの座標(50,50)とサイズ(75,50)を指定
    context.rect(position.x - size / 2, position.y - size / 2, size, size);
    // 塗りつぶしの色
    context.fillStyle = "#000000";
    // 塗りつぶしを実行
    context.fill();
}