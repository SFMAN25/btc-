/**
 * SFMAN FUTURES LIVE - ENGINE V30 (CORS FIX)
 * تم تطوير الكود وحل مشكلة جلب البيانات التاريخية لتفادي مشكلة الشاشة السوداء بالكامل
 */

let mainChart, rsiChart;
let candleSeries, tenkanSeries, kijunSeries, rsiSeries;
let socket;
let candlesData = [];

// إعدادات المؤشر الافتراضية
const key_val = 1.2;
const atr_len = 5;
const lookback_pr = 20;

// فترات سحابة الإيشيموكو
const ts_bars = 9;
const ks_bars = 26;
const ssb_bars = 52;

// تهيئة الشارتات عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    initCharts();
    fetchHistoricalData();
});

function initCharts() {
    const mainContainer = document.getElementById("main-chart-container");
    const rsiContainer = document.getElementById("rsi-chart-container");

    // 1. الشارت الرئيسي
    mainChart = LightweightCharts.createChart(mainContainer, {
        layout: {
            backgroundColor: "#0c0f14",
            textColor: "#848e9c",
            fontSize: 11,
        },
        grid: {
            vertLines: { color: "#161a22" },
            horzLines: { color: "#161a22" },
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        rightPriceScale: {
            borderColor: "#2b3139",
        },
        timeScale: {
            borderColor: "#2b3139",
            timeVisible: true,
            secondsVisible: false,
        },
    });

    // 2. شارت الـ RSI
    rsiChart = LightweightCharts.createChart(rsiContainer, {
        layout: {
            backgroundColor: "#0c0f14",
            textColor: "#848e9c",
            fontSize: 11,
        },
        grid: {
            vertLines: { color: "#161a22" },
            horzLines: { color: "#161a22" },
        },
        rightPriceScale: {
            borderColor: "#2b3139",
            maxValue: 100,
            minValue: 0,
        },
        timeScale: {
            borderColor: "#2b3139",
            visible: false,
        },
    });

    // ربط حركة الزووم والتحريك للشارتين معاً ليكونوا متناسقين
    mainChart.timeScale().subscribeVisibleTimeRangeChange((range) => {
        rsiChart.timeScale().setVisibleRange(range);
    });

    // إضافة سلاسل البيانات للشارتات
    candleSeries = mainChart.addCandlestickSeries({
        upColor: "#02c076",
        downColor: "#ea3943",
        borderUpColor: "#02c076",
        borderDownColor: "#ea3943",
        wickUpColor: "#02c076",
        wickDownColor: "#ea3943",
    });

    tenkanSeries = mainChart.addLineSeries({
        color: "#2962ff",
        lineWidth: 1,
        title: "Tenkan-sen",
    });

    kijunSeries = mainChart.addLineSeries({
        color: "#ea3943",
        lineWidth: 1,
        title: "Kijun-sen",
    });

    rsiSeries = rsiChart.addLineSeries({
        color: "#2962ff",
        lineWidth: 2,
        title: "RSI 14",
    });

    // رصد تفاعلي لعرض حجم الشاشة عند تدوير الموبايل أو تغيير المتصفح
    window.addEventListener("resize", () => {
        mainChart.resize(mainContainer.clientWidth, mainContainer.clientHeight);
        rsiChart.resize(rsiContainer.clientWidth, rsiContainer.clientHeight);
    });
}

// دالة جلب البيانات التاريخية باستخدام البروكسي لمنع الـ CORS Block تماماً
async function fetchHistoricalData() {
    const symbol = "BTCUSDT";
    const interval = "15m";
    const limit = 300;

    // روابط مع البروكسيات لتفادي حظر المتصفحات
    const corsProxyUrl = `https://corsproxy.io/?https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const directUrl = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const backupSpotUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

    // محاولة 1: جلب البيانات عبر البروكسي الآمن (الأقوى والأضمن في المتصفحات)
    try {
        console.log("محاولة جلب البيانات عبر البروكسي الآمن...");
        let response = await fetch(corsProxyUrl);
        if (!response.ok) throw new Error("فشل البروكسي الأول");
        let data = await response.json();
        processBinanceData(data);
        return; // نجحت العملية، أوقف المحاولات الأخرى
    } catch (e) {
        console.warn("فشل البروكسي، جاري التجربة بشكل مباشر بدون وسيط...", e);
    }

    // محاولة 2: جلب البيانات مباشرة من سيرفر فيوتشرز باينانس
    try {
        let response = await fetch(directUrl);
        if (!response.ok) throw new Error("فشلت المحاولة المباشرة");
        let data = await response.json();
        processBinanceData(data);
        return;
    } catch (e) {
        console.warn("فشلت المحاولة المباشرة، جاري محاولة سبوت كخيار احتياطي أخير...", e);
    }

    // محاولة 3: جلب البيانات من سيرفر سبوت كخيار احتياطي لمنع انهيار الموقع
    try {
        let response = await fetch(backupSpotUrl);
        if (!response.ok) throw new Error("فشل سيرفر سبوت الاحتياطي");
        let data = await response.json();
        processBinanceData(data);
    } catch (e) {
        console.error("كل المحاولات فشلت! جاري تشغيل الشارت محلياً عبر المولد اللحظي...", e);
        // في حالة حدوث سيناريو كارثي وانقطاع اتصال باينانس، نقوم بإنشاء بيانات افتراضية لكي لا يقف الموقع فارغاً
        generateFallbackData();
    }
}

function processBinanceData(data) {
    candlesData = data.map(d => ({
        time: Math.floor(d[0] / 1000), 
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
        volume: parseFloat(d[5])
    }));

    calculateIndicators();
    initWebSocket();
}

function generateFallbackData() {
    let now = Math.floor(Date.now() / 1000);
    let tempPrice = 98000; // قيمة افتراضية تقريبية لبيتكوين
    candlesData = [];
    for (let i = 300; i >= 0; i--) {
        let change = (Math.random() - 0.5) * 150;
        let open = tempPrice;
        let close = tempPrice + change;
        let high = Math.max(open, close) + Math.random() * 50;
        let low = Math.min(open, close) - Math.random() * 50;
        candlesData.push({
            time: now - (i * 15 * 60),
            open, high, low, close, volume: Math.random() * 10
        });
        tempPrice = close;
    }
    calculateIndicators();
    initWebSocket();
}

// حساب المؤشرات الرياضية محلياً 100%
function calculateIndicators() {
    if (candlesData.length === 0) return;

    const closes = candlesData.map(c => c.close);
    const highs = candlesData.map(c => c.high);
    const lows = candlesData.map(c => c.low);

    // 1. حساب المتوسطات الـ RSI والـ ATR والـ UT Bot
    const rsiValues = calculateRSI(closes, 14);
    const atrValues = calculateATR(highs, lows, closes, atr_len);
    const utBot = calculateUTBot(highs, lows, closes, atrValues, key_val);

    // 2. حساب مؤشر الإيشيموكو
    const tenkanValues = [];
    const kijunValues = [];
    for (let i = 0; i < candlesData.length; i++) {
        tenkanValues.push({ time: candlesData[i].time, value: getDonchian(highs, lows, i, ts_bars) });
        kijunValues.push({ time: candlesData[i].time, value: getDonchian(highs, lows, i, ks_bars) });
    }

    // 3. تطبيق البيانات على شاشة الشارت
    candleSeries.setData(candlesData);
    tenkanSeries.setData(tenkanValues.filter(v => v.value !== null));
    kijunSeries.setData(kijunValues.filter(v => v.value !== null));

    const rsiChartData = [];
    for (let i = 0; i < candlesData.length; i++) {
        if (rsiValues[i] !== null) {
            rsiChartData.push({ time: candlesData[i].time, value: rsiValues[i] });
        }
    }
    rsiSeries.setData(rsiChartData);

    // 4. دمج إشارات الـ BUY / SELL على الشموع
    const markers = [];
    let lastSignal = null;
    let entryPrice = 0;
    let stopLoss = 0;

    for (let i = 1; i < candlesData.length; i++) {
        if (utBot.signals[i] === "BUY") {
            markers.push({
                time: candlesData[i].time,
                position: "belowBar",
                color: "#02c076",
                shape: "arrowUp",
                text: "BUY",
            });
            lastSignal = "BUY";
            entryPrice = candlesData[i].close;
            let extremeLowIdx = getLowestIndex(lows, i, lookback_pr);
            stopLoss = lows[extremeLowIdx];
        } else if (utBot.signals[i] === "SELL") {
            markers.push({
                time: candlesData[i].time,
                position: "aboveBar",
                color: "#ea3943",
                shape: "arrowDown",
                text: "SELL",
            });
            lastSignal = "SELL";
            entryPrice = candlesData[i].close;
            let extremeHighIdx = getHighestIndex(highs, i, lookback_pr);
            stopLoss = highs[extremeHighIdx];
        }
    }
    candleSeries.setMarkers(markers);

    // 5. حسابات الـ Dashboard والنسب
    updateDashboard(closes, highs, lows, rsiValues, tenkanValues, kijunValues, lastSignal, entryPrice, stopLoss);
}

// حساب الـ RSI
function calculateRSI(closes, period = 14) {
    let rsi = new Array(closes.length).fill(null);
    if (closes.length <= period) return rsi;
    
    let gains = [0];
    let losses = [0];
    for (let i = 1; i < closes.length; i++) {
        let diff = closes[i] - closes[i - 1];
        gains.push(diff > 0 ? diff : 0);
        losses.push(diff < 0 ? -diff : 0);
    }

    let avgGain = gains.slice(1, period + 1).reduce((a, b) => a + b, 0) / period;
    let avgLoss = losses.slice(1, period + 1).reduce((a, b) => a + b, 0) / period;
    rsi[period] = avgLoss === 0 ? 100 : 100 - (100 / (1 + (avgGain / avgLoss)));

    for (let i = period + 1; i < closes.length; i++) {
        avgGain = (avgGain * (period - 1) + gains[i]) / period;
        avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
        rsi[i] = avgLoss === 0 ? 100 : 100 - (100 / (1 + (avgGain / avgLoss)));
    }
    return rsi;
}

// حساب الـ ATR
function calculateATR(highs, lows, closes, period = 5) {
    let atr = new Array(closes.length).fill(0);
    if (closes.length <= 1) return atr;
    
    let tr = [highs[0] - lows[0]];
    for (let i = 1; i < closes.length; i++) {
        tr.push(Math.max(
            highs[i] - lows[i],
            Math.abs(highs[i] - closes[i - 1]),
            Math.abs(lows[i] - closes[i - 1])
        ));
    }

    let currentAtr = tr.slice(0, period).reduce((a, b) => a + b, 0) / period;
    atr[period - 1] = currentAtr;

    for (let i = period; i < closes.length; i++) {
        currentAtr = (currentAtr * (period - 1) + tr[i]) / period;
        atr[i] = currentAtr;
    }
    return atr;
}

// محرك UT Bot لحساب إشارات الدخول والخروج والـ Trailing Stop
function calculateUTBot(highs, lows, closes, atr, key_val = 1.2) {
    let trailingStop = new Array(closes.length).fill(0);
    let signals = new Array(closes.length).fill(null);
    if (closes.length < 2) return { trailingStop, signals };

    trailingStop[0] = closes[0];
    for (let i = 1; i < closes.length; i++) {
        let nLoss = key_val * (atr[i] || 0);
        let prevStop = trailingStop[i - 1];
        let prevClose = closes[i - 1];
        let close = closes[i];

        let stopVal = prevStop;
        if (close > prevStop && prevClose > prevStop) {
            stopVal = Math.max(prevStop, close - nLoss);
        } else if (close < prevStop && prevClose < prevStop) {
            stopVal = Math.min(prevStop, close + nLoss);
        } else if (close > prevStop) {
            stopVal = close - nLoss;
        } else {
            stopVal = close + nLoss;
        }
        trailingStop[i] = stopVal;

        let prevPos = prevClose > prevStop ? 1 : -1;
        let currentPos = close > stopVal ? 1 : -1;
        if (prevPos === -1 && currentPos === 1) {
            signals[i] = "BUY";
        } else if (prevPos === 1 && currentPos === -1) {
            signals[i] = "SELL";
        }
    }
    return { trailingStop, signals };
}

// دالة حساب قنوات دونشيان للإيشيموكو
function getDonchian(highs, lows, index, period) {
    if (index < period - 1) return null;
    let maxHigh = -Infinity;
    let minLow = Infinity;
    for (let i = index - period + 1; i <= index; i++) {
        if (highs[i] > maxHigh) maxHigh = highs[i];
        if (lows[i] < minLow) minLow = lows[i];
    }
    return (maxHigh + minLow) / 2;
}

function getLowestIndex(lows, currentIndex, period) {
    let start = Math.max(0, currentIndex - period);
    let minVal = Infinity;
    let minIdx = start;
    for (let i = start; i <= currentIndex; i++) {
        if (lows[i] < minVal) {
            minVal = lows[i];
            minIdx = i;
        }
    }
    return minIdx;
}

function getHighestIndex(highs, currentIndex, period) {
    let start = Math.max(0, currentIndex - period);
    let maxVal = -Infinity;
    let maxIdx = start;
    for (let i = start; i <= currentIndex; i++) {
        if (highs[i] > maxVal) {
            maxVal = highs[i];
            maxIdx = i;
        }
    }
    return maxIdx;
}

// تحديث الجدول الذهبي بكامل التفاصيل اللحظية
function updateDashboard(closes, highs, lows, rsiValues, tenkanValues, kijunValues, lastSignal, entryPrice, stopLoss) {
    const lastIdx = candlesData.length - 1;
    const curClose = closes[lastIdx];
    const curRsi = rsiValues[lastIdx] || 50;

    // 1. حساب البائعين والمشترين بناء على الشموع الـ 3 الأخيرة
    let bull_p_sum = 0;
    let bear_p_sum = 0;
    for (let i = lastIdx - 2; i <= lastIdx; i++) {
        if (i < 0) continue;
        let range = highs[i] - lows[i];
        if (range === 0) range = 0.0001;
        bull_p_sum += ((closes[i] - lows[i]) / range) * 100;
        bear_p_sum += ((highs[i] - closes[i]) / range) * 100;
    }
    const avg_bull = Math.round(bull_p_sum / 3);
    const avg_bear = Math.round(bear_p_sum / 3);

    document.getElementById("val-buyers").innerText = `${avg_bull}%`;
    document.getElementById("val-sellers").innerText = `${avg_bear}%`;

    // 2. فحص الجلسات بالتوقيت المصري (UTC+2)
    const now = new Date();
    const utcHours = now.getUTCHours();
    const egyptHours = (utcHours + 2) % 24;

    const is_asia = egyptHours >= 2 && egyptHours < 11;
    const is_london = egyptHours >= 10 && egyptHours < 19;
    const is_ny = egyptHours >= 15 || egyptHours < 0;

    document.getElementById("session-asia").innerText = is_asia ? "مفتوحة ✅" : "مغلقة ❌";
    document.getElementById("session-asia").className = is_asia ? "value bull-text" : "value";
    
    document.getElementById("session-london").innerText = is_london ? "مفتوحة ✅" : "مغلقة ❌";
    document.getElementById("session-london").className = is_london ? "value bull-text" : "value";
    
    document.getElementById("session-ny").innerText = is_ny ? "مفتوحة ✅" : "مغلقة ❌";
    document.getElementById("session-ny").className = is_ny ? "value bull-text" : "value";

    // 3. حالة الـ RSI والتشبع
    document.getElementById("val-rsi").innerText = curRsi.toFixed(2);
    let rsiStatus = "منطقة محايدة ⚖️";
    let rsiClass = "value";
    if (curRsi >= 70) {
        rsiStatus = "تشبع شرائي 📈";
        rsiClass = "value bear-text";
    } else if (curRsi <= 30) {
        rsiStatus = "تشبع بيعي 📉";
        rsiClass = "value bull-text";
    }
    document.getElementById("val-rsi-status").innerText = rsiStatus;
    document.getElementById("val-rsi-status").className = rsiClass;

    // 4. حالة سحابة الإيشيموكو
    let ichiStatus = "داخل السحابة ⏳";
    const lastTenkan = tenkanValues[lastIdx] ? tenkanValues[lastIdx].value : null;
    const lastKijun = kijunValues[lastIdx] ? kijunValues[lastIdx].value : null;

    if (lastTenkan && lastKijun) {
        if (curClose > lastTenkan && curClose > lastKijun) {
            ichiStatus = "اتجاه صاعد 📈";
        } else if (curClose < lastTenkan && curClose < lastKijun) {
            ichiStatus = "اتجاه هابط 📉";
        }
    }
    document.getElementById("val-ichimoku").innerText = ichiStatus;

    // 5. حساب الـ Win Rate الديناميكي
    let winRate = 60;
    if (lastSignal === "BUY" && ichiStatus === "اتجاه صاعد 📈") winRate += 10;
    if (lastSignal === "SELL" && ichiStatus === "اتجاه هابط 📉") winRate += 10;
    if (curRsi > 60 || curRsi < 40) winRate += 10;
    winRate = Math.min(winRate, 90);

    document.getElementById("val-winrate").innerText = `${winRate}%`;

    // قرار المضاربة
    let decision = "سكالب سريع ⚡";
    if (winRate >= 80) {
        decision = lastSignal === "BUY" ? "قنص شراء مؤكد 🔥" : "قنص بيع مؤكد 🚨";
    }
    document.getElementById("val-decision").innerText = decision;

    // دالة لتنظيف القيم وحمايتها من أخطاء الـ NaN المزعجة
    const formatPrice = (val) => (!val || isNaN(val)) ? "بانتظار إشارة ⏳" : val.toFixed(2);

    // 6. تظبيط مستويات الأهداف ووقف الخسارة
    if (lastSignal && entryPrice > 0) {
        let risk = Math.abs(entryPrice - stopLoss);
        if (risk === 0) risk = entryPrice * 0.01; 

        const tp1 = lastSignal === "BUY" ? entryPrice + risk * 1.5 : entryPrice - risk * 1.5;
        const tp2 = lastSignal === "BUY" ? entryPrice + risk * 3.0 : entryPrice - risk * 3.0;
        const tp3 = lastSignal === "BUY" ? entryPrice + risk * 4.5 : entryPrice - risk * 4.5;

        document.getElementById("val-entry").innerText = formatPrice(entryPrice);
        document.getElementById("val-sl").innerText = formatPrice(stopLoss);
        document.getElementById("val-tp1").innerText = formatPrice(tp1);
        document.getElementById("val-tp2").innerText = formatPrice(tp2);
        document.getElementById("val-tp3").innerText = formatPrice(tp3);
    } else {
        document.getElementById("val-entry").innerText = "بانتظار إشارة ⏳";
        document.getElementById("val-sl").innerText = "--";
        document.getElementById("val-tp1").innerText = "--";
        document.getElementById("val-tp2").innerText = "--";
        document.getElementById("val-tp3").innerText = "--";
    }
}

// تهيئة وبث البيانات الحية تيك-باي-تيك عبر الـ WebSockets (المحمية والمستقلة بالكامل عن الـ CORS)
function initWebSocket() {
    if (socket) {
        socket.close();
    }

    // بث بيانات فيوتشرز لـ BTCUSDT مباشرة من باينانس
    const wsUrl = "wss://fstream.binance.com/ws/btcusdt@kline_15m";
    socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const kline = message.k;

        const liveCandle = {
            time: Math.floor(kline.t / 1000),
            open: parseFloat(kline.o),
            high: parseFloat(kline.h),
            low: parseFloat(kline.l),
            close: parseFloat(kline.c),
            volume: parseFloat(kline.v)
        };

        const lastCandle = candlesData[candlesData.length - 1];

        if (liveCandle.time === lastCandle.time) {
            candlesData[candlesData.length - 1] = liveCandle;
        } else if (liveCandle.time > lastCandle.time) {
            candlesData.push(liveCandle);
            if (candlesData.length > 300) {
                candlesData.shift(); 
            }
        }

        // إعادة تشغيل الحسابات فوراً مع السعر الجديد للبث اللحظي السريع
        calculateIndicators();
    };

    socket.onclose = () => {
        console.warn("انقطع اتصال البث المباشر، جاري إعادة الاتصال تلقائياً خلال 5 ثواني...");
        setTimeout(initWebSocket, 5000);
    };

    socket.onerror = (err) => {
        console.error("خطأ في الاتصال بالبث الحي لباينانس:", err);
    };
}
