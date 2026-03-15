const marketInsights = {
    "BINANCE:BTCUSDT": {
        news: [
            { source: "FED Update", msg: "توقعات الفيدرالي بتثبيت الفائدة تدعم استمرار السيولة في الكريبتو." },
            { source: "J.P. Morgan", msg: "زيادة في تدفقات السيولة المؤسسية نحو البيتكوين هذا الأسبوع." }
        ],
        tips: ["مؤشر RSI يظهر زخم شرائي قوي", "استخدم MACD لمراقبة التقاطع الإيجابي", "راقب مستوى 65,000"]
    },
    "FX:EURUSD": {
        news: [
            { source: "ECB", msg: "المركزي الأوروبي يراقب معدلات التضخم بدقة." },
            { source: "Goldman Sachs", msg: "توقعات بحركة عرضية لزوج اليورو/دولار بانتظار بيانات التوظيف." }
        ],
        tips: ["مؤشر الاستوكاستك يقع في منطقة تشبع بيعي", "راقب مستوى الدعم 1.0800"]
    },
    "OANDA:XAUUSD": {
        news: [
            { source: "Global Reserve", msg: "البنوك المركزية تزيد من احتياطيات الذهب كملاذ آمن." },
            { source: "Market Pulse", msg: "التوترات الجيوسياسية تدفع الذهب لاختبار قمم تاريخية." }
        ],
        tips: ["الذهب يتداول فوق EMA 200", "مؤشر RSI يقترب من منطقة تشبع شرائي"]
    }
};

function updateDashboard(symbol) {
    document.getElementById('tv_main_chart').innerHTML = '';
    new TradingView.widget({
        "autosize": true, "symbol": symbol, "interval": "60", "timezone": "Etc/UTC",
        "theme": "dark", "style": "1", "locale": "ar_AE", "enable_publishing": false,
        "backgroundColor": "#181a20", "gridColor": "#2b3139", "container_id": "tv_main_chart"
    });

    document.getElementById('tv_indicators_chart').innerHTML = '';
    new TradingView.widget({
        "autosize": true, "symbol": symbol, "interval": "60", "timezone": "Etc/UTC",
        "theme": "dark", "style": "3", "locale": "ar_AE", "enable_publishing": false,
        "backgroundColor": "#181a20", "gridColor": "#2b3139", "hide_top_toolbar": true,
        "hide_legend": true, "hide_side_toolbar": true, 
        "studies": ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
        "container_id": "tv_indicators_chart"
    });

    const data = marketInsights[symbol] || marketInsights["BINANCE:BTCUSDT"];
    document.getElementById('ai-news-feed').innerHTML = data.news.map(n => `
        <div class="bank-news-item">
            <b style="color:var(--gold); display:block; margin-bottom:4px;"><i class="fas fa-university"></i> ${n.source}</b>
            ${n.msg}
        </div>
    `).join('');

    document.getElementById('indicator-tips').innerHTML = data.tips.map(t => `
        <li><i class="fas fa-check"></i> ${t}</li>
    `).join('');

    const techBox = document.getElementById('tv-technical-analysis');
    techBox.innerHTML = '';
    const scriptTech = document.createElement('script');
    scriptTech.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    scriptTech.async = true;
    scriptTech.innerHTML = JSON.stringify({
        "interval": "1h", "width": "100%", "height": "100%", "symbol": symbol,
        "showIntervalTabs": true, "locale": "ar_AE", "colorTheme": "dark"
    });
    techBox.appendChild(scriptTech);

    const newsBox = document.getElementById('tv-news-timeline');
    newsBox.innerHTML = '';
    const scriptNews = document.createElement('script');
    scriptNews.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    scriptNews.async = true;
    scriptNews.innerHTML = JSON.stringify({
        "feedMode": "all_symbols", "colorTheme": "dark", "width": "100%", "height": "100%", "locale": "ar_AE"
    });
    newsBox.appendChild(scriptNews);

    simulateAIGauge();
}

function simulateAIGauge() {
    const needle = document.getElementById('gauge-needle');
    const aiText = document.getElementById('ai-text');
    const aiPercent = document.getElementById('ai-percent');
    
    let isBullish = Math.random() > 0.4;
    let confidence = Math.floor(Math.random() * (95 - 75 + 1) + 75); 
    aiPercent.innerText = confidence + "%";

    if (isBullish) {
        let angle = Math.floor(Math.random() * (85 - 10 + 1) + 10);
        needle.style.transform = `rotate(${angle}deg)`;
        aiText.innerText = "صاعد / Bullish";
        aiText.style.color = "#0ecb81";
    } else {
        let angle = Math.floor(Math.random() * (-10 - -85 + 1) - 85);
        needle.style.transform = `rotate(${angle}deg)`;
        aiText.innerText = "هابط / Bearish";
        aiText.style.color = "#f6465d";
    }
}

document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        updateDashboard(this.getAttribute('data-symbol'));
    });
});

window.onload = () => updateDashboard("BINANCE:BTCUSDT");
