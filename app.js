/* ═══════════════════════════════════════════════════════════
   Balance Bites — Feedback Form Logic
   ═══════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════
// CONFIG — Paste your Google Sheets URL here
// (Follow the setup instructions in SETUP.md)
// ═══════════════════════════════════════════════════════════
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwTXu6UM7NYVpvqGl7lnjMb6ItgUyXxoaQQuwdAJGlF-XSJx4j9U-LGyB64W-DtJaicHw/exec';

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
let currentStep = 0;
const TOTAL_STEPS = 10; // last step index

const formData = {
    discovery: '',
    frequency: '',
    overallRating: null,
    overallLabel: '',
    flavors: { zaatar: 0, paprika: 0, salt_pepper: 0, rosemary_basil: 0 },
    favoriteFlavor: '',
    satisfaction: { taste: 0, crunchiness: 0, packaging: 0, price: 0, availability: 0, nutrition: 0 },
    recommend: '',
    suggestions: '',
    name: '',
    phone: '',
    email: ''
};

// ═══════════════════════════════════════════════════════════
// INIT — Particles + Greeting
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    initLeaves();
    setGreeting();
});

function initLeaves() {
    const bg = document.getElementById('bg');
    const colors = [
        'rgba(61, 107, 79, 0.25)',
        'rgba(90, 158, 111, 0.2)',
        'rgba(44, 74, 54, 0.2)',
        'rgba(131, 165, 110, 0.2)'
    ];
    for (let i = 0; i < 14; i++) {
        const p = document.createElement('div');
        p.className = 'leaf';
        const size = Math.random() * 6 + 3;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDuration = (Math.random() * 14 + 12) + 's';
        p.style.animationDelay = (Math.random() * 12) + 's';
        bg.appendChild(p);
    }
}

function setGreeting() {
    const hour = new Date().getHours();
    const el = document.getElementById('greeting');
    if (!el) return;
    if (hour < 12) el.textContent = 'صباح الخير! 🌿';
    else if (hour < 18) el.textContent = 'مساء الخير! 🌿';
    else el.textContent = 'مساء الخير! 🌿';
}

// ═══════════════════════════════════════════════════════════
// HAPTIC FEEDBACK (mobile)
// ═══════════════════════════════════════════════════════════
function haptic() {
    if (navigator.vibrate) navigator.vibrate(10);
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════
function goTo(step) {
    if (step === currentStep) return;

    const steps = document.querySelectorAll('.step');
    const prev = steps[currentStep];
    const next = steps[step];

    // Exit animation
    if (step > currentStep) {
        prev.classList.remove('active');
        prev.classList.add('exit-up');
    } else {
        prev.classList.remove('active');
        prev.style.transform = 'translateY(50px)';
        prev.style.opacity = '0';
    }

    setTimeout(() => {
        prev.classList.remove('exit-up');
        prev.style.transform = '';
        prev.style.opacity = '';
    }, 500);

    // Enter
    next.classList.add('active');
    currentStep = step;
    next.scrollTop = 0;

    // Progress bar
    const progress = step === 0 ? 0 : (step / TOTAL_STEPS) * 100;
    document.getElementById('progressFill').style.width = progress + '%';

    // Auto-focus first input
    setTimeout(() => {
        const input = next.querySelector('textarea, input');
        if (input) input.focus();
    }, 400);
}

// ═══════════════════════════════════════════════════════════
// DISCOVERY — "How did you hear about us?"
// ═══════════════════════════════════════════════════════════
function selectDiscovery(card) {
    haptic();
    document.querySelectorAll('#step-discovery .select-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    formData.discovery = card.dataset.value;
    setTimeout(() => goTo(2), 350);
}

// ═══════════════════════════════════════════════════════════
// FREQUENCY — "How often do you buy?"
// ═══════════════════════════════════════════════════════════
function selectFrequency(card) {
    haptic();
    document.querySelectorAll('#step-frequency .select-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    formData.frequency = card.dataset.value;
    setTimeout(() => goTo(3), 350);
}

// ═══════════════════════════════════════════════════════════
// OVERALL RATING
// ═══════════════════════════════════════════════════════════
function selectOverall(btn) {
    haptic();
    document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    formData.overallRating = parseInt(btn.dataset.rating);
    formData.overallLabel = btn.querySelector('.emoji-label').textContent;
    document.getElementById('btnOverall').disabled = false;
    setTimeout(() => goTo(4), 350);
}

// ═══════════════════════════════════════════════════════════
// FLAVOR RATINGS (star wave animation)
// ═══════════════════════════════════════════════════════════
function rateFlavor(flavor, rating) {
    haptic();
    formData.flavors[flavor] = rating;
    const container = document.querySelector(`.star-rating[data-flavor="${flavor}"]`);
    const stars = container.querySelectorAll('.star-btn');
    stars.forEach((s, i) => {
        const isActive = (i + 1) <= rating;
        // Wave animation: stagger the class toggle
        setTimeout(() => {
            s.classList.toggle('active', isActive);
        }, i * 40);
    });
}

// ═══════════════════════════════════════════════════════════
// FAVORITE FLAVOR
// ═══════════════════════════════════════════════════════════
function selectFavorite(card) {
    haptic();
    document.querySelectorAll('#step-favorite .select-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    formData.favoriteFlavor = card.dataset.value;
    setTimeout(() => goTo(6), 350);
}

// ═══════════════════════════════════════════════════════════
// SATISFACTION RATINGS (with wave)
// ═══════════════════════════════════════════════════════════
function rateArea(area, rating) {
    haptic();
    formData.satisfaction[area] = rating;
    const container = document.querySelector(`.mini-stars[data-area="${area}"]`);
    const stars = container.querySelectorAll('.mini-star');
    stars.forEach((s, i) => {
        setTimeout(() => {
            s.classList.toggle('active', (i + 1) <= rating);
        }, i * 30);
    });
}

// ═══════════════════════════════════════════════════════════
// RECOMMEND
// ═══════════════════════════════════════════════════════════
function selectRecommend(btn) {
    haptic();
    document.querySelectorAll('.recommend-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    formData.recommend = btn.dataset.value;
    document.getElementById('btnRecommend').disabled = false;
    setTimeout(() => goTo(8), 350);
}

// ═══════════════════════════════════════════════════════════
// SUBMIT
// ═══════════════════════════════════════════════════════════
async function submitForm() {
    const btn = document.getElementById('btnSubmit');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> جاري الإرسال...';

    // Gather text fields
    formData.suggestions = document.getElementById('suggestions').value.trim();
    formData.name = document.getElementById('userName').value.trim();
    formData.phone = document.getElementById('userPhone').value.trim();
    formData.email = document.getElementById('userEmail').value.trim();

    // Build payload for Google Sheets
    const payload = {
        timestamp: new Date().toLocaleString('ar-EG'),
        discovery: formData.discovery || '-',
        frequency: formData.frequency || '-',
        overallRating: formData.overallRating || 0,
        overallLabel: formData.overallLabel || '-',
        zaatar: formData.flavors.zaatar,
        paprika: formData.flavors.paprika,
        salt_pepper: formData.flavors.salt_pepper,
        rosemary_basil: formData.flavors.rosemary_basil,
        favoriteFlavor: formData.favoriteFlavor || '-',
        taste: formData.satisfaction.taste,
        crunchiness: formData.satisfaction.crunchiness,
        packaging: formData.satisfaction.packaging,
        price: formData.satisfaction.price,
        availability: formData.satisfaction.availability,
        nutrition: formData.satisfaction.nutrition,
        recommend: formData.recommend || '-',
        suggestions: formData.suggestions || '-',
        name: formData.name || '-',
        phone: formData.phone || '-',
        email: formData.email || '-'
    };

    // Use hidden form + iframe to bypass ALL CORS restrictions
    // (works from file://, localhost, any domain)
    try {
        // Create hidden iframe
        let iframe = document.getElementById('_hidden_iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = '_hidden_iframe';
            iframe.name = '_hidden_iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }

        // Create hidden form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = GOOGLE_SHEETS_URL;
        form.target = '_hidden_iframe';
        form.style.display = 'none';

        // Add each field as a hidden input
        for (const [key, value] of Object.entries(payload)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        goTo(10);
        launchConfetti();
    } catch (err) {
        console.warn('Sheets error, saving locally:', err);
        saveLocally(payload);
        goTo(10);
        launchConfetti();
    }

    btn.disabled = false;
    btn.innerHTML = originalHTML;
}

function saveLocally(payload) {
    const responses = JSON.parse(localStorage.getItem('bb_feedback') || '[]');
    responses.push(payload);
    localStorage.setItem('bb_feedback', JSON.stringify(responses));
}

// ═══════════════════════════════════════════════════════════
// CONFETTI 🎉
// ═══════════════════════════════════════════════════════════
function launchConfetti() {
    const container = document.getElementById('confetti');
    const colors = ['#3D6B4F', '#5A9E6F', '#F59E0B', '#E8DFD0', '#83A56E', '#2C4A36', '#A8D5BA'];
    for (let i = 0; i < 70; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        const size = Math.random() * 8 + 5;
        piece.style.width = size + 'px';
        piece.style.height = size + 'px';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = Math.random() * 100 + '%';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
        piece.style.animationDelay = (Math.random() * 0.8) + 's';
        container.appendChild(piece);
    }
    setTimeout(() => { container.innerHTML = ''; }, 4000);
}

// ═══════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION
// ═══════════════════════════════════════════════════════════
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (e.target.tagName === 'TEXTAREA' && !e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        if (currentStep === 0) goTo(1);
        else if (currentStep === 1 && formData.discovery) goTo(2);
        else if (currentStep === 2 && formData.frequency) goTo(3);
        else if (currentStep === 3 && formData.overallRating) goTo(4);
        else if (currentStep === 4) goTo(5);
        else if (currentStep === 5 && formData.favoriteFlavor) goTo(6);
        else if (currentStep === 6) goTo(7);
        else if (currentStep === 7 && formData.recommend) goTo(8);
        else if (currentStep === 8) goTo(9);
        else if (currentStep === 9) submitForm();
    }
});
