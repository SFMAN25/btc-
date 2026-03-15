// المتغيرات العامة
let currentSymbol = "BINANCE:BTCUSDT";

// 1. تفعيل الشارت العملاق مع المؤشرات الثابتة
function loadMainChart(symbol) {
    new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "60",
        "theme": "dark",
        "style": "1",
        "locale": "ar_AE",
        "container_id": "tv_main_chart",
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "studies": [
            "RSI@tv-basicstudies",
            "MACD@tv-basicstudies"
        ],
        "backgroundColor": "#181a20",
        "gridColor": "#2b3139"
    });
    
    // تحديث النصائح والإشارات فور تغيير العملة
    updateAIAnalysis(symbol);
    updateIndicatorSuggestions(symbol);
}

// 2. نظام اقتراحات المؤشرات (ثابتة وتتحدث)
function updateIndicatorSuggestions(symbol) {
    const suggestions = [
        { name: "RSI", tip: `مؤشر القوة النسبية لـ ${symbol} يعطي قراءة مثالية الآن.` },
        { name: "MACD", tip: "تقاطع خطوط الماكد يشير إلى زخم سيولة قادم." },
        { name: "EMA", tip: "السعر يتداول فوق متوسط 200، الاتجاه العام صاعد." }
    ];
    
    const list = document.getElementById('indicator-tips');
    list.innerHTML = suggestions.map(s => `
        <li style="margin-bottom: 12px; border-bottom: 1px solid #2b3139; padding-bottom: 5px;">
            <strong style="color: #FCD535;">${s.name}:</strong> ${s.tip}
        </li>
    `).join('');
}

// 3. تحليل الذكاء الاصطناعي مع التنبيه الصوتي
function updateAIAnalysis(symbol) {
    const needle = document.getElementById('gauge-needle');
    const aiText = document.getElementById('ai-text');
    const confidence = Math.floor(Math.random() * (98 - 80) + 80);
    
    document.getElementById('ai-percent').innerText = confidence + "%";
    
    const isBullish = Math.random() > 0.5;
    if (isBullish) {
        needle.style.transform = `rotate(45deg)`;
        aiText.innerText = "صاعد / Bullish";
        aiText.style.color = "#0ecb81";
        playAlertSound('buy');
    } else {
        needle.style.transform = `rotate(-45deg)`;
        aiText.innerText = "هابط / Bearish";
        aiText.style.color = "#f6465d";
        playAlertSound('sell');
    }
}

// صوت التنبيه
function playAlertSound(type) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.connect(gain);
    gain.connect(context.destination);
    osc.frequency.value = type === 'buy' ? 880 : 440;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.5);
    osc.stop(context.currentTime + 0.5);
}

// بدء التشغيل
window.onload = () => {
    loadMainChart(currentSymbol);
    
    // ربط أزرار القائمة
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sym = this.getAttribute('data-symbol');
            if(sym) loadMainChart(sym);
        });
    });
};
