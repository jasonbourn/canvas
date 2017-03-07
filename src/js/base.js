/**
 * 主要js
 */
;
window.mini || (function ($) {
    'use strict';
    var doc = $(document),
        win = $(window), body = $(document.body),
        m = window.mini = {
            heartRateGrid: function (cfg) {
                cfg = $.extend({
                    data: [],
                    fetal_data: 0,
                    fontSize: "12",
                    fontStyle: "italic",
                    fontName: '"Source Sans Pro","Helvetica Neue",Helvetica,Arial,sans-serif',//"Source Sans Pro","Helvetica Neue",Helvetica,Arial,sans-serif
                    width: "1920",
                    height: "100",
                    divY: "5",
                    xStart:0,
                    padding: [100, 40, 100, 60],//注意单位也是
                    lineColor: "#0033FF",
                    paintRatioWidth: null, // paintRatio打印倍率，用这个进行缩放满足最后的打印尺寸，注意宽度。。如果可能被浏览器再次进行缩放
                    paintRatioHeight: null, // paintRatio打印倍率
                    dataShowCount: 20 * 120,//显示数量，根据这个计算x 的宽度，可以大于数据，如果不填写，或者null，表示直接使用数据的长度
                    lineWidth: 0.8,
                    printRatio: 1,//打印倍数
                    wrong: {
                        start: 90, end: 100, lineColor: "green", lineWidth: 1,
                        rectColor: "rgba(205,237,253,0.3)"
                    },
                    xRuler: 120,//120
                    xRulerText: function (v, n) {
                        return n + "'"
                    },
                    xRulerLine: function (v, n) {
                        return 1;
                    },
                    xRulerColor: function (v, n) {
                        return "#000";
                    },
                    xRulerStyle: function (v, n) {
                        return 0;
                    },
                    xRulerDottedColor: function (v, n) {
                        return "#ccc";
                    },
                    yMax: 220,
                    yMin: 40,
                    yRuler: {
                        "40": {line: 1, color: "#000"},
                        "50": {line: 1, color: "#000"},
                        "60": {line: 1, color: "#000", text: "60"},
                        "70": {line: 1, color: "#000"},
                        "80": {line: 1, color: "#000", text: "80"},
                        "90": {line: 1, color: "#000"},
                        "100": {line: 1, color: "#000", text: "100"},
                        "110": {line: 1, color: "#000"},
                        "120": {line: 1, color: "#000", text: "120"},
                        "130": {line: 1, color: "#000"},
                        "140": {line: 1, color: "#000", text: "140"},
                        "150": {line: 1, color: "#000"},
                        "160": {line: 1, color: "#000", text: "160"},
                        "170": {line: 1, color: "#000"},
                        "180": {line: 1, color: "#000", text: "180"},
                        "190": {line: 1, color: "#000"},
                        "200": {line: 1, color: "#000", text: "200"},
                        "210": {line: 1, color: "#000"},
                        "220": {line: 1, color: "#000", text: "220"}
                    },
                    yRuler_: {
                        "40": {line: 1, color: "#adadad"},
                        "45": {line: 1, color: "#adadad"},
                        "50": {line: 1, color: "#adadad"},
                        "55": {line: 1, color: "#adadad"},
                        "60": {line: 1, color: "#fff"},
                        "65": {line: 1, color: "#adadad"},
                        "70": {line: 1, color: "#adadad"},
                        "75": {line: 1, color: "#adadad"},
                        "80": {line: 1, color: "#fff"},
                        "85": {line: 1, color: "#adadad"},
                        "90": {line: 1, color: "#adadad"},
                        "95": {line: 1, color: "#adadad"},
                        "100": {line: 1, color: "#adadad"},
                        "105": {line: 1, color: "#adadad"},
                        "110": {line: 1, color: "#fff"},
                        "115": {line: 1, color: "#adadad"},
                        "120": {line: 1, color: "#adadad"},
                        "125": {line: 1, color: "#adadad"},
                        "130": {line: 1, color: "#adadad"},
                        "135": {line: 1, color: "#adadad"},
                        "140": {line: 1, color: "#adadad"},
                        "145": {line: 1, color: "#adadad"},
                        "150": {line: 1, color: "#adadad"},
                        "155": {line: 1, color: "#adadad"},
                        "160": {line: 1, color: "#adadad"},
                        "165": {line: 1, color: "#adadad"},
                        "170": {line: 1, color: "#adadad"},
                        "175": {line: 1, color: "#adadad"},
                        "180": {line: 1, color: "#adadad"},
                        "185": {line: 1, color: "#adadad"},
                        "190": {line: 1, color: "#adadad"},
                        "195": {line: 1, color: "#adadad"},
                        "200": {line: 1, color: "#adadad"},
                        "205": {line: 1, color: "#adadad"},
                        "210": {line: 1, color: "#adadad"},
                        "215": {line: 1, color: "#adadad"},
                        "220": {line: 1, color: "#adadad"}
                    }
                }, $.isPlainObject(cfg) ? cfg : {});

                var wrap = $("<div>").appendTo(this);
                var ratio = (window.devicePixelRatio || 1) * cfg.printRatio;
                if (cfg.paintRatioWidth) {
                    cfg.width = Math.floor(parseInt(cfg.width) * cfg.paintRatioWidth) + "";
                }
                wrap.width(cfg.width);
                if (cfg.paintRatioHeight) {
                    cfg.height = Math.floor(parseInt(cfg.height) * cfg.paintRatioHeight) + "";
                }
                wrap.height(cfg.height);

                var width = wrap.width();
                var height = wrap.height();
                var canvas = $('<canvas width="' + width * ratio +
                    '" height="' + height * ratio + '" id="canvas" name="canvas">' +
                    '</canvas>')
                    .appendTo(wrap).width(width).height(height)[0];

                var Ratio = (width / parseInt(cfg.width));

                var pad = cfg.padding;
                for (var i = 0; i < pad.length; i++) {
                    pad[i] = pad[i] * Ratio;
                }

                cfg.ratio = ratio;
                cfg.showWidth = width * ratio;
                cfg.showHeight = height * ratio;

                m.heartRateGridPaint(canvas, cfg);
            },
            heartRateGridPaint: function (canvas, cfg) {
                var ratio = cfg.ratio;
                var heartRate = cfg.data;

                var dataShowCount = Math.max(cfg.dataShowCount || heartRate.length, heartRate.length);
                var ceilCount = Math.ceil(dataShowCount / cfg.xRuler) * cfg.xRuler;
                //console.log(ceilCount,heartRate.length/cfg.xRuler,heartRate.length%cfg.xRuler, Math.ceil(heartRate.length/cfg.xRuler));

                var pad = cfg.padding;
                var padTop = Math.floor(pad[0] * ratio);//面板内补丁
                var padRight = Math.floor(pad[1] * ratio);//面板内补丁
                var padBottom = Math.floor(pad[2] * ratio);//面板内补丁
                var padLeft = Math.floor(pad[3] * ratio);//面板内补丁

                var showWidth = cfg.showWidth;
                var showHeight = cfg.showHeight;
                var bodyWidth = showWidth - padRight - padLeft;
                var bodyHeight = showHeight - padTop - padBottom;
                var yValue = cfg.yMax - cfg.yMin;//纵高

                //胎动数据，和长度
                var daidong_data = cfg.data;
                var ctx = canvas.getContext("2d");
                var font = cfg.fontStyle + " " + (cfg.fontSize * ratio) + "px " + cfg.fontName;
                var numberFontSize = calFontSize("888");
                ctx.font = font;

                var xWidth = bodyWidth / ceilCount;
                var wrong = cfg.wrong;
                var wrongY;
                if (wrong) {
                    wrongY = calYValue(wrong.end) ;
                    ctx.save();
                    ctx.fillStyle = wrong.rectColor;
                    ctx.fillRect(padLeft, wrongY, bodyWidth, calYValue(wrong.start) - wrongY);
                    ctx.restore();
                }
                //y 轴承线条
                var line, x, y;
                var yRuler = cfg.yRuler;
                var yRuler_ = cfg.yRuler_;
                if (cfg.divY == 5) {
                    for (var rk in yRuler_) {
                        if (yRuler_.hasOwnProperty(rk)) {
                            ctx.beginPath();
                            var r = yRuler_[rk];
                            line = calLineWidth(r.line);
                            ctx.lineWidth = line;
                            ctx.strokeStyle = r.color;
                            y = calYValue(parseInt(rk));
                            for (var l = 0; l < bodyWidth - 20; l = l + 40) {
                                ctx.moveTo(padLeft + l, y);
                                ctx.lineTo(padLeft + l + 20, y);
                            }
                            ctx.stroke();
                            ctx.closePath();
                        }
                    }
                }
                for (var rk in yRuler) {
                    if (yRuler.hasOwnProperty(rk)) {
                        ctx.beginPath();
                        var r = yRuler[rk];
                        line = calLineWidth(r.line);
                        ctx.lineWidth = line;
                        ctx.strokeStyle = r.color;
                        y = calYValue(parseInt(rk));
                        ctx.moveTo(padLeft, y);
                        ctx.lineTo(padLeft + bodyWidth, y);
                        ctx.stroke();
                        ctx.closePath();
                        if (r.text) {
                            ctx.fillText(
                                r.text,
                                padLeft - numberFontSize.width - 2 * ratio,
                                Math.round(y + (numberFontSize.height / 3) / 2 + line / 2)
                            );
                        }
                        ctx.closePath();
                    }
                }
                //x线条
                for (var i = 0, n = 0; i <= ceilCount; i += cfg.xRuler, n++) {
                    ctx.beginPath();
                    line = calLineWidth(cfg.xRulerLine(i, n));
                    ctx.strokeStyle = cfg.xRulerColor(i, n);
                    ctx.lineWidth = line;
                    var style = cfg.xRulerStyle(i, n);
                    x = calXValue(parseInt(i));

                    if (style == 0) {
                        ctx.moveTo(x, padTop);
                        ctx.lineTo(x, padTop + bodyHeight);
                        ctx.stroke();
                        ctx.closePath();
                        var text = cfg.xRulerText(i, n);
                        if (text) {
                            ctx.fillText(
                                text,
                                x - numberFontSize.width - (-12 * ratio),
                                padTop + bodyHeight + numberFontSize.height + 2
                            );
                        }

                    } else {
                        ctx.strokeStyle = cfg.xRulerDottedColor(i, n);
                        for (var l = 0; l < bodyHeight; l = l + 40) {
                            ctx.moveTo(x, padTop + l);
                            ctx.lineTo(x, padTop + l + 20);
                        }
                        ctx.stroke();
                    }
                    ctx.closePath();
                }
                paintLine(canvas,cfg.lineWidth,cfg.lineColor)
                function calLineWidth(width) {
                    return width * ratio;
                }

                //计算y轴线条的位置
                function calYValue(y) {
                    return Math.round(padTop + bodyHeight * (yValue - (y - cfg.yMin)) / yValue);
                }

                function calXValue(x) {
                    return Math.round(padLeft + xWidth * x);
                }

                function calFontSize(str) {
                    var m = ctx.measureText(str);
                    return {
                        width: Math.round(m.width * ratio),
                        height: Math.round(m.width * ratio)
                    }
                }

                function paintLine(canvas,lineWidth, strokeStyle) {
                    ctx.beginPath();
                    //绘制曲线
                    var t;
                    canvas.addEventListener("click",function () {
                        var img=document.getElementById("start");
                        var audio =document.getElementById("wav");
                        audio.play();
                        if (moving){
                            var width =Math.min(window.screen.width,canvas.width);
                            audio.pause();
                            clearTimeout(t);
                            moving=false
                        }else {
                            audio.play();
                            moving=true;
                            drawl();
                        }


                    });
                    ctx.lineWidth = calLineWidth(lineWidth);
                    ctx.strokeStyle = strokeStyle;
                    ctx.lineCap="round";
                    ctx.shadowBlur=1;
                    ctx.shadowOffsetX=2;
                    ctx.shadowColor="#000022";//默认。向线条的每个末端添加平直的边缘。
                    ctx.lineJoin="round";
                    var isStart = false;
                    var i=0;
                    var moving=false;
                    drawl();
                    function drawl() {
                        moving=true;
                        if(i<heartRate.length){
                            var point = heartRate[i].y;
                            //计算心跳值的绝对值>20
                            var pointDiffer = 0;
                            if (i > 0) {
                                pointDiffer = Math.abs(heartRate[i - 1].y - point);
                            }
                            if (point > 40 && point <= 220) {
                                if (isStart && pointDiffer < 20) {
                                    ctx.lineTo(calXValue(i), calYValue(point));
                                }
                                ctx.moveTo(calXValue(i), calYValue(point));
                                isStart = true
                            }
                            else {
                                isStart = false
                            }
                        }
                        ctx.stroke();
                        ctx.closePath();
                        i++;
                        t=setTimeout(drawl,500);
                    }
                }
            }
        };

    $.fn.extend({
       heartRateGrid: m.heartRateGrid
    });
}(jQuery));
