let currentSymbol = "BINANCE:BTCUSDT";

// تفعيل الشارت الأساسي
function initTradingView(symbol) {
    new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "60",
        "theme": "dark",
        "style": "1",
        "locale": "ar",
        "toolbar_bg": "#111419",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_widget"
    });
    
    // تحديث الأدوات الجانبية بناءً على الرمز الجديد
    updateSideWidgets(symbol);
    updateAISignals(symbol);
}

// تحديث التقييم الفني والأخبار الجانبية
function updateSideWidgets(symbol) {
    // 1. التقييم الفني
    document.getElementById('tech-rating-widget').innerHTML = '';
    const techScript = document.createElement('script');
    techScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    techScript.async = true;
    techScript.innerHTML = JSON.stringify({
        "interval": "1h", "width": "100%", "height": "100%",
        "symbol": symbol, "showIntervalTabs": true, "locale": "ar", "colorTheme": "dark"
    });
    document.getElementById('tech-rating-widget').appendChild(techScript);

    // 2. شريط الأخبار
    document.getElementById('tradingview-news-widget').innerHTML = '';
    const newsScript = document.createElement('script');
    newsScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    newsScript.async = true;
    newsScript.innerHTML = JSON.stringify({
        "feedMode": "symbol", "symbol": symbol, "colorTheme": "dark",
        "width": "100%", "height": "100%", "locale": "ar"
    });
    document.getElementById('tradingview-news-widget').appendChild(newsScript);
}

// محاكاة إشارات الذكاء الاصطناعي ومقترحات المؤشرات
function updateAISignals(symbol) {
    const ptr = document.getElementById('gauge-ptr');
    const signalText = document.getElementById('ai-signal-result');
    const suggestions = document.getElementById('suggestions-box');
    
    // محاكاة تحرك العداد
    const randomPos = Math.random();
    ptr.style.transform = `rotate(${randomPos * 0.5}turn)`;
    
    if (randomPos > 0.5) {
        signalText.innerText = "صاعد قوي / STRONG BUY";
        signalText.style.color = "#0ecb81";
        suggestions.innerHTML = `
            <div class="suggestion-tag"><i class="fas fa-check"></i> استخدم مؤشر <b>RSI</b> (فوق الـ 50)</div>
            <div class="suggestion-tag"><i class="fas fa-check"></i> فعل <b>EMA 200</b> لتأكيد الاتجاه</div>
            <div class="suggestion-tag"><i class="fas fa-check"></i> مراقبة فوليوم المؤسسات الآن</div>
        `;
    } else {
        signalText.innerText = "هابط / SELL SIGNAL";
        signalText.style.color = "#f6465d";
        suggestions.innerHTML = `
            <div class="suggestion-tag"><i class="fas fa-exclamation-triangle"></i> تشبع شرائي على <b>Stochastic</b></div>
            <div class="suggestion-tag"><i class="fas fa-exclamation-triangle"></i> كسر كاذب متوقع - استخدم <b>Bollinger</b></div>
        `;
    }
}

// التبديل بين العملات، الذهب، والفوركس
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        const symbol = this.getAttribute('data-symbol');
        initTradingView(symbol);
    });
});

window.onload = () => initTradingView(currentSymbol);
