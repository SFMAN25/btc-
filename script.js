const marketSettings = {
    "BINANCE:BTCUSDT": {
        news: ["FED: استقرار الفائدة يعزز جاذبية الذهب الرقمي.", "JP Morgan: سيولة ضخمة تدخل السوق عبر صناديق ETF."],
        tips: ["زخم شرائي قوي على RSI", "MACD يعطي تقاطع إيجابي"],
        alerts: [{s:"BTC", p:"65k", a:"Strong Buy"}]
    },
    "FX:EURUSD": {
        news: ["ECB: تلميحات بخفض الفائدة في الصيف تضعف اليورو.", "بيانات التضخم الأمريكية ستحدد اتجاه الزوج القادم."],
        tips: ["تشبع بيعي واضح", "راقب مستوى الدعم 1.0800"],
        alerts: [{s:"EUR/USD", p:"1.08", a:"Wait"}]
    },
    "OANDA:XAUUSD": {
        news: ["الذهب يكسر مستويات تاريخية بسبب التوترات الجيوسياسية.", "البنوك المركزية تواصل تخزين الذهب."],
        tips: ["الاتجاه صاعد فوق EMA 200", "RSI في منطقة تشبع شرائي"],
        alerts: [{s:"Gold", p:"2300", a:"Buy"}]
    }
};

function updateDashboard(symbol) {
    // 1. تحديث الشارت الرئيسي (الأعلى)
    document.getElementById('tv_main_chart').innerHTML = '';
    new TradingView.widget({
        "autosize": true, "symbol": symbol, "interval": "60", "theme": "dark",
        "style": "1", "locale": "ar_AE", "container_id": "tv_main_chart"
    });

    // 2. تحديث مؤشرات RSI & MACD في المنتصف (الأسفل)
    const indicatorsDiv = document.getElementById('tv_indicators_summary');
    indicatorsDiv.innerHTML = '';
    const scriptTech = document.createElement('script');
    scriptTech.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    scriptTech.async = true;
    scriptTech.innerHTML = JSON.stringify({
        "interval": "1h", "width": "100%", "height": "100%",
        "symbol": symbol, "showIntervalTabs": true, "locale": "ar_AE", "colorTheme": "dark"
    });
    indicatorsDiv.appendChild(scriptTech);

    // 3. تحديث أخبار البنوك والاقتراحات
    const data = marketSettings[symbol] || marketSettings["BINANCE:BTCUSDT"];
    document.getElementById('ai-news-feed').innerHTML = data.news.map(n => `<div class="bank-news-item">${n}</div>`).join('');
    document.getElementById('indicator-tips').innerHTML = data.tips.map(t => `<li><i class="fas fa-check" style="color:var(--gold)"></i> ${t}</li>`).join('');

    // 4. تحديث التايم لاين الجانبي
    const timeline = document.getElementById('tv-news-timeline');
    timeline.innerHTML = '';
    const scriptNews = document.createElement('script');
    scriptNews.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    scriptNews.async = true;
    scriptNews.innerHTML = JSON.stringify({
        "feedMode": "all_symbols", "colorTheme": "dark", "width": "100%", "height": "100%", "locale": "ar_AE"
    });
    timeline.appendChild(scriptNews);

    simulateAI();
}

function simulateAI() {
    const needle = document.getElementById('gauge-needle');
    const val = Math.random();
    const angle = val > 0.5 ? 45 : -45;
    needle.style.transform = `rotate(${angle}deg)`;
    document.getElementById('ai-text').innerText = val > 0.5 ? "صاعد / BUY" : "هابط / SELL";
    document.getElementById('ai-percent').innerText = Math.floor(Math.random() * 20 + 75) + "%";
}

// تشغيل أزرار التنقل
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        updateDashboard(this.getAttribute('data-symbol'));
    });
});

window.onload = () => updateDashboard("BINANCE:BTCUSDT");
