/* =========================================
   BIRTHDAY WEBSITE - JAVASCRIPT
   Confetti, Countdown, Wishes, Music & More
   ========================================= */

// =============================================
// CONFETTI SYSTEM
// =============================================
class ConfettiSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.colors = [
            '#ff6b9d', '#c44dff', '#ffd93d', '#4ecdc4',
            '#ff8a5c', '#6c5ce7', '#a8e6cf', '#ff4757',
            '#70a1ff', '#ffa502', '#2ed573', '#ff6348'
        ];
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y) {
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || -10,
            size: Math.random() * 8 + 3,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            velocityX: (Math.random() - 0.5) * 6,
            velocityY: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            opacity: 1,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
            wobble: Math.random() * 10,
            wobbleSpeed: Math.random() * 0.1 + 0.05
        };
    }

    burst(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            const particle = this.createParticle(x, y);
            particle.velocityX = (Math.random() - 0.5) * 15;
            particle.velocityY = (Math.random() - 0.5) * 15 - 5;
            this.particles.push(particle);
        }
        if (!this.animationId) this.animate();
    }

    rain(duration = 3000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            if (Date.now() - startTime > duration) {
                clearInterval(interval);
                return;
            }
            for (let i = 0; i < 3; i++) {
                this.particles.push(this.createParticle());
            }
        }, 50);
        if (!this.animationId) this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, index) => {
            p.x += p.velocityX + Math.sin(p.wobble) * 0.5;
            p.y += p.velocityY;
            p.rotation += p.rotationSpeed;
            p.wobble += p.wobbleSpeed;
            p.velocityY += 0.05; // gravity
            p.opacity -= 0.003;

            if (p.opacity <= 0 || p.y > this.canvas.height + 20) {
                this.particles.splice(index, 1);
                return;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        });

        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.animationId = null;
        }
    }
}

// =============================================
// FLOATING EMOJIS
// =============================================
function createFloatingEmojis() {
    const container = document.getElementById('floatingElements');
    const emojis = ['🎈', '🎉', '🎊', '🎁', '⭐', '🌟', '✨', '💖', '🎂', '🧁', '🍰', '🎀', '💝', '🦋'];

    function addEmoji() {
        const emoji = document.createElement('span');
        emoji.classList.add('floating-emoji');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        emoji.style.animationDuration = (Math.random() * 10 + 10) + 's';
        emoji.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(emoji);

        emoji.addEventListener('animationend', () => emoji.remove());
    }

    // Initial batch
    for (let i = 0; i < 8; i++) {
        setTimeout(() => addEmoji(), i * 500);
    }

    // Continuous
    setInterval(addEmoji, 3000);
}

// =============================================
// COUNTDOWN TIMER
// =============================================
function initCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Birthday: July 15
    let birthday = new Date(currentYear, 6, 15, 0, 0, 0); // Month is 0-indexed
    
    // If birthday has passed this year, set for next year
    if (now > new Date(currentYear, 6, 15, 23, 59, 59)) {
        birthday = new Date(currentYear + 1, 6, 15, 0, 0, 0);
    }

    const titleEl = document.getElementById('countdownTitle');

    function update() {
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
        const bdayStr = `${birthday.getFullYear()}-6-15`;

        // Check if today IS the birthday
        if (now.getMonth() === 6 && now.getDate() === 15) {
            titleEl.textContent = "🎉 It's Your Birthday Today! 🎉";
            document.body.classList.add('birthday-today');
            document.getElementById('days').textContent = '🎂';
            document.getElementById('hours').textContent = '🎈';
            document.getElementById('minutes').textContent = '🎉';
            document.getElementById('seconds').textContent = '🎁';
            document.querySelectorAll('.countdown-label').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.countdown-separator').forEach(el => el.style.display = 'none');
            return;
        }

        const diff = birthday - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

// =============================================
// WISHES SYSTEM  (Google Sheets Backend)
// =============================================

// ⚠️  PASTE YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL BELOW  ⚠️
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';

function initWishes() {
    const form = document.getElementById('wishForm');
    const wall = document.getElementById('wishesWall');
    const nameInput = document.getElementById('wishName');
    const messageInput = document.getElementById('wishMessage');
    const submitBtn = document.getElementById('submitWish');

    const emojis = ['🎂', '🎈', '🎉', '🎊', '🎁', '💝', '💖', '⭐', '🌟', '✨', '🧁', '🎀'];
    const hues = [340, 200, 120, 40, 280, 160, 20, 300, 60, 220];

    // ---------- Fetch existing wishes from Google Sheets ----------
    loadWishes();

    async function loadWishes() {
        // If URL isn't configured yet, keep the default placeholder cards
        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
            console.warn('⚠️  Google Script URL not set — using demo wishes.');
            return;
        }

        try {
            // Clear the default placeholder cards
            wall.innerHTML = '<div class="wishes-loading">Loading wishes ✨</div>';

            const res = await fetch(GOOGLE_SCRIPT_URL);
            const data = await res.json();

            wall.innerHTML = '';

            if (data.success && data.wishes.length > 0) {
                // Show newest first
                data.wishes.reverse().forEach(w => {
                    addWishCard(w.name, w.message, w.hue || randomHue(), w.emoji || '🎂', false);
                });
            } else {
                wall.innerHTML = '<p class="wishes-empty">Be the first to leave a wish! 💌</p>';
            }
        } catch (err) {
            console.error('Failed to load wishes:', err);
            wall.innerHTML = '<p class="wishes-empty">Could not load wishes — try refreshing 🔄</p>';
        }
    }

    // ---------- Submit a new wish ----------
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        if (!name || !message) return;

        const hue = randomHue();
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Disable button while sending
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Sending...';

        // If URL isn't configured, fall back to local-only display
        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
            // Remove the "be the first" message if present
            const emptyMsg = wall.querySelector('.wishes-empty');
            if (emptyMsg) emptyMsg.remove();

            addWishCard(name, message, hue, emoji, true);
            resetForm();
            showToast('Wish added locally (Google Sheets not connected) 📝');
            return;
        }

        try {
            const res = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ name, message, emoji, hue }),
                headers: { 'Content-Type': 'text/plain' }
                // text/plain avoids CORS preflight with Apps Script
            });

            const data = await res.json();

            if (data.success) {
                // Remove the "be the first" message if present
                const emptyMsg = wall.querySelector('.wishes-empty');
                if (emptyMsg) emptyMsg.remove();

                addWishCard(name, message, hue, emoji, true);
                resetForm();

                // Confetti burst!
                const rect = form.getBoundingClientRect();
                confetti.burst(rect.left + rect.width / 2, rect.top, 30);

                showToast('Wish sent! 🎉');
            } else {
                showToast('Something went wrong — try again 😢');
                resetForm();
            }
        } catch (err) {
            console.error('Submit error:', err);
            showToast('Network error — please try again 🔄');
            resetForm();
        }
    });

    function resetForm() {
        nameInput.value = '';
        messageInput.value = '';
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Send Wishes';
    }

    function randomHue() {
        return hues[Math.floor(Math.random() * hues.length)];
    }

    function addWishCard(name, message, hue, emoji, animate) {
        const card = document.createElement('div');
        card.classList.add('wish-card');
        card.style.setProperty('--hue', hue);
        if (animate) {
            card.style.animationDuration = '0.5s';
        } else {
            card.style.animation = 'none';
            card.style.opacity = '1';
        }

        card.innerHTML = `
            <div class="wish-card-header">
                <span class="wish-author">${escapeHtml(name)}</span>
                <span class="wish-emoji">${emoji}</span>
            </div>
            <p class="wish-text">${escapeHtml(message)}</p>
        `;

        wall.insertBefore(card, wall.firstChild);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =============================================
// TOAST NOTIFICATION
// =============================================
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// =============================================
// MUSIC SYSTEM
// =============================================
function initMusic() {
    const toggle = document.getElementById('musicToggle');
    const statusEl = toggle.querySelector('.music-status');
    const audio = document.getElementById('bgMusic');

    toggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                toggle.classList.add('playing');
                statusEl.textContent = 'ON';
            }).catch(err => {
                console.warn('Audio playback failed:', err);
                showToast('Could not play music — check your audio file 🔇');
            });
        } else {
            audio.pause();
            toggle.classList.remove('playing');
            statusEl.textContent = 'OFF';
        }
    });

    // Update toggle state when audio ends (if not looping)
    audio.addEventListener('ended', () => {
        toggle.classList.remove('playing');
        statusEl.textContent = 'OFF';
    });
}

// =============================================
// SCROLL REVEAL ANIMATIONS
// =============================================
function initScrollReveal() {
    const sections = document.querySelectorAll('.countdown-section, .gallery-section, .wishes-section');
    sections.forEach(section => section.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger confetti when gallery comes into view
                if (entry.target.classList.contains('gallery-section')) {
                    setTimeout(() => confetti.rain(1500), 500);
                }
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(section => observer.observe(section));
}

// =============================================
// INTERACTIVE ELEMENTS
// =============================================
function initInteractions() {
    // Click on gallery items for confetti
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const rect = item.getBoundingClientRect();
            confetti.burst(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                25
            );
        });
    });

    // Click on balloons
    document.querySelectorAll('.balloon').forEach(balloon => {
        balloon.addEventListener('click', (e) => {
            const rect = balloon.getBoundingClientRect();
            confetti.burst(rect.left, rect.top, 20);
            balloon.style.transform = 'scale(1.5)';
            balloon.style.opacity = '0';
            setTimeout(() => {
                balloon.style.transform = '';
                balloon.style.opacity = '';
            }, 1000);
        });
        balloon.style.cursor = 'pointer';
        balloon.style.pointerEvents = 'auto';
    });

    // Click on the cake
    document.querySelector('.cake-emoji').addEventListener('click', (e) => {
        const rect = e.target.getBoundingClientRect();
        confetti.burst(rect.left + rect.width / 2, rect.top, 60);
    });
    document.querySelector('.cake-emoji').style.cursor = 'pointer';
}

// =============================================
// INITIALIZE EVERYTHING
// =============================================
let confetti;

document.addEventListener('DOMContentLoaded', () => {
    confetti = new ConfettiSystem(document.getElementById('confettiCanvas'));
    
    // Initial confetti celebration
    setTimeout(() => confetti.rain(2000), 1000);
    
    createFloatingEmojis();
    initCountdown();
    initWishes();
    initMusic();
    initScrollReveal();
    initInteractions();
});
