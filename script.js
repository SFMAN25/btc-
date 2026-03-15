// تشغيل شارت TradingView الرئيسي
function initChart(symbol = "BINANCE:BTCUSDT") {
    new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "H",
        "theme": "dark",
        "style": "1",
        "locale": "ar",
        "container_id": "tradingview_boda"
    });
}

// محاكاة نتيجة الذكاء الاصطناعي (Bullish / Bearish)
function updateAISignal(signalType) {
    const ptr = document.getElementById('gauge-ptr');
    const txt = document.getElementById('ai-result');
    
    if(signalType === 'up') {
        ptr.style.transform = 'rotate(0.45turn)'; // جهة الأخضر
        txt.innerText = "صاعد / Bullish";
        txt.style.color = "#00ff88";
    } else {
        ptr.style.transform = 'rotate(0.1turn)'; // جهة الأحمر
        txt.innerText = "هابط / Bearish";
        txt.style.color = "#ff3366";
    }
}

// تغيير الأسواق من القائمة
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        let market = this.getAttribute('data-market');
        initChart(market);
        
        // محاكاة تغيير الإشارة بناءً على السوق
        let randomSignal = Math.random() > 0.5 ? 'up' : 'down';
        updateAISignal(randomSignal);
    });
});

window.onload = () => {
    initChart();
    updateAISignal('up'); // ابدأ بصاعد كافتراضي للبيتكوين
};
