// 1. برمجة تفعيل الخانات (Tabs Logic)
const navLinks = document.querySelectorAll('#nav-links a');
const tabContents = document.querySelectorAll('.tab-content');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // منع إعادة تحميل الصفحة
        
        // إزالة اللون الذهبي (النشط) من كل الأزرار
        navLinks.forEach(l => l.classList.remove('active'));
        // إعطاء اللون الذهبي للزر اللي تم الضغط عليه
        this.classList.add('active');

        // إخفاء كل المحتوى
        tabContents.forEach(tab => {
            tab.classList.remove('active-tab');
            tab.classList.add('hidden');
        });

        // إظهار المحتوى الخاص بالزر بناءً على data-target
        const targetId = this.getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        targetContent.classList.remove('hidden');
        targetContent.classList.add('active-tab');
    });
});

// 2. تفعيل شارتات TradingView لكل قسم مخصص
function createChart(containerId, symbol) {
    new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "60", // شارت الساعة
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "ar_AE",
        "enable_publishing": false,
        "backgroundColor": "#151a27",
        "gridColor": "rgba(255, 255, 255, 0.06)",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "container_id": containerId
    });
}

// استدعاء الشارتات فور تحميل الصفحة
window.onload = function() {
    createChart("tv_home", "BINANCE:BTCUSDT"); // الرئيسية (بيتكوين كواجهة)
    createChart("tv_crypto", "BINANCE:BTCUSDT"); // قسم الكريبتو
    createChart("tv_forex", "FX:EURUSD"); // قسم الفوركس (يورو/دولار)
    createChart("tv_gold", "OANDA:XAUUSD"); // قسم الذهب (أونصة الذهب)
};
