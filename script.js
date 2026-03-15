const marketData = {
    "BINANCE:BTCUSDT": {
        news: [
            { source: "FED", msg: "الفيدرالي يلمح لثبات الفائدة، مما يدعم استمرار زخم الكريبتو." },
            { source: "JP Morgan", msg: "توقعات بدخول سيولة ضخمة من صناديق التحوط للسوق الأسبوع القادم." }
        ],
        tips: ["استخدم RSI لمراقبة مناطق التشبع فوق 70", "تقاطع MACD إيجابي على فريم 4 ساعات", "راقب مستوى الدعم عند 62,000"]
    },
    "FX:EURUSD": {
        news: [
            { source: "ECB", msg: "بيانات التضخم الأوروبية تشير لثبات اليورو أمام الدولار حالياً." },
            { source: "Goldman Sachs", msg: "توقعات بكسر مستويات المقاومة في حال استمرار ضعف مؤشر الدولار." }
        ],
        tips: ["فعل Bollinger Bands لمراقبة ضيق الانفجار السعري", "مؤشر الاستوكاستك في مناطق تشبع بيعي", "راقب مستوى 1.0820"]
    },
    "OANDA:XAUUSD": {
        news: [
            { source: "Central Banks", msg: "تزايد الطلب الفعلي على الذهب من بنوك آسيا المركزية." },
            { source: "Global Pulse", msg: "التوترات الجيوسياسية تدفع الذهب لاختبار قمم تاريخية جديدة." }
        ],
        tips: ["الذهب في اتجاه صاعد قوي فوق EMA 200", "RSI يقترب من منطقة مبالغة في الشراء", "استخدم فيبوناتشي لتحديد الارتداد"]
    }
};

let currentChart = null;

function initPlatform(symbol) {
    // 1. الشارت الرئيسي (الحجم الكبير)
    if (currentChart) { document.getElementById('tv_main_chart').innerHTML = ''; }
    currentChart = new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "60",
        "theme": "dark",
        "style": "1",
        "locale": "ar",
        "container_id": "tv_main_chart"
    });

    // 2. تحديث المحتوى الديناميكي
    updateAIContent(symbol);
    
    // 3. تحديث الملخص الفني (الذي تم نقله للمنتصف)
    updateTechnicalWidget(symbol);
    
    // 4. تحديث التايم لاين الجانبي
    updateNewsTimeline();
}

function updateAIContent(symbol) {
    const data = marketData[symbol] || marketData["BINANCE:BTCUSDT"];
    
    const newsFeed = document.getElementById('ai-news-feed');
    newsFeed.innerHTML = data.news.map(n => `
        <div class="news-item" style="background:#161a25; padding:10px; border-radius:6px; margin-bottom:8px; border-right:4px solid var(--gold);">
            <b style="color:var(--gold); font-size:11px;">${n.source} Analysis</b>
            <p style="font-size:13px; margin:5px 0;">${n.msg}</p>
        </div>
    `).join('');

    const tipsList = document.getElementById('indicator-tips');
    tipsList.innerHTML = data.tips.map(t => `<li><i class="fas fa-check"></i> ${t}</li>`).join('');

    simulateGauge();
}

function updateTechnicalWidget(symbol) {
    const container = document.getElementById('tv-tech-summary-content');
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "interval": "1h", "width": "100%", "height": "350",
        "symbol": symbol, "showIntervalTabs": true, "locale": "ar", "colorTheme": "dark"
    });
    container.appendChild(script);
}

function updateNewsTimeline() {
    const container = document.getElementById('tv-news-timeline');
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "feedMode": "all_symbols", "colorTheme": "dark", "width": "100%", "height": "600", "locale": "ar"
    });
    container.appendChild(script);
}

function simulateGauge() {
    const ptr = document.getElementById('gauge-ptr');
    const res = document.getElementById('ai-signal-result');
    const conf = document.getElementById('ai-confidence');
    const val = Math.random();
    
    conf.innerText = Math.floor(val * 20 + 78) + "%";
    
    if(val > 0.5) {
        ptr.style.transform = `rotate(0.4turn)`;
        res.innerText = "صاعد / BUY";
        res.style.color = "#0ecb81";
    } else {
        ptr.style.transform = `rotate(0.1turn)`;
        res.innerText = "هابط / SELL";
        res.style.color = "#f6465d";
    }
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        initPlatform(this.getAttribute('data-symbol'));
    });
});

window.onload = () => initPlatform("BINANCE:BTCUSDT");
