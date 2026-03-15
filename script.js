// قاعدة بيانات لمحاكاة أخبار المؤسسات واقتراحات المؤشرات
const marketData = {
    "BINANCE:BTCUSDT": {
        news: [
            { source: "FED", msg: "الفيدرالي الأمريكي يلمح لثبات الفائدة، مما يعزز صعود الأصول الرقمية." },
            { source: "JP Morgan", msg: "توقعات بزيادة تدفق السيولة المؤسسية نحو صناديق الـ ETF للبيتكوين." }
        ],
        tips: ["مؤشر RSI يظهر زخم شرائي قوي", "تقاطع إيجابي في MACD على فريم الساعة", "استخدم Bollinger Bands لمراقبة التذبذب"]
    },
    "FX:EURUSD": {
        news: [
            { source: "ECB", msg: "البنك المركزي الأوروبي يراقب التضخم، واليورو يستقر أمام الدولار." },
            { source: "Bank of America", msg: "توقعات بحركة عرضية لزوج EUR/USD حتى صدور بيانات التوظيف." }
        ],
        tips: ["مؤشر الاستوكاستك في منطقة تشبع بيعي", "راقب مستويات الدعم عند 1.0850", "مؤشر ATR يظهر ضعف في التقلبات الحالية"]
    },
    "OANDA:XAUUSD": {
        news: [
            { source: "Global Reserve", msg: "زيادة طلب البنوك المركزية على الذهب كملاذ آمن في ظل التوترات." },
            { source: "Goldman Sachs", msg: "توقعات بوصول الذهب لمستويات تاريخية جديدة بنهاية الربع الثاني." }
        ],
        tips: ["الذهب فوق EMA 200 - الاتجاه العام صاعد", "تشبع شرائي لحظي على مؤشر RSI", "استخدم Fibonacci لتحديد أهداف الارتداد"]
    }
};

let mainChart = null;

// وظيفة تهيئة المنصة حسب العملة المختارة
function initPlatform(symbol) {
    // 1. تفعيل الشارت الرئيسي
    if (mainChart) { document.getElementById('tv_main_chart').innerHTML = ''; }
    mainChart = new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "60",
        "theme": "dark",
        "style": "1",
        "locale": "ar",
        "container_id": "tv_main_chart"
    });

    // 2. تحديث نبض السوق (الأخبار) والاقتراحات
    updateAIContent(symbol);
    
    // 3. تحديث الودجتات الفنية الجانبية
    updateTechnicalWidgets(symbol);
}

function updateAIContent(symbol) {
    const data = marketData[symbol] || marketData["BINANCE:BTCUSDT"];
    
    // تحديث الأخبار الاقتصادية
    const newsFeed = document.getElementById('ai-news-feed');
    newsFeed.innerHTML = data.news.map(n => `
        <div class="news-item">
            <b><i class="fas fa-university"></i> ${n.source} Insight</b>
            <p>${n.msg}</p>
        </div>
    `).join('');

    // تحديث اقتراحات المؤشرات
    const tipsList = document.getElementById('indicator-tips');
    tipsList.innerHTML = data.tips.map(t => `<li><i class="fas fa-check"></i> ${t}</li>`).join('');

    // محاكاة إشارة العداد
    simulateSignal();
}

function updateTechnicalWidgets(symbol) {
    // تحديث الملخص الفني
    const techBox = document.getElementById('tv-tech-summary');
    techBox.innerHTML = '';
    const scriptTech = document.createElement('script');
    scriptTech.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    scriptTech.async = true;
    scriptTech.innerHTML = JSON.stringify({
        "interval": "1h", "width": "100%", "height": "300",
        "symbol": symbol, "showIntervalTabs": true, "locale": "ar", "colorTheme": "dark"
    });
    techBox.appendChild(scriptTech);

    // تحديث التايم لاين للأخبار
    const newsBox = document.getElementById('tv-news-timeline');
    newsBox.innerHTML = '';
    const scriptNews = document.createElement('script');
    scriptNews.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    scriptNews.async = true;
    scriptNews.innerHTML = JSON.stringify({
        "feedMode": "all_symbols", "colorTheme": "dark", "width": "100%", "height": "400", "locale": "ar"
    });
    newsBox.appendChild(scriptNews);
}

function simulateSignal() {
    const ptr = document.getElementById('gauge-ptr');
    const signalText = document.getElementById('ai-signal-result');
    const conf = document.getElementById('ai-confidence');
    const random = Math.random();
    
    conf.innerText = Math.floor(random * 20 + 75) + "%";
    
    if(random > 0.5) {
        ptr.style.transform = `rotate(0.4turn)`;
        signalText.innerText = "صاعد / STRONG BUY";
        signalText.style.color = "#0ecb81";
    } else {
        ptr.style.transform = `rotate(0.1turn)`;
        signalText.innerText = "هابط / STRONG SELL";
        signalText.style.color = "#f6465d";
    }
}

// أزرار التنقل
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        initPlatform(this.getAttribute('data-symbol'));
    });
});

window.onload = () => initPlatform("BINANCE:BTCUSDT");
