// مصفوفة لمحاكاة جلب الأخبار من Investing و X وتحليلها
const marketSignals = [
    { source: "Investing", asset: "XAU/USD (الذهب)", news: "ارتفاع التضخم الأمريكي بشكل غير متوقع", sentiment: "Bullish", ai_advice: "الذكاء الاصطناعي يتوقع ضغط شرائي على الذهب كملاذ آمن. الهدف القادم 2180." },
    { source: "X (EAtrading)", asset: "BTC/USDT", news: "اختراق منطقة سيولة 64,500", sentiment: "Bullish", ai_advice: "التحليل الفني يدعم الاستمرار. الذكاء الاصطناعي يرجح صعود للـ 67k." },
    { source: "Investing", asset: "EUR/USD", news: "بيانات سلبية من المركزي الأوروبي", sentiment: "Bearish", ai_advice: "توقعات بهبوط الزوج. يفضل البحث عن فرص بيع." }
];

function updateAISignals() {
    const container = document.getElementById('ai-analysis-container');
    container.innerHTML = ''; // مسح المحتوى القديم

    marketSignals.forEach(sig => {
        const signalDiv = document.createElement('div');
        signalDiv.className = `ai-box ${sig.sentiment === 'Bullish' ? 'positive' : 'negative'}`;
        
        signalDiv.innerHTML = `
            <div class="sig-header">
                <span class="asset-tag">${sig.asset}</span>
                <span class="source-tag">${sig.source}</span>
            </div>
            <h3>${sig.news}</h3>
            <p class="ai-impact">إشارة AI: <strong>${sig.sentiment === 'Bullish' ? 'صعود 🟢' : 'هبوط 🔴'}</strong></p>
            <p class="ai-analysis">${sig.ai_advice}</p>
        `;
        container.appendChild(signalDiv);
    });
}

// تشغيل التحديث عند التحميل
window.onload = () => {
    updateAISignals();
};
