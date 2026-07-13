// تشغيل شارت العقود الآجلة لباينانس فور تحميل الصفحة تلقائياً مع دمج مؤشر SFMAN الجديد
document.addEventListener("DOMContentLoaded", function() {
    new TradingView.widget({
        "width": "100%",
        "height": "100%",
        "symbol": "BINANCE:BTCUSDT.P", // العقود الآجلة الدائمة لباينانس لمنع تأخير الأسعار بالملّي
        "interval": "15",              // إطار 15 دقيقة الافتراضي للتداول
        "timezone": "Africa/Cairo",    // ضبط التوقيت الرسمي على القاهرة
        "theme": "dark",               // الثيم الداكن الاحترافي
        "style": "1",                  // نمط الشموع اليابانية المعتاد
        "locale": "en",
        "toolbar_bg": "#161a22",
        "enable_publishing": false,
        "hide_side_toolbar": false,     // إظهار أدوات الرسم الجانبية للتحليل الفني
        "allow_symbol_change": true,   // يتيح لك تغيير الرمز واصطياد العملات الأخرى من موقعك
        "studies": [
            "PUB;0qcprwlp"             // استدعاء سكربتك الجديد SFMAN Crypto Golden V30 باستخدام الـ ID الجديد!
        ],
        "container_id": "tradingview_sfman_futures"
    });
});
