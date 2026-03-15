let currentWidget = null;

// قاعدة بيانات الذكاء الاصطناعي (أخبار ونصائح متغيرة حسب السوق)
const marketAIContext = {
    crypto: {
        news: [
            { tag: "FED", type: "bank", text: "توقعات الفيدرالي بتثبيت الفائدة ترفع شهية المخاطرة في أسواق الكريبتو." },
            { tag: "J.P. Morgan", type: "inst", text: "تدفقات استثمارية قوية نحو صناديق البيتكوين المتداولة (ETFs) تدعم الصعود." }
        ],
        tips: [
            "استخدم <b>RSI</b> لتحديد مناطق التشبع الشرائي فوق 70.",
            "راقب تقاطع <b>MACD</b> على الفريم الساعي للتأكيد.",
            "فعل <b>Bollinger Bands</b> لتوقع الانفجار السعري القادم للبيتكوين."
        ]
    },
    forex: {
        news: [
            { tag: "ECB", type: "bank", text: "المركزي الأوروبي يلمح لتدخلات قريبة للسيطرة على معدلات التضخم." },
            { tag: "Goldman Sachs", type: "inst", text: "توقعات بزيادة التقلبات على زوج اليورو/دولار مع افتتاح الجلسة الأمريكية." }
        ],
        tips: [
            "استخدم <b>Fibonacci</b> لتحديد مستويات الارتداد المحتملة.",
            "راقب <b>EMA 50 & 200</b> لتأكيد الكروس الذهبي.",
            "مؤشر <b>ATR</b> ممتاز لتحديد مستويات وقف الخسارة (Stop Loss)."
        ]
    },
    gold: {
        news: [
            { tag: "World Bank", type: "bank", text: "زيادة طلب البنوك المركزية على الذهب كاحتياطي استراتيجي." },
            { tag: "Morgan Stanley", type: "inst", text: "توترات جيوسياسية تدفع المستثمرين بقوة نحو الملاذ الآمن." }
        ],
        tips: [
            "راقب مستويات الدعم والمقاومة التاريخية بقوة شديدة.",
            "استخدم <b>Moving Average 200</b> لتحديد الاتجاه العام للذهب.",
            "مؤشر <b>Stochastic</b> ممتاز للمضاربة السريعة (Scalping)."
        ]
    }
};

// نظام التنبيهات الصوتية اللحظية للخطوط الهامة (أصفر / أخضر)
function playAlertSound(type) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'green') {
        osc.frequency.value = 850; // نغمة حادة للشراء القوي
    } else if (type === 'yellow') {
        osc.frequency.value = 500; // نغمة تنبيهية للمستويات المهمة/التحذيرية
    }
    
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.6);
    osc.stop(ctx.currentTime + 0.6);
}

// بناء الشارت الديناميكي
function createWidget(symbol, type) {
    if (currentWidget) {
        document.getElementById('tradingview_widget').innerHTML = '';
    }
    
    currentWidget = new TradingView.widget({
        "autosize": true,
        "symbol": symbol,
        "interval": "60",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "ar",
        "toolbar_bg": "#12151c",
        "enable_publishing": false,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_widget"
    });

    updateTechnicalSummary(symbol);
    updateAIContext(type);
    simulateAISignal();
}

// تحديث الملخص الفني
function updateTechnicalSummary(symbol) {
    document.getElementById('tv-tech-summary').innerHTML = '';
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "interval": "1h",
        "width": "100%",
        "isTransparent": true,
        "height": "100%",
        "symbol": symbol,
        "showIntervalTabs": true,
        "locale": "ar",
        "colorTheme": "dark"
    });
    document.getElementById('tv-tech-summary').appendChild(script);
}

// تحديث الأخبار والمؤشرات بناءً على السوق (Smart Navigation)
function updateAIContext(type) {
    const data = marketAIContext[type];
    
    // تحديث الأخبار
    const newsContainer = document.getElementById('ai-news-feed');
    newsContainer.innerHTML = data.news.map(item => `
        <div class="news-item">
            <span class="tag ${item.type}">${item.tag}</span>
            <p>${item.text}</p>
        </div>
    `).join('');

    // تحديث النصائح
    const tipsContainer = document.getElementById('indicator-tips');
    tipsContainer.innerHTML = data.tips.map(tip => `
        <li><i class="fas fa-magic"></i> ${tip}</li>
    `).join('');
}

// محاكاة إشارة الذكاء الاصطناعي مع التنبيهات
function simulateAISignal() {
    const ptr = document.getElementById('gauge-ptr');
    const signalText = document.getElementById('ai-signal-result');
    const strengthText = document.getElementById('trend-strength');
    const confidenceText = document.getElementById('confidence-level');
    
    const randomVal = Math.random();
    const strength = Math.floor(Math.random() * 20 + 80); // 80% to 100%
    const confidence = Math.floor(Math.random() * 15 + 75); // 75% to 90%
    
    strengthText.innerText = `${strength}%`;
    confidenceText.innerText = `${confidence}%`;

    // الأنيميشن وحالة العداد
    if(randomVal > 0.66) {
        // أخضر - شراء قوي
        ptr.style.transform = `rotate(0.45turn)`;
        signalText.innerText = "صاعد / STRONG BUY";
        signalText.style.color = "var(--green)";
        confidenceText.style.color = "var(--green)";
        playAlertSound('green'); // تنبيه صوتي للخط الأخضر
    } else if(randomVal > 0.33) {
        // أصفر - مستوى مهم / تحذيري
        ptr.style.transform = `rotate(0.25turn)`;
        signalText.innerText = "انعكاس محتمل / WARNING";
        signalText.style.color = "var(--yellow)";
        confidenceText.style.color = "var(--yellow)";
        playAlertSound('yellow'); // تنبيه صوتي للخط الأصفر
    } else {
        // أحمر - هبوط
        ptr.style.transform = `rotate(0.05turn)`;
        signalText.innerText = "هابط / STRONG SELL";
        signalText.style.color = "var(--red)";
        confidenceText.style.color = "var(--red)";
    }
}

// التنقل بين الذهب والعملات بدون تحديث الصفحة
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        const symbol = this.getAttribute('data-symbol');
        const type = this.getAttribute('data-type');
        createWidget(symbol, type);
    });
});

// أخبار الـ Timeline المباشرة
function initNews() {
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "feedMode": "all_symbols",
        "colorTheme": "dark",
        "isTransparent": true,
        "displayMode": "regular",
        "width": "100%",
        "height": "100%",
        "locale": "ar"
    });
    document.getElementById('tv-news-timeline').appendChild(script);
}

// التشغيل الابتدائي
window.onload = () => {
    createWidget("BINANCE:BTCUSDT", "crypto");
    initNews();
    
    // تحديث الإشارة كل 30 ثانية
    setInterval(simulateAISignal, 30000); 
};
