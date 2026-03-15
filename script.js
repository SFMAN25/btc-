const CONFIG = {
    crypto: { symbol: "BINANCE:BTCUSDT", news: ["زيادة التدفقات نحو صناديق البيتكوين.", "اختراق مستويات مقاومة تاريخية."], tips: ["RSI فوق 70 = حذر", "تقاطع MACD صاعد"] },
    forex: { symbol: "FX:EURUSD", news: ["استقرار اليورو أمام الدولار.", "ترقب اجتماع المركزي الأوروبي."], tips: ["دعم قوي عند 1.0850", "تجنب وقت الأخبار"] },
    gold: { symbol: "OANDA:XAUUSD", news: ["الذهب يختبر مناطق الـ 2100 دولار.", "طلب متزايد كملاذ آمن."], tips: ["راقب الـ Bollinger Bands", "مستوى 2050 حيوي"] }
};

let currentWidget = null;

// وظيفة التنبيه الصوتي
function playAlert(color) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.frequency.value = (color === 'green') ? 880 : 440; // نغمة حادة للأخضر
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1);
    osc.stop(audioCtx.currentTime + 1);
}

function updateUI(mode) {
    const data = CONFIG[mode];
    
    // 1. الشارت (الملء التلقائي)
    if (currentWidget) document.getElementById('tradingview_widget').innerHTML = '';
    currentWidget = new TradingView.widget({
        "autosize": true, "symbol": data.symbol, "interval": "60", "theme": "dark",
        "style": "1", "locale": "ar", "container_id": "tradingview_widget", "hide_side_toolbar": false
    });

    // 2. التحليل الفني
    const techBox = document.getElementById('tv-tech-summary');
    techBox.innerHTML = '';
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.innerHTML = JSON.stringify({ "interval": "1h", "width": "100%", "isTransparent": true, "height": "100%", "symbol": data.symbol, "locale": "ar", "colorTheme": "dark" });
    techBox.appendChild(script);

    // 3. المحتوى والنصوص
    document.getElementById('ai-news-feed').innerHTML = data.news.map(n => `<div style="margin-bottom:8px; border-right:3px solid var(--gold); padding-right:8px;">${n}</div>`).join('');
    document.getElementById('indicator-tips').innerHTML = data.tips.map(t => `<li style="margin-bottom:8px; font-size:12px;"><i class="fas fa-check-circle" style="color:var(--green)"></i> ${t}</li>`).join('');

    processAIAnalytics();
}

function processAIAnalytics() {
    const val = Math.random();
    const ptr = document.getElementById('gauge-ptr');
    const result = document.getElementById('ai-signal-result');
    
    if (val > 0.6) {
        ptr.style.transform = `rotate(0.4turn)`;
        result.innerText = "صعود قوي / BUY"; result.style.color = "var(--green)";
        playAlert('green');
    } else if (val > 0.3) {
        ptr.style.transform = `rotate(0.25turn)`;
        result.innerText = "تنبيه / WARNING"; result.style.color = "#f1c40f";
        playAlert('yellow');
    } else {
        ptr.style.transform = `rotate(0.1turn)`;
        result.innerText = "هبوط / SELL"; result.style.color = "var(--red)";
    }
}

document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateUI(btn.dataset.type);
    });
});

window.onload = () => {
    updateUI('crypto');
    const newsScript = document.createElement('script');
    newsScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    newsScript.innerHTML = JSON.stringify({ "feedMode": "all_symbols", "colorTheme": "dark", "width": "100%", "height": "100%", "locale": "ar" });
    document.getElementById('tv-news-timeline').appendChild(newsScript);
};
