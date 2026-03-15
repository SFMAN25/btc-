// بيانات ذكية متغيرة
const aiDatabase = {
    crypto: {
        symbol: "BINANCE:BTCUSDT",
        news: ["J.P. Morgan: زيادة في تدفقات السيولة المؤسسية نحو صناديق البيتكوين.", "BlackRock: توقعات باستمرار الزخم الصاعد نتيجة تقليص العرض في المنصات."],
        tips: ["استخدم RSI لتحديد مناطق التشبع فوق 70", "راقب تقاطع MACD على فريم 4 ساعات", "فعل Bollinger Bands لمراقبة الانفجار السعري"]
    },
    gold: {
        symbol: "OANDA:XAUUSD",
        news: ["Goldman Sachs: الذهب يتجه لمستويات تاريخية جديدة كملاذ آمن.", "البنوك المركزية تزيد من وتيرة شراء الذهب المادي بنسبة 15%."],
        tips: ["راقب مستويات الدعم عند 2050", "المتوسط المتحرك 200 يوم هو مفتاح الاتجاه", "استخدم Pivot Points للمضاربة اليومية"]
    },
    forex: {
        symbol: "FX:EURUSD",
        news: ["المركزي الأوروبي: تثبيت الفائدة يدعم قوة اليورو أمام الدولار.", "توقعات بتقلبات حادة مع صدور بيانات التوظيف الأمريكية."],
        tips: ["راقب أخبار المفكرة الاقتصادية لحظياً", "مؤشر ATR مهم جداً لتحديد الهدف اليومي", "تجنب التداول وقت صدور الأخبار الكبرى"]
    }
};

function initPlatform(marketType) {
    const data = aiDatabase[marketType];
    
    // 1. الشارت الأساسي (كبير)
    new TradingView.widget({
        "autosize": true, "symbol": data.symbol, "interval": "60", "theme": "dark",
        "style": "1", "locale": "ar", "container_id": "tradingview_main", "hide_side_toolbar": false
    });

    // 2. التحليل الفني (تحت أخبار المؤسسات)
    const techContainer = document.getElementById('tech-summary-container');
    techContainer.innerHTML = '';
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "interval": "1h", "width": "100%", "isTransparent": true, "height": 300,
        "symbol": data.symbol, "showIntervalTabs": true, "locale": "ar", "colorTheme": "dark"
    });
    techContainer.appendChild(script);

    // 3. تحديث محتوى الـ AI
    document.getElementById('bank-feed').innerHTML = data.news.map(n => `<div class="news-item-ai">${n}</div>`).join('');
    document.getElementById('ai-tips-list').innerHTML = data.tips.map(t => `<li><i class="fas fa-check-circle"></i> ${t}</li>`).join('');

    updateSignal();
}

function updateSignal() {
    const needle = document.getElementById('needle');
    const label = document.getElementById('signal-label');
    const val = Math.random();
    
    if(val > 0.5) {
        needle.style.transform = `rotate(${val * 90}deg)`;
        label.innerText = "صاعد / BULLISH";
        label.style.color = "var(--green)";
    } else {
        needle.style.transform = `rotate(-${(1-val) * 90}deg)`;
        label.innerText = "هابط / BEARISH";
        label.style.color = "var(--red)";
    }
}

// تشغيل شريط الأسعار والأخبار العالمية لمرة واحدة
function initGlobalWidgets() {
    // شريط الأسعار
    const tickerScript = document.createElement('script');
    tickerScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-tickers.js";
    tickerScript.innerHTML = JSON.stringify({
        "symbols": [{"proName": "BINANCE:BTCUSDT"}, {"proName": "BINANCE:ETHUSDT"}, {"proName": "FX:EURUSD"}, {"proName": "OANDA:XAUUSD"}],
        "colorTheme": "dark", "isTransparent": true, "locale": "ar"
    });
    document.getElementById('tv-ticker-widget').appendChild(tickerScript);

    // الأخبار العالمية
    const newsScript = document.createElement('script');
    newsScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    newsScript.innerHTML = JSON.stringify({ "feedMode": "all_symbols", "colorTheme": "dark", "width": "100%", "height": "100%", "locale": "ar" });
    document.getElementById('global-news-widget').appendChild(newsScript);
}

document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        btn.classList.add('active');
        initPlatform(btn.dataset.type);
    });
});

window.onload = () => {
    initPlatform('crypto');
    initGlobalWidgets();
};
