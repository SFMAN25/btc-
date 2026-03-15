let currentWidget = null;

const MARKET_CONFIG = {
    crypto: { symbol: "BINANCE:BTCUSDT", news: ["مؤسسات بنكية كبرى تزيد حيازتها من البيتكوين.", "توقعات باستمرار الزخم الصاعد نتيجة تقليص العرض."], tips: ["استخدم RSI لتحديد مناطق التشبع فوق 70", "راقب تقاطع MACD على فريم 4 ساعات"] },
    forex: { symbol: "FX:EURUSD", news: ["ترقب بيانات التضخم الأوروبية غداً.", "المركزي الأمريكي يلمح لتثبيت الفائدة."], tips: ["مستوى 1.0850 منطقة دعم قوية", "تجنب التداول وقت صدور الأخبار"] },
    gold: { symbol: "OANDA:XAUUSD", news: ["الذهب يرتفع كملاذ آمن وسط التوترات السياسية.", "توقعات بوصول الأونصة لمستويات قياسية جديدة."], tips: ["فعل Bollinger Bands لمراقبة الانفجار السعري", "مستوى 2050 هو مفتاح الصعود القادم"] }
};

// وظيفة إصدار التنبيه الصوتي
function playAlert(type) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.frequency.value = (type === 'buy') ? 880 : 440; // نغمة حادة للشراء، منخفضة للبيع
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1);
    osc.stop(audioCtx.currentTime + 1);
}

function createWidget(symbol) {
    if (currentWidget) document.getElementById('tradingview_widget').innerHTML = '';
    currentWidget = new TradingView.widget({
        "autosize": true, // يضمن تمدد الشارت ليشغل المساحة الضخمة الجديدة
        "symbol": symbol, "interval": "60", "theme": "dark", "style": "1", "locale": "ar",
        "container_id": "tradingview_widget", "hide_side_toolbar": false, "allow_symbol_change": true
    });
    updateSecondaryWidgets(symbol);
}

function updateSecondaryWidgets(symbol) {
    // تحديث الملخص الفني
    const techBox = document.getElementById('tv-tech-summary');
    techBox.innerHTML = '';
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.innerHTML = JSON.stringify({ "interval": "1h", "width": "100%", "isTransparent": true, "height": "100%", "symbol": symbol, "locale": "ar", "colorTheme": "dark" });
    techBox.appendChild(script);
    
    simulateAI(symbol);
}

function simulateAI(symbol) {
    const mode = document.querySelector('.nav-item.active').dataset.type;
    const data = MARKET_CONFIG[mode];
    
    // تحديث النصوص
    document.getElementById('ai-news-feed').innerHTML = data.news.map(n => `<div style="margin-bottom:8px; border-right:2px solid var(--gold); padding-right:8px;">${n}</div>`).join('');
    document.getElementById('indicator-tips').innerHTML = data.tips.map(t => `<li><i class="fas fa-check-circle"></i> ${t}</li>`).join('');
    
    // محاكاة الإشارة
    const val = Math.random();
    const ptr = document.getElementById('gauge-ptr');
    const result = document.getElementById('ai-signal-result');
    
    if (val > 0.5) {
        ptr.style.transform = `rotate(0.4turn)`;
        result.innerText = "صاعد / STRONG BUY"; result.style.color = "var(--green)";
        playAlert('buy');
    } else {
        ptr.style.transform = `rotate(0.1turn)`;
        result.innerText = "هابط / STRONG SELL"; result.style.color = "var(--red)";
        playAlert('sell');
    }
    document.getElementById('trend-val').innerText = Math.floor(Math.random() * 20 + 75) + "%";
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        createWidget(this.dataset.symbol);
    });
});

window.onload = () => {
    createWidget("BINANCE:BTCUSDT");
    const newsScript = document.createElement('script');
    newsScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    newsScript.innerHTML = JSON.stringify({ "feedMode": "all_symbols", "colorTheme": "dark", "width": "100%", "height": "100%", "locale": "ar" });
    document.getElementById('tv-news-timeline').appendChild(newsScript);
};
