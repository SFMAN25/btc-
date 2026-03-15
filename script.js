// 1. تفعيل شارت TradingView العملاق مع مؤشرات ثابتة
function createWidget(symbol) {
    new TradingView.widget({
        "autosize": true, 
        "symbol": symbol,
        "interval": "60", 
        "theme": "dark",
        "style": "1",
        "locale": "ar_AE",
        "container_id": "tv_main_chart",
        "studies": [
            "RSI@tv-basicstudies", // مؤشر القوة النسبية ثابت تلقائياً
            "MACD@tv-basicstudies", // مؤشر الماكد ثابت تلقائياً
            "StochasticRSI@tv-basicstudies" // إضافة Stochastic RSI لتعزيز التحليل
        ],
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "save_image": false,
        "backgroundColor": "#181a20",
        "gridColor": "#2b3139"
    });
}

// 2. تحديث قسم "اقتراحات المؤشرات" (Indicator Tips) برمجياً
function updateIndicatorTips(symbol) {
    const tipsList = document.getElementById('indicator-tips');
    const tips = [
        `استخدم <b>RSI</b> لمراقبة التشبع السعري لـ ${symbol}`,
        `راقب تقاطع خطوط <b>MACD</b> لتأكيد اتجاه ${symbol}`,
        `فعل <b>Bollinger Bands</b> لقياس التذبذب الحالي`
    ];
    tipsList.innerHTML = tips.map(t => `<li><i class="fas fa-check-circle"></i> ${t}</li>`).join('');
}
