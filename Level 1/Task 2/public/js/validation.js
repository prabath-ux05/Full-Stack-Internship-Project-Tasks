/**
 * Task 2 — Advanced Validation Client JS
 * Real-time validation, animated borders, password strength, email suggestions
 */
document.addEventListener('DOMContentLoaded', () => {
    const form     = document.getElementById('regForm');
    const nameIn   = document.getElementById('name');
    const emailIn  = document.getElementById('email');
    const passIn   = document.getElementById('password');
    const submitBtn = document.getElementById('submitBtn');

    // Rings
    const nameRing = document.getElementById('name-ring');
    const emailRing = document.getElementById('email-ring');
    const passRing = document.getElementById('password-ring');

    // Error message elements
    const nameErr  = document.getElementById('name-error');
    const emailErr = document.getElementById('email-error');
    const passErr  = document.getElementById('password-error');

    // Status badges
    const nameStatus  = document.getElementById('name-status');
    const emailStatus = document.getElementById('email-status');

    // Password extras
    const strengthLabel = document.getElementById('pw-strength-label');
    const strengthSegs  = document.querySelectorAll('.strength-seg');
    const rulesBox      = document.getElementById('pw-rules');
    const toggleBtn     = document.getElementById('togglePw');
    const eyeIcon       = document.getElementById('eyeIcon');

    // Email suggestion
    const suggestEl = document.getElementById('email-suggestion');
    const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'proton.me'];

    // ══════════════════════════════════════════════════════════════════════════
    // ERROR SHOW / CLEAR with ANIMATION
    // ══════════════════════════════════════════════════════════════════════════
    function showError(ring, errorEl, message) {
        ring.classList.remove('success');
        ring.classList.add('error');
        ring.classList.add('shake');
        setTimeout(() => ring.classList.remove('shake'), 350);

        const span = errorEl.querySelector('span');
        if (span) span.textContent = message;
        errorEl.classList.remove('error-msg-exit');
        errorEl.classList.add('error-msg-enter');
        errorEl.style.maxHeight = '40px';
        errorEl.style.opacity = '1';
    }

    function clearError(ring, errorEl) {
        ring.classList.remove('error', 'shake');
        errorEl.classList.remove('error-msg-enter');
        errorEl.classList.add('error-msg-exit');
        errorEl.style.maxHeight = '0';
        errorEl.style.opacity = '0';
    }

    function markSuccess(ring, statusEl, msg) {
        ring.classList.remove('error');
        ring.classList.add('success');
        if (statusEl) {
            statusEl.textContent = '✓ ' + msg;
            statusEl.className = 'text-xs font-medium text-emerald-400';
            statusEl.classList.remove('hidden');
        }
    }

    function clearStatus(statusEl) {
        if (statusEl) {
            statusEl.textContent = '';
            statusEl.classList.add('hidden');
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // NAME — Real-time validation
    // ══════════════════════════════════════════════════════════════════════════
    nameIn.addEventListener('input', () => {
        clearStatus(nameStatus);
        const val = nameIn.value.trim();
        if (val.length === 0) {
            clearError(nameRing, nameErr);
            nameRing.classList.remove('success');
        } else if (val.length < 2) {
            showError(nameRing, nameErr, 'Name must be at least 2 characters');
        } else {
            clearError(nameRing, nameErr);
            markSuccess(nameRing, nameStatus, 'Looks good');
        }
    });

    // ══════════════════════════════════════════════════════════════════════════
    // EMAIL — Real-time validation + smart suggestions
    // ══════════════════════════════════════════════════════════════════════════
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    emailIn.addEventListener('input', () => {
        const val = emailIn.value.trim();
        clearStatus(emailStatus);

        // ── Suggestion logic ──
        if (val.includes('@')) {
            const parts = val.split('@');
            const user = parts[0];
            const domain = parts[1] || '';
            const match = commonDomains.find(d => d.startsWith(domain) && d !== domain);

            if (match && domain.length > 0) {
                suggestEl.innerHTML = `Did you mean <strong class="text-indigo-400">${user}@${match}</strong> ?`;
                suggestEl.classList.remove('hidden');
                suggestEl.onclick = () => {
                    emailIn.value = `${user}@${match}`;
                    suggestEl.classList.add('hidden');
                    emailIn.dispatchEvent(new Event('input'));
                };
            } else {
                suggestEl.classList.add('hidden');
            }
        } else {
            suggestEl.classList.add('hidden');
        }

        // ── Validate ──
        if (val.length === 0) {
            clearError(emailRing, emailErr);
            emailRing.classList.remove('success');
        } else if (!emailRegex.test(val)) {
            // Only show error if user has typed enough to be meaningful
            if (val.length > 5) {
                showError(emailRing, emailErr, 'Enter a valid email address');
            } else {
                clearError(emailRing, emailErr);
            }
        } else {
            clearError(emailRing, emailErr);
            markSuccess(emailRing, emailStatus, 'Valid email');
        }
    });

    emailIn.addEventListener('blur', () => {
        setTimeout(() => suggestEl.classList.add('hidden'), 200);
        const val = emailIn.value.trim();
        if (val.length > 0 && !emailRegex.test(val)) {
            showError(emailRing, emailErr, 'Enter a valid email address');
        }
    });

    // ══════════════════════════════════════════════════════════════════════════
    // PASSWORD — Strength meter + live rules checklist
    // ══════════════════════════════════════════════════════════════════════════
    const rules = {
        length:  v => v.length >= 8,
        upper:   v => /[A-Z]/.test(v),
        number:  v => /\d/.test(v),
        special: v => /[^A-Za-z0-9]/.test(v),
    };

    const strengthColors = ['bg-rose-500', 'bg-amber-400', 'bg-blue-500', 'bg-emerald-400'];
    const strengthNames  = ['Weak', 'Fair', 'Good', 'Strong'];
    const strengthTxtCls = ['text-rose-400', 'text-amber-400', 'text-blue-400', 'text-emerald-400'];

    function updatePasswordUI(val) {
        // Show rules box when user starts typing
        if (val.length > 0) {
            rulesBox.classList.remove('hidden');
        } else {
            rulesBox.classList.add('hidden');
        }

        // Calculate score
        let score = 0;
        Object.entries(rules).forEach(([key, test]) => {
            const pass = test(val);
            if (pass) score++;

            const ruleEl = document.querySelector(`.rule[data-rule="${key}"]`);
            if (ruleEl) {
                const icon = ruleEl.querySelector('.rule-icon');
                const text = ruleEl.querySelector('span');
                if (pass) {
                    icon.innerHTML = '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>';
                    icon.classList.remove('text-slate-600');
                    icon.classList.add('text-emerald-400');
                    text.classList.remove('text-slate-500');
                    text.classList.add('text-emerald-400');
                } else {
                    icon.innerHTML = '<circle cx="10" cy="10" r="4"/>';
                    icon.classList.remove('text-emerald-400');
                    icon.classList.add('text-slate-600');
                    text.classList.remove('text-emerald-400');
                    text.classList.add('text-slate-500');
                }
            }
        });

        // Strength bar
        strengthSegs.forEach((seg, i) => {
            seg.className = 'strength-seg h-1 flex-1 rounded-full origin-bottom transition-all duration-300';
            if (val.length === 0) {
                seg.classList.add('bg-slate-800');
            } else if (i < score) {
                seg.classList.add(strengthColors[score - 1], 'active');
            } else {
                seg.classList.add('bg-slate-800');
            }
        });

        // Strength label
        if (val.length === 0) {
            strengthLabel.classList.add('hidden');
        } else {
            strengthLabel.classList.remove('hidden');
            strengthLabel.textContent = strengthNames[score - 1] || 'Too short';
            strengthLabel.className = `text-xs font-semibold ${strengthTxtCls[score - 1] || 'text-slate-500'}`;
        }

        // Ring state
        if (val.length === 0) {
            clearError(passRing, passErr);
            passRing.classList.remove('success');
        } else if (score < 3) {
            // Not necessarily error — just not success yet
            passRing.classList.remove('success', 'error');
        } else {
            clearError(passRing, passErr);
            passRing.classList.remove('error');
            passRing.classList.add('success');
        }
    }

    passIn.addEventListener('input', () => {
        updatePasswordUI(passIn.value);
    });

    passIn.addEventListener('focus', () => {
        if (passIn.value.length > 0) rulesBox.classList.remove('hidden');
    });

    // ── Password visibility toggle ──
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const show = passIn.type === 'password';
            passIn.type = show ? 'text' : 'password';
            eyeIcon.innerHTML = show
                ? '<path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.125-3.516M6.343 6.343A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.957 9.957 0 01-1.563 2.982M6.343 6.343L3 3m3.343 3.343l11.314 11.314M3 3l18 18"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-4.243-4.243"/>'
                : '<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>';
        });
    }

    // ══════════════════════════════════════════════════════════════════════════
    // FORM SUBMIT — Final gate check
    // ══════════════════════════════════════════════════════════════════════════
    form.addEventListener('submit', (e) => {
        let valid = true;

        // Hide server banner if present
        const banner = document.getElementById('serverBanner');
        if (banner) banner.style.display = 'none';

        // Name
        if (nameIn.value.trim().length < 2) {
            showError(nameRing, nameErr, 'Name is required');
            valid = false;
        }

        // Email
        if (!emailRegex.test(emailIn.value.trim())) {
            showError(emailRing, emailErr, 'A valid email is required');
            valid = false;
        }

        // Password
        const pw = passIn.value;
        if (pw.length < 8) {
            showError(passRing, passErr, 'Password must be 8+ characters');
            valid = false;
        } else if (!/[A-Z]/.test(pw)) {
            showError(passRing, passErr, 'Include at least one uppercase letter');
            valid = false;
        } else if (!/\d/.test(pw)) {
            showError(passRing, passErr, 'Include at least one number');
            valid = false;
        }

        if (!valid) e.preventDefault();
    });
});
