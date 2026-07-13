// تشغيل شارت العقود الآجلة لباينانس فور تحميل الصفحة تلقائياً مع دمج مؤشر SFMAN الجديد
document.addEventListener("DOMContentLoaded", function() {
    try {
        // التحقق من وجود حاوية الشارت في صفحة HTML لمنع حدوث أخطاء برمجية أثناء التحميل
        const chartContainer = document.getElementById("tradingview_sfman_futures");
        
        if (chartContainer) {
            new TradingView.widget({
                "width": "100%",
                "height": "100%",
                "symbol": "BINANCE:BTCUSDT.P", // العقود الآجلة الدائمة لباينانس لمنع تأخير الأسعار بالملّي
                "interval": "15",              // إطار 15 دقيقة الافتراضي للتداول
                "timezone": "Africa/Cairo",    // ضبط التوقيت الرسمي على القاهرة
                "theme": "dark",               // الثيم الداكن الاحترافي متناسق مع تصميم موقعك
                "style": "1",                  // نمط الشموع اليابانية المعتاد
                "locale": "en",
                "toolbar_bg": "#161a22",
                "enable_publishing": false,
                "hide_side_toolbar": false,     // إظهار أدوات الرسم الجانبية للتحليل الفني والخطوط
                "allow_symbol_change": true,   // يتيح لك تغيير الرمز واصطياد العملات الأخرى من موقعك
                "studies": [
                    "PUB;0qcprwlp"             // استدعاء سكربتك الجديد SFMAN Crypto Golden V30 باستخدام الـ ID الجديد!
                ],
                "container_id": "tradingview_sfman_futures"
            });
        } else {
            console.error("خطأ: لم يتم العثور على حاوية الشارت 'tradingview_sfman_futures' في صفحة HTML الخاصة بك.");
        }
    } catch (error) {
        console.error("حدث خطأ غير متوقع أثناء تحميل شارت TradingView والمؤشر الخاص بك:", error);
    }
});
