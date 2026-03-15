// 1. تفعيل شارت TradingView العملاق في المنتصف
new TradingView.widget({
    "autosize": true, // الشارت هياخد مساحة المربع بالكامل
    "symbol": "BINANCE:BTCUSDT",
    "interval": "60", // الفريم الافتراضي (ساعة)
    "timezone": "Etc/UTC",
    "theme": "dark",
    "style": "1", // شكل الشموع
    "locale": "ar_AE",
    "enable_publishing": false,
    "backgroundColor": "#131722", // نفس لون كروت الموقع
    "gridColor": "#2a2e39",
    "hide_top_toolbar": false,
    "hide_legend": false,
    "save_image": false,
    "container_id": "tv_main_chart"
});

// 2. برمجة الذكاء الاصطناعي مع الفريمات الزمنية
const tfButtons = document.querySelectorAll('.tf-btn');
const needle = document.getElementById('gauge-needle');
const aiText = document.getElementById('ai-text');
const aiPercent = document.getElementById('ai-percent');

// وظيفة لتحديث العداد بناءً على الفريم
function analyzeTimeframe(tf) {
    // محاكاة: كل فريم بيدي نتيجة مختلفة (في الحقيقة هنا بنربط بـ API)
    let isBullish = Math.random() > 0.4; // نسبة 60% يكون صاعد كمثال
    let confidence = Math.floor(Math.random() * (95 - 70 + 1) + 70); // ثقة من 70 ل 95

    aiPercent.innerText = confidence + "%";

    if (isBullish) {
        // تحريك المؤشر لليمين (الأخضر)
        let angle = Math.floor(Math.random() * (85 - 10 + 1) + 10);
        needle.style.transform = `rotate(${angle}deg)`;
        aiText.innerText = "صاعد / Bullish";
        aiText.style.color = "#089981"; // لون أخضر الخاص بـ TradingView
    } else {
        // تحريك المؤشر لليسار (الأحمر)
        let angle = Math.floor(Math.random() * (-10 - -85 + 1) - 85);
        needle.style.transform = `rotate(${angle}deg)`;
        aiText.innerText = "هابط / Bearish";
        aiText.style.color = "#f23645"; // لون أحمر الخاص بـ TradingView
    }
}

// إضافة حدث الضغط لكل زر فريم زمني
tfButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        // إزالة اللون من كل الأزرار
        tfButtons.forEach(b => b.classList.remove('active'));
        // تفعيل الزر المضغوط
        this.classList.add('active');
        
        // تشغيل التحليل
        let timeframe = this.getAttribute('data-tf');
        aiText.innerText = "جاري التحليل...";
        aiText.style.color = "#d4af37"; // لون ذهبي أثناء التحميل
        
        // تأخير بسيط لمحاكاة التفكير الاصطناعي
        setTimeout(() => {
            analyzeTimeframe(timeframe);
        }, 800);
    });
});

// تشغيل التحليل الأول عند فتح الموقع
window.onload = () => {
    setTimeout(() => analyzeTimeframe("1H"), 1000);
};
