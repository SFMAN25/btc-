// بيانات لمحاكاة الأخبار المؤسسية واقتراحات المؤشرات
const marketData = {
    "BINANCE:BTCUSDT": {
        news: [{ s: "FED", m: "الفيدرالي يلمح لثبات الفائدة، مما يدعم زخم البيتكوين." }, { s: "JP Morgan", m: "توقعات بدخول سيولة مؤسسية ضخمة هذا الأسبوع." }],
        tips: ["مؤشر RSI فوق 60 - زخم صاعد", "تقاطع MACD إيجابي", "راقب دعم 65,000"]
    },
    "FX:EURUSD": {
        news: [{ s: "ECB", m: "البنك المركزي الأوروبي يراقب التضخم، واليورو يستقر." }, { s: "BofA", m: "توقعات بحركة عرضية لزوج EUR/USD." }],
        tips: ["مؤشر الاستوكاستك في تشبع بيعي", "راقب كسر مستوى 1.0850", "ضعف في التقلبات السعرية"]
    },
    "OANDA:XAUUSD": {
        news: [{ s: "Gold Council", m: "زيادة طلب البنوك المركزية على الذهب كملاذ آمن." }, { s: "Goldman Sachs", m: "توقعات بوصول الذهب لقمم تاريخية جديدة." }],
        tips: ["الاتجاه العام صاعد فوق EMA 200", "RSI يقترب من تشبع شرائي", "استخدم فيبوناتشي لتحديد الأهداف"]
    }
};

function updateDashboard(symbol) {
    // 1. تحديث الشارت الرئيسي [cite: 120]
    document.getElementById('tv_main_chart').innerHTML = '';
    new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "60",
        "theme": "dark",
        "style": "1",
        "locale": "ar_AE",
        "container_id": "tv_main_chart"
    });

    // 2. تحديث الأخبار والاقتراحات
    const data = marketData[symbol] || marketData["BINANCE:BTCUSDT"];
    document.getElementById('ai-news-feed').innerHTML = data.news.map(n => `
        <div class="bank-news-item"><b>${n.s}:</b> ${n.m}</div>
    `).join('');
    
    document.getElementById('indicator-tips').innerHTML = data.tips.map(t => `
        <li style="margin-bottom:8px;"><i class="fas fa-check-circle" style="color:var(--gold);"></i> ${t}</li>
    `).join('');

    // 3. تحديث ملخص التحليل الفني (تحت الأخبار) [cite: 107, 108]
    const techContainer = document.getElementById('tv-tech-analysis-content');
    techContainer.innerHTML = '';
    const techScript = document.createElement('script');
    techScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    techScript.async = true;
    techScript.innerHTML = JSON.stringify({
        "interval": "1h", "width": "100%", "height": "100%",
        "symbol": symbol, "showIntervalTabs": true, "locale": "ar_AE", "colorTheme": "dark"
    });
    techContainer.appendChild(techScript);

    // 4. تحديث التايم لاين الجانبي [cite: 113]
    const newsContainer = document.getElementById('tv-news-timeline');
    newsContainer.innerHTML = '';
    const newsScript = document.createElement('script');
    newsScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    newsScript.async = true;
    newsScript.innerHTML = JSON.stringify({
        "feedMode": "all_symbols", "colorTheme": "dark", "width": "100%", "height": "100%", "locale": "ar_AE"
    });
    newsContainer.appendChild(newsScript);
}

// ربط أزرار التنقل [cite: 130]
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        updateDashboard(this.getAttribute('data-symbol'));
    });
});

window.onload = () => updateDashboard("BINANCE:BTCUSDT");
