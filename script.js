// تشغيل شارت العقود الآجلة الدائمة لباينانس فور تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    new TradingView.widget({
        "width": "100%",
        "height": "100%",
        "symbol": "BINANCE:BTCUSDT.P", // الـ P هنا تضمن عقد الفيوتشرز الدائم بدون تأخير
        "interval": "15",              // الإطار الزمني الافتراضي 15 دقيقة
        "timezone": "Africa/Cairo",    // ضبط التوقيت بالملّي على مصر
        "theme": "dark",               // ستايل غامق فخم
        "style": "1",                  // شموع يابانية كلاسيكية
        "locale": "en",
        "toolbar_bg": "#161a22",
        "enable_publishing": false,
        "hide_side_toolbar": false,     // إظهار أدوات الرسم على اليسار
        "allow_symbol_change": true,   // يسمح لك تغير العملة لو حبيت تصطاد إشارات تانية
        "container_id": "tradingview_sfman_futures"
    });
});
