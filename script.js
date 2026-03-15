const AI_MARKET_DATA = {
    crypto: {
        symbol: "BINANCE:BTCUSDT",
        news: [
            "J.P. Morgan: تزايد اهتمام المؤسسات الكبرى بتكديس البيتكوين عند مستويات الدعم الحالية.",
            "توقعات بتدفق سيولة ضخمة إلى صناديق ETFs خلال الربع القادم."
        ],
        tips: ["RSI: تشبع بيعي محتمل تحت 30", "MACD: راقب تقاطع الخطوط على فريم الساعة", "Bollinger: السعر يختبر النطاق السفلي"]
    },
    forex: {
        symbol: "FX:EURUSD",
        news: [
            "Goldman Sachs: اليورو يظهر قوة أمام الدولار مع ترقب قرارات البنك المركزي الأوروبي.",
            "الفيدرالي الأمريكي يلمح لسياسات نقدية أكثر مرونة."
        ],
        tips: ["استخدم EMA 50 لتحديد الاتجاه", "ATR: تقلبات عالية متوقعة", "Fibonacci: ارتداد محتمل من مستوى 0.618"]
    },
    gold: {
        symbol: "OANDA:XAUUSD",
        news: [
            "البنوك المركزية العالمية تزيد احتياطياتها من الذهب كملاذ آمن.",
            "Morgan Stanley: الذهب يتجه لاختراق مستويات مقاومة تاريخية."
        ],
        tips: ["راقب مستوى 2050 كدعم محوري", "Stochastic: تقاطع إيجابي في منطقة التشبع", "تشكل نموذج الكأس والعروة على اليومي"]
    }
};

let currentChart = null;

function playSignalSound(type) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'green') {
        oscillator.frequency.value = 880; // نغمة حادة للشراء
    } else {
        oscillator.frequency.value = 440; // نغمة تنبيهية للمستويات الصفراء
    }

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1);
    oscillator.stop(audioCtx.currentTime + 1);
}

function updatePlatform(key) {
    const data = AI_MARKET_DATA[key];

    // 1. الشارت
    if (currentChart) document.getElementById('tradingview_main_chart').innerHTML = '';
    currentChart = new TradingView.widget({
        "autosize": true, "symbol": data.symbol, "interval": "60", "theme": "dark",
        "style": "1", "locale": "ar", "container_id": "tradingview_main_chart", "hide_side_toolbar": false
    });

    // 2. التحليل الفني (Widget)
    const techBox = document.getElementById('technical-summary-widget');
    techBox.innerHTML = '';
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "interval": "1h", "width": "100%", "isTransparent": true, "height": "100%",
        "symbol": data.symbol, "showIntervalTabs": true, "locale": "ar", "colorTheme": "dark"
    });
    techBox.appendChild(script);

    // 3. محتوى AI
    document.getElementById('institutional-feed').innerHTML = data.news.map(n => `<div style="margin-bottom:10px; border-right:2px solid var(--accent); padding-right:8px;">${n}</div>`).join('');
    document.getElementById('ai-indicator-tips').innerHTML = data.tips.map(t => `<li><i class="fas fa-magic"></i> ${t}</li>`).join('');

    processSignal();
}

function processSignal() {
    const needle = document.getElementById('signal-needle');
    const output = document.getElementById('signal-output');
    const val = Math.random();
    
    document.getElementById('trend-power').innerText = Math.floor(Math.random() * 20 + 80) + "%";
    document.getElementById('conf-power').innerText = Math.floor(Math.random() * 15 + 75) + "%";

    if (val > 0.6) {
        needle.style.transform = `rotate(${val * 90}deg)`;
        output.innerText = "صاعد / BULLISH";
        output.style.color = "var(--green)";
        playSignalSound('green');
    } else {
        needle.style.transform = `rotate(-${(1 - val) * 90}deg)`;
        output.innerText = "هابط / BEARISH";
        output.style.color = "var(--red)";
        playSignalSound('yellow');
    }
}

function initTickers() {
    const tickerScript = document.createElement('script');
    tickerScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-tickers.js";
    tickerScript.innerHTML = JSON.stringify({
        "symbols": [{"proName": "BINANCE:BTCUSDT"}, {"proName": "BINANCE:ETHUSDT"}, {"proName": "FX:EURUSD"}, {"proName": "OANDA:XAUUSD"}],
        "colorTheme": "dark", "isTransparent": true, "locale": "ar"
    });
    document.getElementById('tradingview-ticker').appendChild(tickerScript);

    const newsScript = document.createElement('script');
    newsScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    newsScript.innerHTML = JSON.stringify({ "feedMode": "all_symbols", "colorTheme": "dark", "width": "100%", "height": "100%", "locale": "ar" });
    document.getElementById('tv-news-timeline').appendChild(newsScript);
}

document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        updatePlatform(tab.dataset.type);
    });
});

window.onload = () => {
    updatePlatform('crypto');
    initTickers();
    setInterval(processSignal, 60000); // تحديث الإشارة كل دقيقة
};
