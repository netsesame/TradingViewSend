// ==UserScript==
// @name         TradingViewSend!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       三分之二十倍的氢氧化铝
// @match        *://*.tradingview.com/chart/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function RGBToHex(rgb) {
        var regexp = /[0-9]{0,3}/g;
        var re = rgb.match(regexp); //利用正则表达式去掉多余的部分，将rgb中的数字提取
        var hexColor = "#";
        var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        for (var i = 0; i < re.length; i++) {
            var r = null,
                c = re[i],
                l = c;
            var hexAr = [];
            while (c > 16) {
                r = c % 16;
                c = (c / 16) >> 0;
                hexAr.push(hex[r]);
            }
            hexAr.push(hex[c]);
            if (l < 16 && l != "") {
                hexAr.push(0)
            }
            hexColor += hexAr.reverse().join('');
        }
        //alert(hexColor)
        return hexColor;
    };

    function allCaps(str) {
        var tab = new Array();
        var strCount = str.length;
        for (var i = 0; i < str.length; i++) {
            var c = str[i];
            if (c < 'A' || c > 'Z') {} else {
                // console.log(c);
                tab.push(c)
            };
        };
        //var string = tab.join(tab);
        return tab.join("")
    };

    window.getTVJson = function() {

        var width1 = parseInt(document.querySelector('body > div.js-rootresizer__contents > div.layout__area--right').style.width.replace('px', ""))
        if (width1 < 200) {
            document.querySelector('body > div.js-rootresizer__contents > div.layout__area--right > div > div.widgetbar-tabs > div > div > div > div > div:nth-child(4)').click()
        }
        var indicatorsCount = document.querySelectorAll(' div.chart-data-window > div').length;
        //console.log('指标的个数', indicatorsCount);

        var tab = {};
        tab['datetime'] = document.querySelectorAll('div.chart-data-window-body>div>div.chart-data-window-item-value')[0].innerText + ' ' + document.querySelectorAll('div.chart-data-window-body>div>div.chart-data-window-item-value')[1].innerText
        tab['ex'] = document.querySelectorAll('div.chart-data-window-header>span')[1].outerText.split(",")[1]

        if ((parseInt(new Date().getMinutes()) - parseInt(document.querySelectorAll('div.chart-data-window-body>div>div.chart-data-window-item-value')[1].innerText.split('\:')[1])) > parseInt(tab['ex']) + 1) {
            location = location

        } else {
            console.log('fen:' + new Date().getMinutes())
            console.log('shijian:' + document.querySelectorAll('div.chart-data-window-body>div>div.chart-data-window-item-value')[1].innerText.split('\:')[1])
            console.log('ex:' + tab['ex'])
            console.log('为超市')
        }


        var b = 2;
        for (var i = 1; i < indicatorsCount; i++) {
            //取得标题
            // console.log('值', i);
            //取得标题
            var x = document.querySelectorAll('div.chart-data-window-header')[i].children[0].title;
            // tab.push({name: x});
            //取得数量
            var y = document.querySelectorAll('div.chart-data-window-body')[i].children.length;
            //console.log(y)
            //取得指标的的大写字母 缩写
            var capsStr = allCaps(x)
            for (var k = 0; k < y; k++) {
                //取出值
                //  console.log("K的值为", k);
                //console.log("i",i,"k",k)
                // console.log(b)

                var indicatorsName = document.querySelectorAll('div.chart-data-window-body>div>div.chart-data-window-item-title')[b].innerText; //指标的参数名
                var indicatorsValue = document.querySelectorAll('div.chart-data-window-body>div>div.chart-data-window-item-value')[b].innerText; //指标的参数值
                var indicatorscolor = RGBToHex(document.querySelectorAll('div.chart-data-window-body>div>div.chart-data-window-item-value')[b].children[0].style.color)
                    //console.log("指标的参数名",indicatorsName,"指标的参数值",indicatorsValue);
                if (!tab[capsStr + indicatorsName]) {
                    tab[capsStr + indicatorsName] = { value: indicatorsValue, name: capsStr, color: indicatorscolor };
                } else {
                    tab[capsStr + indicatorsName + k] = { value: indicatorsValue, name: capsStr, color: indicatorscolor };
                };
                b++
            }


        }
        return tab
    }

    if (window.WebSocket != undefined) {
        window.wsUri = "ws://127.0.0.1:9055";
        var output;
        window.wsinit = function() {
            //output = document.getElementById("output");
            window.testWebSocket();
        };

        window.testWebSocket = function() {
            window.websocket1 = new WebSocket(window.wsUri);
            window.websocket1.onopen = function(evt) {
                onOpen(evt)
            };
            window.websocket1.onclose = function(evt) {
                window.websocket1 = null;
                onClose(evt)
            };
            window.websocket1.onmessage = function(evt) {
                onMessage(evt)
            };
            window.websocket1.onerror = function(evt) {
                window.websocket1 = null;
                onError(evt)
            };
        }

        function onOpen(evt) {
            //writeToScreen("CONNECTED");
            // websocket.send('实时网页版');
        }

        function onClose(evt) {
            //writeToScreen("DISCONNECTED");

            websocket.close();
            window.websocket1 = null
        }

        function onMessage(evt) {
            console.log(evt)
        }

        function onError(evt) {
            //writeToScreen('<span style="color: red;">ERROR:</span> '+ evt.data);
        }

        window.doSend = function(message) {
            window.websocket1.send(message);
        };


        window.addEventListener("load", window.wsinit, false);
    } else {
        alert("不支持...")
    }

    var x = "";
    setInterval(function() {
        if (window.websocket1 == null) {} else {
            if (x == msg) {} else {
                var msg = window.getTVJson()
                    //console.log(msg)
                window.doSend(JSON.stringify(msg))
                x = msg;
            }
        }
    }, 1000);


    // var x = ''
    // $("body > div.js-rootresizer__contents > div.layout__area--right > div > div.widgetbar-pages > div.widgetbar-pagescontent > div.widgetbar-page.active > div > div.widgetbar-widgetbody.wrapper-2KWBfDVB > div.chart-data-window").live('DOMNodeInserted',function(e){
    // if (window.websocket1 == null) {
    //
    // } else {
    //     if (x == msg) {
    //     } else {
    //         var msg = window.getTVJson()
    //         //console.log(msg)
    //         window.doSend(JSON.stringify(msg))
    //         x = msg;
    //     }
    //
    // }
    //
    // })


    // Your code here...
})();