const BODA_AI_CONFIG = {
    crypto: { symbol: "BINANCE:BTCUSDT", news: ["تدفقات مؤسسية ضخمة نحو BTC.", "الفيدرالي قد يثبت الفائدة مما يدعم الكريبتو."], tips: ["RSI تحت 30 = فرصة", "MACD إيجابي"] },
    forex: { symbol: "FX:EURUSD", news: ["اليورو يتماسك أمام الدولار.", "ترقب بيانات التضخم الأوروبية."], tips: ["EMA 200 هو دعمك", "ATR مرتفع"] },
    gold: { symbol: "OANDA:XAUUSD", news: ["الذهب يختبر مناطق مقاومة تاريخية.", "طلب بنكي مركزي متزايد."], tips: ["Fibonacci 0.618 مهم", "ملاذ آمن قوي"] }
};

let currentWidget = null;

// التنبيهات الصوتية الذكية (للمستويات المهمة)
function triggerAudioAlert(color) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    
    osc.frequency.value = (color === 'green') ? 880 : 440; // نغمة حادة للأخضر، هادئة للأصفر
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1);
    osc.stop(audioCtx.currentTime + 1);
}

function updateTerminal(mode) {
    const data = BODA_AI_CONFIG[mode];
    
    // 1. الشارت (Autosize)
    if (currentWidget) document.getElementById('main-tradingview-chart').innerHTML = '';
    currentWidget = new TradingView.widget({
        "autosize": true, "symbol": data.symbol, "interval": "60", "theme": "dark",
        "style": "1", "locale": "ar", "container_id": "main-tradingview-chart", "hide_side_toolbar": false
    });

    // 2. التحليل الفني
    const techBox = document.getElementById('tech-analysis-widget');
    techBox.innerHTML = '';
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.innerHTML = JSON.stringify({ "interval": "1h", "width": "100%", "isTransparent": true, "height": "100%", "symbol": data.symbol, "locale": "ar", "colorTheme": "dark" });
    techBox.appendChild(script);

    // 3. المحتوى
    document.getElementById('ai-news-content').innerHTML = data.news.map(n => `<div style="margin-bottom:8px;">• ${n}</div>`).join('');
    document.getElementById('ai-tips-list').innerHTML = data.tips.map(t => `<li>${t}</li>`).join('');

    processAIAnalytics();
}

function processAIAnalytics() {
    const needle = document.getElementById('needle');
    const signalTxt = document.getElementById('signal-text');
    const val = Math.random();

    if (val > 0.6) {
        needle.style.transform = `rotate(${val * 120}deg)`;
        signalTxt.innerText = "صعود قوي / BUY";
        signalTxt.style.color = "var(--green)";
        triggerAudioAlert('green');
    } else if (val > 0.3) {
        needle.style.transform = `rotate(${val * 90}deg)`;
        signalTxt.innerText = "تنبيه / WARNING";
        signalTxt.style.color = "#f1c40f"; // أصفر
        triggerAudioAlert('yellow');
    } else {
        needle.style.transform = `rotate(0deg)`;
        signalTxt.innerText = "هبوط / SELL";
        signalTxt.style.color = "var(--red)";
    }
}

// تشغيل الويدجت الثابتة
function initStatic() {
    const ticker = document.createElement('script');
    ticker.src = "https://s3.tradingview.com/external-embedding/embed-widget-tickers.js";
    ticker.innerHTML = JSON.stringify({ "symbols": [{"proName": "BINANCE:BTCUSDT"}, {"proName": "FX:EURUSD"}, {"proName": "OANDA:XAUUSD"}], "colorTheme": "dark", "isTransparent": true, "locale": "ar" });
    document.getElementById('tv-ticker-widget').appendChild(ticker);

    const news = document.createElement('script');
    news.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    news.innerHTML = JSON.stringify({ "feedMode": "all_symbols", "colorTheme": "dark", "width": "100%", "height": "100%", "locale": "ar" });
    document.getElementById('global-news').appendChild(news);
}

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateTerminal(btn.dataset.type);
    });
});

window.onload = () => { initStatic(); updateTerminal('crypto'); };
