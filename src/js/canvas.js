/**
 * Created by qiang on 2017/03/07.
 */
;
$.fn.extend({
    drawRec:function (options) {
        var defaults={
            data: [],
            fetal_data: 0,
            fontSize: "12",
            fontStyle: "italic",
            fontName: '"Source Sans Pro","Helvetica Neue",Helvetica,Arial,sans-serif',//"Source Sans Pro","Helvetica Neue",Helvetica,Arial,sans-serif
            width: "1920",
            height: "100",
            divY: "5",
            xStart:0,
            padding: [10, 10, 40, 60],//注意单位也是
            lineColor: "#0033FF",
            paintRatioWidth: null, // paintRatio打印倍率，用这个进行缩放满足最后的打印尺寸，注意宽度。。如果可能被浏览器再次进行缩放
            paintRatioHeight: null, // paintRatio打印倍率
            dataShowCount: 20 * 120,//显示数量，根据这个计算x 的宽度，可以大于数据，如果不填写，或者null，表示直接使用数据的长度
            lineWidth: 0.8,
            printRatio: 1,//打印倍数
            wrong: {
                start: 110, end: 160, lineColor: "green", lineWidth: 1,
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
                "40": {line: 1, color: "#4c4c4c"},
                "45": {line: 1, color: "#4c4c4c"},
                "50": {line: 1, color: "#4c4c4c"},
                "55": {line: 1, color: "#4c4c4c"},
                "60": {line: 1, color: "#fff"},
                "65": {line: 1, color: "#4c4c4c"},
                "70": {line: 1, color: "#4c4c4c"},
                "75": {line: 1, color: "#4c4c4c"},
                "80": {line: 1, color: "#fff"},
                "85": {line: 1, color: "#4c4c4c"},
                "90": {line: 1, color: "#4c4c4c"},
                "95": {line: 1, color: "#4c4c4c"},
                "100": {line: 1, color: "#4c4c4c"},
                "105": {line: 1, color: "#4c4c4c"},
                "110": {line: 1, color: "#fff"},
                "115": {line: 1, color: "#4c4c4c"},
                "120": {line: 1, color: "#4c4c4c"},
                "125": {line: 1, color: "#4c4c4c"},
                "130": {line: 1, color: "#4c4c4c"},
                "135": {line: 1, color: "#4c4c4c"},
                "140": {line: 1, color: "#4c4c4c"},
                "145": {line: 1, color: "#4c4c4c"},
                "150": {line: 1, color: "#4c4c4c"},
                "155": {line: 1, color: "#4c4c4c"},
                "160": {line: 1, color: "#4c4c4c"},
                "165": {line: 1, color: "#4c4c4c"},
                "170": {line: 1, color: "#4c4c4c"},
                "175": {line: 1, color: "#4c4c4c"},
                "180": {line: 1, color: "#4c4c4c"},
                "185": {line: 1, color: "#4c4c4c"},
                "190": {line: 1, color: "#4c4c4c"},
                "195": {line: 1, color: "#4c4c4c"},
                "200": {line: 1, color: "#4c4c4c"},
                "205": {line: 1, color: "#4c4c4c"},
                "210": {line: 1, color: "#4c4c4c"},
                "215": {line: 1, color: "#4c4c4c"},
                "220": {line: 1, color: "#4c4c4c"}
            }
        };
        var opts = $.extend(defaults,options);

        var wrap = $("<div>").appendTo(this);
        var ratio = (window.devicePixelRatio || 1)*opts.printRatio;
        if (opts.paintRatioWidth) {
            opts.width = Math.floor(parseInt(opts.width) * opts.paintRatioWidth) + "";
        }
        wrap.width(opts.width);
        if (opts.paintRatioHeight) {
            opts.height = Math.floor(parseInt(opts.height) * opts.paintRatioHeight) + "";
        }
        wrap.height(opts.height);

        var width = wrap.width();
        var height = wrap.height();
        var canvas = $('<canvas width="' + width * ratio +
            '" height="' + height * ratio + '" id="canvas" name="canvas">' +
            '</canvas>')
            .appendTo(wrap).width(width).height(height)[0];

        var Ratio = (width / parseInt(opts.width));

        var pad = opts.padding;
        for (var i = 0; i < pad.length; i++) {
            pad[i] = pad[i] * Ratio;
        }

        opts.ratio = ratio;
        opts.showWidth = width * ratio;
        opts.showHeight = height * ratio;
        var dataShowCount = Math.max(opts.dataShowCount || opts.data.length, opts.data.length);
        var ceilCount = Math.ceil(dataShowCount / opts.xRuler) * opts.xRuler;
        var pad = opts.padding;
        var padTop = Math.floor(pad[0] * ratio);//面板内补丁
        var padRight = Math.floor(pad[1] * ratio);//面板内补丁
        var padBottom = Math.floor(pad[2] * ratio);//面板内补丁
        var padLeft = Math.floor(pad[3] * ratio);//面板内补丁

        var showWidth = opts.showWidth;
        var showHeight = opts.showHeight;
        var bodyWidth = showWidth - padRight - padLeft;
        var bodyHeight = showHeight - padTop - padBottom;
        var yValue = opts.yMax - opts.yMin;//纵高
        var ctx = canvas.getContext("2d");
        var font = opts.fontStyle + " " + (opts.fontSize * ratio) + "px " + opts.fontName;
        var numberFontSize = calFontSize("888");
        ctx.font = font;
        var xWidth = bodyWidth / ceilCount;
         //y 轴承线条
        var line, x, y;
        var yRuler = opts.yRuler;
        var yRuler_ = opts.yRuler_;
        if (opts.divY == 5) {
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
        for (var i = 0, n = 0; i <= ceilCount; i += opts.xRuler, n++) {
            ctx.beginPath();
            line = calLineWidth(opts.xRulerLine(i, n));
            ctx.strokeStyle = opts.xRulerColor(i, n);
            ctx.lineWidth = line;
            var style = opts.xRulerStyle(i, n);
            x = calXValue(parseInt(i));

            if (style == 0) {
                ctx.moveTo(x, padTop);
                ctx.lineTo(x, padTop + bodyHeight);
                ctx.stroke();
                ctx.closePath();
                var text = opts.xRulerText(i, n);
                if (text) {
                    ctx.fillText(
                        text,
                        x - numberFontSize.width - (-12 * ratio),
                        padTop + bodyHeight + numberFontSize.height + 2
                    );
                }

            }
            ctx.closePath();
        }
        function calYValue(y) {
            return Math.round(padTop + bodyHeight * (yValue - (y - opts.yMin)) / yValue);
        }

        function calXValue(x) {
            return Math.round(padLeft + xWidth * x);
        }
        function calLineWidth(width) {
            return width * ratio;
        }
        function calFontSize(str) {
            var m = ctx.measureText(str);
            return {
                width: Math.round(m.width * ratio),
                height: Math.round(m.width * ratio)
            }
        }

    }

});
