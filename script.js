// 1. تشغيل شارت TradingView
new TradingView.widget({
    "autosize": true,
    "symbol": "BINANCE:BTCUSDT",
    "interval": "D",
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
    "container_id": "tradingview_chart"
});

// 2. محاكاة نظام الذكاء الاصطناعي للأخبار
const aiNewsData = [
    {
        title: "الفيدرالي الأمريكي يلمح لخفض أسعار الفائدة قريباً.",
        impact: "إيجابي 🟢",
        type: "positive",
        analysis: "الذكاء الاصطناعي: خفض الفائدة يضعف الدولار، مما يعطي دفعة قوية لصعود الذهب والبيتكوين على المدى القصير."
    },
    {
        title: "منصة تداول كبرى تواجه مشاكل في سحب العملات.",
        impact: "سلبي 🔴",
        type: "negative",
        analysis: "الذكاء الاصطناعي: خبر سلبي يخلق حالة من الخوف (FUD) في السوق، متوقع هبوط طفيف للبيتكوين نحو الدعم."
    }
];

const newsFeedContainer = document.getElementById('ai-news-feed');

aiNewsData.forEach(news => {
    const aiBox = document.createElement('div');
    aiBox.className = `ai-box ${news.type}`;
    
    aiBox.innerHTML = `
        <h3>${news.title}</h3>
        <p class="ai-impact">التأثير المتوقع: ${news.impact}</p>
        <p class="ai-analysis">${news.analysis}</p>
    `;
    
    newsFeedContainer.appendChild(aiBox);
});
