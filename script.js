let currentWidget = null;

// وظيفة بناء الشارت
function createWidget(symbol) {
    if (currentWidget) {
        document.getElementById('tradingview_widget').innerHTML = '';
    }
    
    currentWidget = new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "60",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "ar",
        "toolbar_bg": "#12151c",
        "enable_publishing": false,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_widget"
    });

    // تحديث الملخص الفني الجانبي ليتماشى مع العملة المختارة
    updateTechnicalSummary(symbol);
    simulateAISignal();
}

// تحديث الملخص الفني
function updateTechnicalSummary(symbol) {
    document.getElementById('tv-tech-summary').innerHTML = '';
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "interval": "1h",
        "width": "100%",
        "isTransparent": true,
        "height": "100%",
        "symbol": symbol,
        "showIntervalTabs": true,
        "locale": "ar",
        "colorTheme": "dark"
    });
    document.getElementById('tv-tech-summary').appendChild(script);
}

// محاكاة إشارة الذكاء الاصطناعي
function simulateAISignal() {
    const ptr = document.getElementById('gauge-ptr');
    const signalText = document.getElementById('ai-signal-result');
    const randomVal = Math.random();
    
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

// التنقل بين الذهب والعملات
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        const symbol = this.getAttribute('data-symbol');
        createWidget(symbol);
    });
});

// أخبار الـ Timeline المباشرة
function initNews() {
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "feedMode": "all_symbols",
        "colorTheme": "dark",
        "isTransparent": true,
        "displayMode": "regular",
        "width": "100%",
        "height": "100%",
        "locale": "ar"
    });
    document.getElementById('tv-news-timeline').appendChild(script);
}

// التشغيل الابتدائي
window.onload = () => {
    createWidget("BINANCE:BTCUSDT");
    initNews();
};
