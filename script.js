// قاعدة بيانات لمحاكاة تحليل الذكاء الاصطناعي للأخبار والمؤشرات
const aiDatabase = {
    "BINANCE:BTCUSDT": {
        news: [
            { source: "FED Update", text: "توقعات بتثبيت الفائدة تدعم العملات الرقمية كملاذ عالي المخاطر." },
            { source: "J.P. Morgan", text: "زيادة في تدفقات السيولة المؤسسية نحو البيتكوين هذا الأسبوع." }
        ],
        tips: ["فعل مؤشر MACD لمراقبة التقاطع الإيجابي", "استخدم RSI لتحديد مناطق التشبع فوق 70", "راقب EMA 200 كمستوى دعم رئيسي"]
    },
    "FX:EURUSD": {
        news: [
            { source: "ECB", msg: "تصريحات لاغارد حول التضخم تزيد من قوة اليورو أمام الدولار." },
            { source: "Goldman Sachs", msg: "توقعات بهبوط الدولار نتيجة بيانات التوظيف الضعيفة." }
        ],
        tips: ["استخدم Bollinger Bands لمراقبة الانفجار السعري القادم", "راقب مستويات Fibonacci عند 1.0850", "فعل مؤشر Stochastic للارتداد اللحظي"]
    },
    "OANDA:XAUUSD": {
        news: [
            { source: "Central Banks", msg: "البنوك المركزية تزيد من احتياطيات الذهب، مما يدفع السعر لمستويات تاريخية." },
            { source: "Fed Pivot", msg: "احتمالية خفض الفائدة في يونيو ترفع جاذبية الذهب كمخزن للقيمة." }
        ],
        tips: ["استخدم Ichimoku Cloud لتحديد الاتجاه القوي", "راقب مستوى 2150$ كدعم مؤسساتي", "RSI يظهر تشبع شرائي، انتظر التصحيح"]
    }
};

let currentSymbol = "BINANCE:BTCUSDT";

// وظيفة تهيئة الشارتات والودجتات
function initDashboard(symbol) {
    // 1. الشارت الرئيسي (العملاق)
    new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "60",
        "theme": "dark",
        "style": "1",
        "locale": "ar_AE",
        "container_id": "tv_main_chart"
    });

    // 2. شارت المؤشرات (RSI/MACD)
    new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "60",
        "theme": "dark",
        "style": "3",
        "hide_top_toolbar": true,
        "studies": ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
        "container_id": "tv_indicators_chart"
    });

    updateTechnicalWidgets(symbol);
    updateAIAnalysis(symbol);
}

// تحديث الودجتات الجانبية (ملخص فني + أخبار حية)
function updateTechnicalWidgets(symbol) {
    // التقييم الفني
    const techContainer = document.getElementById('tv-technical-summary');
    techContainer.innerHTML = '';
    const techScript = document.createElement('script');
    techScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    techScript.async = true;
    techScript.innerHTML = JSON.stringify({
        "interval": "1h", "width": "100%", "height": "100%",
        "symbol": symbol, "showIntervalTabs": true, "locale": "ar", "colorTheme": "dark"
    });
    techContainer.appendChild(techScript);

    // شريط الأخبار الحية
    const newsContainer = document.getElementById('tv-news-timeline');
    newsContainer.innerHTML = '';
    const newsScript = document.createElement('script');
    newsScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    newsScript.async = true;
    newsScript.innerHTML = JSON.stringify({
        "feedMode": "all_symbols", "symbol": symbol, "colorTheme": "dark",
        "width": "100%", "height": "100%", "locale": "ar"
    });
    newsContainer.appendChild(newsScript);
}

// محرك تحليل الذكاء الاصطناعي (أخبار المؤسسات + العداد + النصائح)
function updateAIAnalysis(symbol) {
    const data = aiDatabase[symbol] || aiDatabase["BINANCE:BTCUSDT"];
    
    // تحديث أخبار المؤسسات
    const newsFeed = document.getElementById('ai-institutional-feed');
    newsFeed.innerHTML = data.news.map(n => `
        <div class="news-item">
            <span class="source">${n.source || n.bank}</span>
            <p>${n.text || n.msg}</p>
        </div>
    `).join('');

    // تحديث اقتراحات المؤشرات
    const tipsBox = document.getElementById('ai-indicator-tips');
    tipsBox.innerHTML = data.tips.map(t => `
        <div class="suggestion-item"><i class="fas fa-check-circle"></i> ${t}</div>
    `).join('');

    // تحريك العداد (Simulation)
    const needle = document.getElementById('gauge-needle');
    const aiText = document.getElementById('ai-text');
    const aiPercent = document.getElementById('ai-percent');
    
    const randomVal = Math.random();
    const confidence = Math.floor(Math.random() * (95 - 82 + 1) + 82);
    aiPercent.innerText = confidence + "%";

    if(randomVal > 0.5) {
        needle.style.transform = `rotate(45deg)`;
        aiText.innerText = "صاعد / Bullish";
        aiText.style.color = "#0ecb81";
    } else {
        needle.style.transform = `rotate(-45deg)`;
        aiText.innerText = "هابط / Bearish";
        aiText.style.color = "#f6465d";
    }
}

// التنقل بين الأسواق (ذهب، فوركس، كريبتو)
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        const symbol = this.getAttribute('data-symbol');
        initDashboard(symbol);
    });
});

window.onload = () => initDashboard(currentSymbol);
