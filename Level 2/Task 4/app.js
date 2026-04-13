/**
 * AetherBuilder — Enhanced Interactive Profile Builder
 * Features: animated progress, step dots, field icons, confetti, typing cursor
 */

class ProfileBuilder {
    constructor() {
        this.initDOM();
        this.initState();
        this.bindEvents();
    }

    initDOM() {
        this.form = document.getElementById('profile-form');
        this.inputs = {
            fullName: document.getElementById('fullName'),
            role: document.getElementById('role'),
            email: document.getElementById('email'),
            bio: document.getElementById('bio')
        };
        this.submitBtn = document.getElementById('submit-btn');

        this.preview = {
            fullName: document.getElementById('prev-name'),
            role: document.getElementById('prev-role'),
            email: document.getElementById('prev-email'),
            bio: document.getElementById('prev-bio'),
            avatar: document.getElementById('prev-avatar'),
            card: document.getElementById('preview-card')
        };

        this.progressText = document.getElementById('progress-text');
        this.progressBar = document.getElementById('progress-bar');
        this.progressGlow = document.getElementById('progress-glow');
        this.stepDots = document.querySelectorAll('.step-dot');
        this.bioCount = document.getElementById('bio-count');
        this.toast = document.getElementById('success-toast');
        this.confettiCanvas = document.getElementById('confetti-canvas');

        // Map field keys to step indices
        this.fieldOrder = ['fullName', 'role', 'email', 'bio'];
    }

    initState() {
        this.validationRules = {
            fullName: (val) => val.trim().length >= 3,
            role: (val) => val.trim().length > 0,
            email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            bio: (val) => val.trim().length >= 10 && val.trim().length <= 150
        };

        this.defaults = {
            fullName: 'Your Name',
            role: 'Your Role',
            email: 'email@example.com',
            bio: 'Your bio will appear here as you type. Make it engaging and concise.'
        };

        this.fieldStatus = {
            fullName: false,
            role: false,
            email: false,
            bio: false
        };

        this.activeField = null;
        this.prevPercentage = 0;
    }

    bindEvents() {
        Object.keys(this.inputs).forEach(key => {
            const el = this.inputs[key];

            el.addEventListener('focus', () => {
                this.activeField = key;
                el.closest('.form-group').classList.add('focused');
                this.updateStepDots();
            });

            el.addEventListener('blur', () => {
                el.closest('.form-group').classList.remove('focused');
                this.validateField(key, el.value);
                this.activeField = null;
                this.updateStepDots();
            });

            el.addEventListener('input', (e) => {
                this.handleInput(key, e.target.value);
            });
        });

        // Step dot clicks → focus matching field
        this.stepDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                const key = this.fieldOrder[i];
                this.inputs[key].focus();
            });
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    // ── Input Handling ──────────────────────────────────────────

    handleInput(key, value) {
        if (key === 'bio') {
            this.bioCount.textContent = value.length;
            this.bioCount.style.color = value.length > 150 ? 'var(--error)' :
                                        value.length > 120 ? 'var(--warning)' : '';
        }

        this.updatePreview(key, value);
        this.validateField(key, value);
    }

    // ── Live Preview ────────────────────────────────────────────

    updatePreview(key, value) {
        const targetEl = this.preview[key];
        if (!targetEl) return;

        const displayValue = value.trim() ? value : this.defaults[key];

        if (targetEl.textContent !== displayValue) {
            targetEl.textContent = displayValue;
            targetEl.classList.remove('highlight');
            void targetEl.offsetWidth;
            targetEl.classList.add('highlight');
        }

        if (key === 'fullName') {
            const initials = value.trim()
                .split(' ')
                .filter(Boolean)
                .map(n => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase() || 'JD';

            if (this.preview.avatar.textContent !== initials) {
                this.preview.avatar.textContent = initials;
                this.preview.avatar.classList.remove('changed');
                void this.preview.avatar.offsetWidth;
                this.preview.avatar.classList.add('changed');
            }
        }
    }

    // ── Validation ──────────────────────────────────────────────

    validateField(key, value) {
        const isValid = this.validationRules[key](value);
        const formGroup = this.inputs[key].closest('.form-group');

        if (value.trim() === '') {
            formGroup.classList.remove('success', 'error');
            this.fieldStatus[key] = false;
        } else if (isValid) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
            this.fieldStatus[key] = true;
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            this.fieldStatus[key] = false;
        }

        this.updateProgress();
        this.updateStepDots();
    }

    // ── Progress Bar ────────────────────────────────────────────

    updateProgress() {
        const totalFields = Object.keys(this.fieldStatus).length;
        const validFields = Object.values(this.fieldStatus).filter(Boolean).length;
        const percentage = Math.round((validFields / totalFields) * 100);

        // Animate the number
        this.animateNumber(this.prevPercentage, percentage);
        this.prevPercentage = percentage;

        this.progressBar.style.width = `${percentage}%`;
        this.submitBtn.disabled = percentage !== 100;

        // Glow effect tracks the bar end
        if (percentage > 0) {
            this.progressGlow.style.opacity = '1';
            this.progressGlow.style.left = `calc(${percentage}% - 8px)`;
        } else {
            this.progressGlow.style.opacity = '0';
        }

        // Card completion state
        if (percentage === 100) {
            this.preview.card.classList.add('complete');
        } else {
            this.preview.card.classList.remove('complete');
        }
    }

    animateNumber(from, to) {
        const duration = 400;
        const start = performance.now();

        const step = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = Math.round(from + (to - from) * eased);
            this.progressText.textContent = `${current}%`;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }

    // ── Step Dots ───────────────────────────────────────────────

    updateStepDots() {
        this.fieldOrder.forEach((key, i) => {
            const dot = this.stepDots[i];
            dot.classList.remove('completed', 'active');

            if (this.fieldStatus[key]) {
                dot.classList.add('completed');
            } else if (this.activeField === key) {
                dot.classList.add('active');
            }
        });
    }

    // ── Submit ──────────────────────────────────────────────────

    handleSubmit() {
        if (this.submitBtn.disabled) return;

        this.submitBtn.classList.add('loading');
        this.submitBtn.disabled = true;

        setTimeout(() => {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.classList.add('success-state');
            this.submitBtn.querySelector('.btn-text').textContent = '✓ Profile Saved';

            this.toast.classList.add('show');
            this.launchConfetti();

            setTimeout(() => {
                this.toast.classList.remove('show');
                this.submitBtn.classList.remove('success-state');
                this.submitBtn.querySelector('.btn-text').textContent = 'Save Profile';
                this.submitBtn.disabled = false;
            }, 4000);
        }, 1500);
    }

    // ── Confetti ────────────────────────────────────────────────

    launchConfetti() {
        const canvas = this.confettiCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6'];

        for (let i = 0; i < 80; i++) {
            particles.push({
                x: canvas.width / 2 + (Math.random() - 0.5) * 200,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 14,
                vy: (Math.random() - 1) * 16,
                w: Math.random() * 10 + 4,
                h: Math.random() * 6 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 12,
                gravity: 0.3 + Math.random() * 0.2,
                opacity: 1
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;

            particles.forEach(p => {
                p.x += p.vx;
                p.vy += p.gravity;
                p.y += p.vy;
                p.rotation += p.rotSpeed;
                p.opacity -= 0.008;

                if (p.opacity > 0) {
                    alive = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                    ctx.restore();
                }
            });

            if (alive) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        requestAnimationFrame(animate);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ProfileBuilder();
});
