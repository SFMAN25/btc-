const marketSettings = {
    "BINANCE:BTCUSDT": {
        news: ["FED: توقعات بتثبيت الفائدة تدعم العملات الرقمية.", "J.P. MORGAN: زيادة تدفقات السيولة نحو البيتكوين هذا الأسبوع."],
        tips: ["تجاوز RSI مستوى 60 إشارة زخم", "راقب تقاطع المتوسطات السعرية"]
    },
    "FX:EURUSD": {
        news: ["ECB: البنك الأوروبي يراقب معدلات التضخم بدقة.", "توقعات باستقرار اليورو مقابل الدولار حالياً."],
        tips: ["مؤشر الاستوكاستك في مناطق تشبع", "راقب كسر الدعم عند 1.0820"]
    }
};

function updateDashboard(symbol) {
    // 1. إعادة بناء الشارت الكبير
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

    // 2. تحديث أخبار المؤسسات والمؤشرات
    const data = marketSettings[symbol] || marketSettings["BINANCE:BTCUSDT"];
    document.getElementById('ai-news-feed').innerHTML = data.news.map(n => `<div class="bank-news-item">${n}</div>`).join('');
    document.getElementById('indicator-tips').innerHTML = data.tips.map(t => `<li><i class="fas fa-check" style="color:var(--gold)"></i> ${t}</li>`).join('');

    // 3. تحديث ملخص التحليل الفني (تحت أخبار البنوك)
    const techContainer = document.getElementById('tv-technical-analysis');
    techContainer.innerHTML = '';
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "interval": "1h", "width": "100%", "height": "100%",
        "symbol": symbol, "showIntervalTabs": true, "locale": "ar_AE", "colorTheme": "dark"
    });
    techContainer.appendChild(script);

    // 4. تحديث التايم لاين الجانبي
    const newsDiv = document.getElementById('tv-news-timeline');
    newsDiv.innerHTML = '';
    const newsScript = document.createElement('script');
    newsScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    newsScript.async = true;
    newsScript.innerHTML = JSON.stringify({
        "feedMode": "all_symbols", "colorTheme": "dark", "width": "100%", "height": "100%", "locale": "ar_AE"
    });
    newsDiv.appendChild(newsScript);
}

// تشغيل الأزرار
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        updateDashboard(this.getAttribute('data-symbol'));
    });
});

window.onload = () => updateDashboard("BINANCE:BTCUSDT");
