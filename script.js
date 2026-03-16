// بيانات السوق مع تحليل تأثير الأخبار
const marketData = {
    "BINANCE:BTCUSDT": {
        tips: ["RSI فوق 60: زخم صاعد قوي", "MACD: تقاطع إيجابي مؤكد", "راقب مستوى الدعم: 64,500$"],
        news: {
            text: "مؤسسة BlackRock تزيد حيازتها من البيتكوين؛ سيولة ضخمة تدخل السوق الآن.",
            impact: "positive",
            percentage: 85
        }
    },
    "FX:EURUSD": {
        tips: ["RSI عند 45: حركة عرضية", "MACD: ضعف في الاتجاه", "المقاومة: 1.0920"],
        news: {
            text: "بيانات التضخم الأمريكية جاءت أعلى من المتوقع، مما يعزز قوة الدولار ويضغط على اليورو.",
            impact: "negative",
            percentage: 65
        }
    },
    "OANDA:XAUUSD": {
        tips: ["RSI فوق 70: تشبع شرائي", "الذهب يختبر قمة تاريخية", "الملاذ الآمن مطلوب بشدة"],
        news: {
            text: "تصاعد التوترات الجيوسياسية يدفع البنوك المركزية لزيادة احتياطيات الذهب كتحوط.",
            impact: "positive",
            percentage: 92
        }
    }
};

function loadWidgets(symbol) {
    // 1. الشارت الرئيسي
    document.getElementById('tv_main_chart').innerHTML = '';
    new TradingView.widget({
        "autosize": true, "symbol": symbol, "interval": "60", "theme": "dark",
        "style": "1", "locale": "ar_AE", "container_id": "tv_main_chart"
    });

    // 2. شارت المؤشرات (RSI & MACD) في المنتصف
    document.getElementById('tv_indicators_chart').innerHTML = '';
    new TradingView.widget({
        "autosize": true, "symbol": symbol, "interval": "60", "theme": "dark",
        "style": "3", "locale": "ar_AE", "studies": ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
        "container_id": "tv_indicators_chart", "hide_top_toolbar": true
    });

    // 3. التقييم الفني
    const techDiv = document.getElementById('tv_tech_rating');
    techDiv.innerHTML = '';
    const techScript = document.createElement('script');
    techScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    techScript.async = true;
    techScript.innerHTML = JSON.stringify({
        "interval": "1h", "width": "100%", "height": "100%", "symbol": symbol, "showIntervalTabs": true, "locale": "ar_AE", "colorTheme": "dark"
    });
    techDiv.appendChild(techScript);

    // 4. أخبار المال المباشرة
    const newsDiv = document.getElementById('tv_news_timeline');
    newsDiv.innerHTML = '';
    const newsScript = document.createElement('script');
    newsScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    newsScript.async = true;
    newsScript.innerHTML = JSON.stringify({
        "feedMode": "all_symbols", "colorTheme": "dark", "width": "100%", "height": "100%", "locale": "ar_AE"
    });
    newsDiv.appendChild(newsScript);

    // 5. تحديث الاقتراحات ونبض السوق (AI Sentiment)
    const info = marketData[symbol] || marketData["BINANCE:BTCUSDT"];
    
    document.getElementById('indicator-tips').innerHTML = info.tips.map(t => `<li><i class="fas fa-magic" style="color:var(--gold); margin-left:5px;"></i> ${t}</li>`).join('');
    
    const impactClass = info.news.impact === 'positive' ? 'impact-positive' : 'impact-negative';
    const bgClass = info.news.impact === 'positive' ? 'bg-positive' : 'bg-negative';
    const impactWord = info.news.impact === 'positive' ? 'إيجابي 🟢' : 'سلبي 🔴';

    document.getElementById('ai-news-feed').innerHTML = `
        <div class="news-item">
            <div class="news-text"><i class="fas fa-satellite-dish" style="color:var(--gold);"></i> ${info.news.text}</div>
            <div class="sentiment-box">
                <span>التأثير: <span class="${impactClass}">${impactWord}</span></span>
                <div class="sentiment-bar-bg">
                    <div class="sentiment-fill ${bgClass}" style="width: ${info.news.percentage}%;"></div>
                </div>
                <span class="${impactClass}">${info.news.percentage}%</span>
            </div>
        </div>
    `;

    updateGauge();
}

function updateGauge() {
    const needle = document.getElementById('gauge-needle');
    const aiText = document.getElementById('ai-text');
    const aiPercent = document.getElementById('ai-percent');
    const score = Math.floor(Math.random() * 100);
    
    aiPercent.innerText = score + "%";
    const angle = (score * 1.8) - 90;
    needle.style.transform = `rotate(${angle}deg)`;

    if (score > 60) { aiText.innerText = "شراء قوي"; aiText.style.color = "#0ecb81"; }
    else if (score < 40) { aiText.innerText = "بيع قوي"; aiText.style.color = "#f6465d"; }
    else { aiText.innerText = "انتظار / عرضي"; aiText.style.color = "#FCD535"; }
}

// برمجة أزرار التنقل
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        loadWidgets(this.getAttribute('data-symbol'));
    });
});

window.onload = () => loadWidgets("BINANCE:BTCUSDT");
