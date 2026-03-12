/* ═══════════════════════════════════════════════════════════
   Balance Bites — Feedback Form Logic (v4 Premium)
   ═══════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwTXu6UM7NYVpvqGl7lnjMb6ItgUyXxoaQQuwdAJGlF-XSJx4j9U-LGyB64W-DtJaicHw/exec';

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
let currentStep = 0;
const TOTAL_STEPS = 10;
const ANIM_TYPES = ['default', 'anim-scale', 'anim-slide-left', 'anim-fade'];

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
// INIT
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    initLeaves();
    setGreeting();
    initDarkMode();
    initShareLinks();
    generateQR();
    initSwipe();
    restoreProgress();

    // Skeleton loader — hide after a short delay
    setTimeout(() => {
        const loader = document.getElementById('skeletonLoader');
        if (loader) loader.classList.add('hidden');
    }, 800);
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
    el.textContent = hour < 12 ? 'صباح الخير! 🌿' : 'مساء الخير! 🌿';
}

// ═══════════════════════════════════════════════════════════
// HAPTIC + PULSE GLOW
// ═══════════════════════════════════════════════════════════
function haptic() {
    if (navigator.vibrate) navigator.vibrate(10);
}

function pulseGlow(el) {
    el.classList.remove('pulse-glow');
    void el.offsetWidth;
    el.classList.add('pulse-glow');
    el.addEventListener('animationend', () => el.classList.remove('pulse-glow'), { once: true });
}

// ═══════════════════════════════════════════════════════════
// PROGRESS DOTS
// ═══════════════════════════════════════════════════════════
function updateDots(step) {
    const dots = document.querySelectorAll('.progress-dots .dot');
    const container = document.getElementById('progressDots');
    if (step === 0 || step === 10) {
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';
    } else {
        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';
    }
    dots.forEach((dot, i) => {
        dot.classList.remove('active', 'completed');
        if (i + 1 === step) dot.classList.add('active');
        else if (i + 1 < step) dot.classList.add('completed');
    });
}

// ═══════════════════════════════════════════════════════════
// ENCOURAGEMENT TOAST
// ═══════════════════════════════════════════════════════════
const ENCOURAGE_MSGS = {
    7: 'باقي خطوتين بس! 💪',
    8: 'تقريباً خلصت! ✨',
    9: 'آخر خطوة! 🎉'
};

function showEncouragement(step) {
    const msg = ENCOURAGE_MSGS[step];
    if (!msg) return;
    const toast = document.getElementById('encourageToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2500);
}

// ═══════════════════════════════════════════════════════════
// VALIDATION HINTS
// ═══════════════════════════════════════════════════════════
function showValidationHint(container, msg) {
    haptic();
    // Shake the container
    container.classList.remove('shake');
    void container.offsetWidth;
    container.classList.add('shake');
    container.addEventListener('animationend', () => container.classList.remove('shake'), { once: true });

    // Show hint text if not already present
    let hint = container.parentElement.querySelector('.validation-hint');
    if (!hint) {
        hint = document.createElement('div');
        hint.className = 'validation-hint';
        hint.textContent = msg;
        container.parentElement.appendChild(hint);
        setTimeout(() => { if (hint.parentElement) hint.remove(); }, 2500);
    }
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════
function goTo(step) {
    if (step === currentStep) return;

    const steps = document.querySelectorAll('.step');
    const prev = steps[currentStep];
    const next = steps[step];

    // Pick random animation type
    const animType = ANIM_TYPES[Math.floor(Math.random() * ANIM_TYPES.length)];
    steps.forEach(s => ANIM_TYPES.forEach(a => { if (a !== 'default') s.classList.remove(a); }));
    if (animType !== 'default') {
        prev.classList.add(animType);
        next.classList.add(animType);
    }

    // Exit
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

    // Progress
    const progress = step === 0 ? 0 : (step / TOTAL_STEPS) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    updateDots(step);

    // Encouragement
    showEncouragement(step);

    // Completion counter on thank you page
    if (step === 10) showCompletionCounter();

    // Auto-focus
    setTimeout(() => {
        const input = next.querySelector('textarea, input');
        if (input) input.focus();
    }, 400);

    // Save progress
    saveProgress();
}

// ═══════════════════════════════════════════════════════════
// SWIPE NAVIGATION (mobile)
// ═══════════════════════════════════════════════════════════
function initSwipe() {
    let startX = 0, startY = 0, swiping = false;

    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        swiping = true;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (!swiping) return;
        swiping = false;
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;

        // Only swipe if horizontal movement > 60px and > vertical movement
        if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;

        if (dx > 0) {
            // Swipe right → next step (RTL: right = forward)
            handleSwipeForward();
        } else {
            // Swipe left → previous step (RTL: left = back)
            handleSwipeBack();
        }
    }, { passive: true });
}

function handleSwipeForward() {
    if (currentStep === 0) goTo(1);
    else if (currentStep === 1 && formData.discovery) goTo(2);
    else if (currentStep === 2 && formData.frequency) goTo(3);
    else if (currentStep === 3 && formData.overallRating) goTo(4);
    else if (currentStep === 4) goTo(5);
    else if (currentStep === 5 && formData.favoriteFlavor) goTo(6);
    else if (currentStep === 6) goTo(7);
    else if (currentStep === 7 && formData.recommend) goTo(8);
    else if (currentStep === 8) goTo(9);
    else if (currentStep >= 1 && currentStep <= 9) {
        // Show validation if trying to swipe forward without selection
        const step = document.querySelectorAll('.step')[currentStep];
        const grid = step.querySelector('.select-grid, .emoji-grid, .recommend-grid');
        if (grid) showValidationHint(grid, 'اختار إجابة الأول ✋');
    }
}

function handleSwipeBack() {
    if (currentStep > 0 && currentStep <= 9) goTo(currentStep - 1);
}

// ═══════════════════════════════════════════════════════════
// AUTO-SAVE PROGRESS
// ═══════════════════════════════════════════════════════════
function saveProgress() {
    try {
        localStorage.setItem('bb_progress', JSON.stringify({
            step: currentStep,
            data: formData
        }));
    } catch (e) { /* ignore */ }
}

function restoreProgress() {
    try {
        const saved = localStorage.getItem('bb_progress');
        if (!saved) return;
        const { step, data } = JSON.parse(saved);
        if (!data || step >= 10) {
            localStorage.removeItem('bb_progress');
            return;
        }
        // Restore formData
        Object.assign(formData, data);
        // Jump to saved step
        if (step > 0 && step < 10) {
            setTimeout(() => goTo(step), 900); // After skeleton hides
        }
    } catch (e) {
        localStorage.removeItem('bb_progress');
    }
}

// ═══════════════════════════════════════════════════════════
// COMPLETION COUNTER
// ═══════════════════════════════════════════════════════════
function showCompletionCounter() {
    const container = document.querySelector('[data-step="10"] .step-content');
    if (!container || container.querySelector('.completion-counter')) return;

    // Get count from localStorage
    let count = parseInt(localStorage.getItem('bb_response_count') || '0') + 1;
    localStorage.setItem('bb_response_count', count.toString());



    // Insert after subtitle
    const subtitle = container.querySelector('.step-subtitle');
    if (subtitle) subtitle.after(counter);

    // Clear saved progress
    localStorage.removeItem('bb_progress');
}

// ═══════════════════════════════════════════════════════════
// SELECTIONS
// ═══════════════════════════════════════════════════════════
function selectDiscovery(card) {
    haptic(); pulseGlow(card);
    document.querySelectorAll('#step-discovery .select-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    formData.discovery = card.dataset.value;
    setTimeout(() => goTo(2), 350);
}

function selectFrequency(card) {
    haptic(); pulseGlow(card);
    document.querySelectorAll('#step-frequency .select-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    formData.frequency = card.dataset.value;
    setTimeout(() => goTo(3), 350);
}

function selectOverall(btn) {
    haptic(); pulseGlow(btn);
    document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    formData.overallRating = parseInt(btn.dataset.rating);
    formData.overallLabel = btn.querySelector('.emoji-label').textContent;
    document.getElementById('btnOverall').disabled = false;
    setTimeout(() => goTo(4), 350);
}

function rateFlavor(flavor, rating) {
    haptic();
    formData.flavors[flavor] = rating;
    const container = document.querySelector(`.star-rating[data-flavor="${flavor}"]`);
    const stars = container.querySelectorAll('.star-btn');
    stars.forEach((s, i) => {
        setTimeout(() => s.classList.toggle('active', (i + 1) <= rating), i * 40);
    });
    saveProgress();
}

function selectFavorite(card) {
    haptic(); pulseGlow(card);
    document.querySelectorAll('#step-favorite .select-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    formData.favoriteFlavor = card.dataset.value;
    setTimeout(() => goTo(6), 350);
}

function rateArea(area, rating) {
    haptic();
    formData.satisfaction[area] = rating;
    const container = document.querySelector(`.mini-stars[data-area="${area}"]`);
    const stars = container.querySelectorAll('.mini-star');
    stars.forEach((s, i) => {
        setTimeout(() => s.classList.toggle('active', (i + 1) <= rating), i * 30);
    });
    saveProgress();
}

function selectRecommend(btn) {
    haptic(); pulseGlow(btn);
    document.querySelectorAll('.recommend-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    formData.recommend = btn.dataset.value;
    document.getElementById('btnRecommend').disabled = false;
    setTimeout(() => goTo(8), 350);
}

// ═══════════════════════════════════════════════════════════
// DARK MODE
// ═══════════════════════════════════════════════════════════
function initDarkMode() {
    if (localStorage.getItem('bb_dark') === 'true') {
        document.body.classList.add('dark');
        document.getElementById('themeIcon').textContent = '☀️';
    }
}

function toggleDark() {
    haptic();
    const isDark = document.body.classList.toggle('dark');
    document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('bb_dark', isDark);
}

// ═══════════════════════════════════════════════════════════
// SHARING
// ═══════════════════════════════════════════════════════════
function getFormURL() {
    return window.location.href.split('#')[0].split('?')[0];
}

function initShareLinks() {
    const url = getFormURL();
    const text = encodeURIComponent('جرّب منتجات Balance Bites وشاركهم رأيك! 🌿\n' + url);
    const wa = document.getElementById('shareWhatsApp');
    if (wa) wa.href = `https://wa.me/?text=${text}`;
}

function copyFormLink() {
    haptic();
    navigator.clipboard.writeText(getFormURL()).then(() => {
        const btn = document.querySelector('.share-btn.copy-link');
        const original = btn.innerHTML;
        btn.innerHTML = '✅ تم النسخ!';
        setTimeout(() => { btn.innerHTML = original; }, 2000);
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = getFormURL();
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    });
}

// ═══════════════════════════════════════════════════════════
// QR CODE
// ═══════════════════════════════════════════════════════════
function generateQR() {
    const container = document.getElementById('qrCode');
    if (!container) return;
    const img = document.createElement('img');
    img.src = 'qr-code.png';
    img.alt = 'QR Code';
    img.style.width = '120px';
    img.style.height = '120px';
    container.appendChild(img);
}

// ═══════════════════════════════════════════════════════════
// SUBMIT
// ═══════════════════════════════════════════════════════════
async function submitForm() {
    const btn = document.getElementById('btnSubmit');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> جاري الإرسال...';

    formData.suggestions = document.getElementById('suggestions').value.trim();
    formData.name = document.getElementById('userName').value.trim();
    formData.phone = document.getElementById('userPhone').value.trim();
    formData.email = document.getElementById('userEmail').value.trim();

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

    try {
        let iframe = document.getElementById('_hidden_iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = '_hidden_iframe';
            iframe.name = '_hidden_iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = GOOGLE_SHEETS_URL;
        form.target = '_hidden_iframe';
        form.style.display = 'none';

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
// CONFETTI
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
// KEYBOARD NAV
// ═══════════════════════════════════════════════════════════
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (e.target.tagName === 'TEXTAREA' && !e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        handleSwipeForward();
    }
});
