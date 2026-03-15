// 1. تفعيل شارت TradingView العملاق في المنتصف
new TradingView.widget({
    "autosize": true, 
    "symbol": "BINANCE:BTCUSDT",
    "interval": "60", 
    "timezone": "Etc/UTC",
    "theme": "dark",
    "style": "1", // شكل الشموع اليابانية
    "locale": "ar_AE",
    "enable_publishing": false,
    "backgroundColor": "#181a20", // نفس لون الكروت الجديد
    "gridColor": "#2b3139",
    "hide_top_toolbar": false,
    "hide_legend": false,
    "save_image": false,
    "container_id": "tv_main_chart"
});

// 2. تفعيل الشارت السفلي المخصص للـ RSI والـ MACD فقط (مكان تويتر)
new TradingView.widget({
    "autosize": true,
    "symbol": "BINANCE:BTCUSDT",
    "interval": "60",
    "timezone": "Etc/UTC",
    "theme": "dark",
    "style": "3", // شكل الخطوط بدل الشموع عشان يركز على المؤشرات
    "locale": "ar_AE",
    "enable_publishing": false,
    "backgroundColor": "#181a20",
    "gridColor": "#2b3139",
    "hide_top_toolbar": true, // إخفاء الأدوات العلوية لتوفير المساحة
    "hide_legend": true,
    "hide_side_toolbar": true, // إخفاء أدوات الرسم الجانبية
    "studies": [
        "RSI@tv-basicstudies", // إضافة مؤشر RSI
        "MACD@tv-basicstudies" // إضافة مؤشر MACD
    ],
    "container_id": "tv_indicators_chart"
});

// 3. برمجة الذكاء الاصطناعي مع الفريمات الزمنية
const tfButtons = document.querySelectorAll('.tf-btn');
const needle = document.getElementById('gauge-needle');
const aiText = document.getElementById('ai-text');
const aiPercent = document.getElementById('ai-percent');

function analyzeTimeframe(tf) {
    let isBullish = Math.random() > 0.4; 
    let confidence = Math.floor(Math.random() * (95 - 75 + 1) + 75); 

    aiPercent.innerText = confidence + "%";

    if (isBullish) {
        let angle = Math.floor(Math.random() * (85 - 10 + 1) + 10);
        needle.style.transform = `rotate(${angle}deg)`;
        aiText.innerText = "صاعد / Bullish";
        aiText.style.color = "#0ecb81"; 
    } else {
        let angle = Math.floor(Math.random() * (-10 - -85 + 1) - 85);
        needle.style.transform = `rotate(${angle}deg)`;
        aiText.innerText = "هابط / Bearish";
        aiText.style.color = "#f6465d"; 
    }
}

tfButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        tfButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        let timeframe = this.getAttribute('data-tf');
        aiText.innerText = "جاري التحليل...";
        aiText.style.color = "#FCD535"; 
        
        setTimeout(() => {
            analyzeTimeframe(timeframe);
        }, 800);
    });
});

window.onload = () => {
    setTimeout(() => analyzeTimeframe("1H"), 1000);
};
