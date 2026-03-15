let currentWidget = null;

// بيانات محاكاة لأخبار المؤسسات واقتراحات المؤشرات
const institutionalDatabase = {
    "BINANCE:BTCUSDT": {
        news: [
            { bank: "J.P. Morgan", msg: "زيادة في تدفقات السيولة المؤسسية نحو صناديق البيتكوين." },
            { bank: "BlackRock", msg: "توقعات باستمرار الزخم الصاعد نتيجة تقليص العرض في المنصات." }
        ],
        tips: ["استخدم RSI لتحديد مناطق التشبع فوق 70", "راقب تقاطع MACD على فريم 4 ساعات", "فعل Bollinger Bands لمراقبة الانفجار السعري"]
    },
    "FX:EURUSD": {
        news: [
            { bank: "ECB", msg: "البنك المركزي الأوروبي يلمح لسياسة نقدية حذرة تؤثر على قوة اليورو." },
            { bank: "Goldman Sachs", msg: "توقعات بتذبذب زوج اليورو/دولار بانتظار بيانات التضخم الأمريكية." }
        ],
        tips: ["مؤشر Stochastic يعطي إشارة دخول قوية حالياً", "راقب مستويات الدعم عند 1.0850", "استخدم Fibonacci لتحديد مستويات الارتداد"]
    },
    "OANDA:XAUUSD": {
        news: [
            { bank: "Central Banks", msg: "زيادة في احتياطيات الذهب لدى البنوك المركزية الآسيوية." },
            { bank: "HSBC", msg: "الذهب يظل الملاذ الآمن المفضل في ظل التوترات الجيوسياسية الراهنة." }
        ],
        tips: ["مؤشر ATR يظهر زيادة في التقلبات - صغر العقود", "استخدم السحابة (Ichimoku) لتحديد الاتجاه العام", "RSI يقترب من مناطق تشبع بيعي - فرصة شراء"]
    }
};

// وظيفة بناء الشارت الرئيسي
function createWidget(symbol) {
    if (currentWidget) { document.getElementById('tradingview_widget').innerHTML = ''; }
    
    currentWidget = new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "60",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "ar",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_widget"
    });

    updateDynamicContent(symbol);
    updateTechnicalSummary(symbol);
}

// تحديث المحتوى الديناميكي (أخبار المؤسسات + نصائح AI)
function updateDynamicContent(symbol) {
    const data = institutionalDatabase[symbol] || institutionalDatabase["BINANCE:BTCUSDT"];
    
    // 1. تحديث أخبار المؤسسات
    const newsFeed = document.getElementById('ai-news-feed');
    newsFeed.innerHTML = data.news.map(n => `
        <div class="inst-news-card">
            <span class="bank-tag">${n.bank}</span>
            <p>${n.msg}</p>
        </div>
    `).join('');

    // 2. تحديث نصائح المؤشرات
    const tipsContainer = document.getElementById('indicator-tips-container');
    tipsContainer.innerHTML = data.tips.map(t => `
        <div class="tip-item"><i class="fas fa-magic"></i> ${t}</div>
    `).join('');

    simulateAISignal();
}

// تحديث الملخص الفني (الودجت الجانبي)
function updateTechnicalSummary(symbol) {
    document.getElementById('tv-tech-summary').innerHTML = '';
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "interval": "1h", "width": "100%", "height": "100%",
        "symbol": symbol, "showIntervalTabs": true, "locale": "ar", "colorTheme": "dark"
    });
    document.getElementById('tv-tech-summary').appendChild(script);
}

// محاكاة إشارة الذكاء الاصطناعي (العداد)
function simulateAISignal() {
    const ptr = document.getElementById('gauge-ptr');
    const signalText = document.getElementById('ai-signal-result');
    const trendVal = document.getElementById('trend-val');
    const confVal = document.getElementById('conf-val');
    
    const randomVal = Math.random();
    const confidence = Math.floor(Math.random() * (95 - 80 + 1) + 80);
    
    confVal.innerText = confidence + "%";
    trendVal.innerText = randomVal > 0.5 ? "صاعد" : "هابط";

    if(randomVal > 0.5) {
        ptr.style.transform = `rotate(0.4turn)`;
        signalText.innerText = "صاعد / STRONG BUY";
        signalText.style.color = "#0ecb81";
    } else {
        ptr.style.transform = `rotate(0.1turn)`;
        signalText.innerText = "هابط / STRONG SELL";
        signalText.style.color = "#f6465d";
    }
}

// التحكم في القائمة العلوية
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        createWidget(this.getAttribute('data-symbol'));
    });
});

// أخبار الـ Timeline المباشرة
function initNews() {
    document.getElementById('tv-news-timeline').innerHTML = '';
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "feedMode": "all_symbols", "colorTheme": "dark", "isTransparent": true,
        "displayMode": "regular", "width": "100%", "height": "100%", "locale": "ar"
    });
    document.getElementById('tv-news-timeline').appendChild(script);
}

window.onload = () => {
    createWidget("BINANCE:BTCUSDT");
    initNews();
};
