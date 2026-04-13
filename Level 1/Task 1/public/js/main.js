document.addEventListener('DOMContentLoaded', () => {
    // ─── State ───────────────────────────────────────────────────────────────
    const TOTAL_STEPS = 3;
    let currentStep = 0; // 0-indexed

    // ─── DOM refs ────────────────────────────────────────────────────────────
    const steps      = Array.from(document.querySelectorAll('.form-step'));
    const prevBtn    = document.getElementById('prevBtn');
    const nextBtn    = document.getElementById('nextBtn');
    const submitBtn  = document.getElementById('submitBtn');
    const form       = document.getElementById('onboardingForm');

    const stepLabels = ['Personal Info', 'Account Security', 'Review & Confirm'];
    const stepNumEl  = document.getElementById('currentStepNum');
    const stepLblEl  = document.getElementById('stepLabel');
    const dots       = [0, 1, 2].map(i => document.getElementById(`dot-${i}`));
    const connectors = [0, 1].map(i => document.getElementById(`connector-${i}`));
    const reviewEl   = document.getElementById('reviewDetails');

    // ─── Password toggle ─────────────────────────────────────────────────────
    const toggleBtn  = document.getElementById('togglePassword');
    const passwordEl = document.getElementById('password');
    const eyeIcon    = document.getElementById('eyeIcon');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const show = passwordEl.type === 'password';
            passwordEl.type = show ? 'text' : 'password';
            eyeIcon.innerHTML = show
                ? `<path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.125-3.516M6.343 6.343A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.957 9.957 0 01-1.563 2.982M6.343 6.343L3 3m3.343 3.343l11.314 11.314M3 3l18 18"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-4.243-4.243"/>`
                : `<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                   <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>`;
        });
    }

    // ─── Password strength meter ──────────────────────────────────────────────
    const strengthBars  = document.querySelectorAll('.strength-bar');
    const strengthLabel = document.getElementById('strengthLabel');
    const strengthColors = ['bg-rose-500', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];
    const strengthNames  = ['', 'Weak', 'Fair', 'Good', 'Strong'];

    function getStrength(val) {
        let score = 0;
        if (val.length >= 6)  score++;
        if (val.length >= 10) score++;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
        if (/\d/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;
        return score;
    }

    if (passwordEl) {
        passwordEl.addEventListener('input', () => {
            const score = getStrength(passwordEl.value);
            strengthBars.forEach((bar, i) => {
                bar.className = `h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? strengthColors[score - 1] : 'bg-slate-700'}`;
            });
            if (strengthLabel) strengthLabel.textContent = passwordEl.value ? strengthNames[score] : '';
        });
    }

    // ─── Step update UI ──────────────────────────────────────────────────────
    function updateUI(direction) {
        // Steps
        steps.forEach((step, idx) => {
            step.classList.remove('active', 'step-enter-forward', 'step-enter-backward');
            if (idx === currentStep) {
                step.classList.add('active');
                // Trigger directional animation
                void step.offsetWidth; // Force reflow
                if (direction === 'forward')  step.classList.add('step-enter-forward');
                if (direction === 'backward') step.classList.add('step-enter-backward');
            }
        });

        // Previous button visibility
        prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';

        // Next vs Submit button
        if (currentStep === TOTAL_STEPS - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }

        // Step indicator text
        if (stepNumEl) stepNumEl.textContent = currentStep + 1;
        if (stepLblEl) stepLblEl.textContent = stepLabels[currentStep];

        // Dots
        dots.forEach((dot, i) => {
            dot.className = 'step-dot w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0';
            if (i < currentStep) {
                // Completed
                dot.className += ' bg-indigo-600 text-white';
                dot.innerHTML = `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;
            } else if (i === currentStep) {
                // Active
                dot.className += ' bg-indigo-600 text-white ring-4 ring-indigo-500/20';
                dot.textContent = i + 1;
            } else {
                // Future
                dot.className += ' bg-slate-800 text-slate-500 border border-slate-700';
                dot.textContent = i + 1;
            }
        });

        // Connectors
        connectors.forEach((connector, i) => {
            connector.style.width = currentStep > i ? '100%' : '0%';
        });

        // Populate review panel
        if (currentStep === TOTAL_STEPS - 1) populateReview();
    }

    // ─── Review panel population ─────────────────────────────────────────────
    function populateReview() {
        if (!reviewEl) return;
        const data = new FormData(form);
        const fields = [
            { key: 'firstName', label: 'First name' },
            { key: 'lastName',  label: 'Last name' },
            { key: 'role',      label: 'Role' },
            { key: 'email',     label: 'Email' },
        ];
        reviewEl.innerHTML = fields.map(({ key, label }) => `
            <div class="flex items-center justify-between py-3.5 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span class="text-slate-500 text-sm">${label}</span>
                <span class="text-white text-sm font-semibold">${data.get(key) || '—'}</span>
            </div>
        `).join('');
    }

    // ─── Validation ──────────────────────────────────────────────────────────
    function validateStep() {
        const stepEl = steps[currentStep];
        const inputs = Array.from(stepEl.querySelectorAll('input[required], select[required]'));
        let valid = true;

        inputs.forEach(input => {
            const errSpan = input.parentElement.querySelector('.error-msg')
                         || input.closest('div')?.querySelector('.error-msg');
            clearError(input, errSpan);

            if (!input.checkValidity()) {
                valid = false;
                let msg = '';
                if (input.validity.valueMissing)  msg = `${input.labels?.[0]?.textContent?.replace(/\*/g,'').trim() || 'This field'} is required.`;
                else if (input.validity.typeMismatch) msg = 'Please enter a valid email address.';
                else if (input.validity.tooShort)     msg = `Minimum ${input.minLength} characters required.`;
                else msg = input.validationMessage;
                showError(input, errSpan, msg);
            }
        });

        return valid;
    }

    function showError(input, errSpan, msg) {
        input.classList.remove('border-white/10');
        input.classList.add('error', 'border-rose-500/60', 'bg-rose-500/5');
        if (errSpan) {
            errSpan.textContent = msg;
            errSpan.classList.remove('hidden');
        }
    }

    function clearError(input, errSpan) {
        input.classList.remove('error', 'border-rose-500/60', 'bg-rose-500/5');
        input.classList.add('border-white/10');
        if (errSpan) { errSpan.textContent = ''; errSpan.classList.add('hidden'); }
    }

    // Clear errors live while user types
    form.addEventListener('input', e => {
        const input   = e.target;
        const errSpan = input.parentElement.querySelector('.error-msg')
                     || input.closest('div')?.querySelector('.error-msg');
        if (errSpan) clearError(input, errSpan);
    });

    // ─── Navigation ──────────────────────────────────────────────────────────
    nextBtn.addEventListener('click', () => {
        if (!validateStep()) return;
        if (currentStep < TOTAL_STEPS - 1) {
            currentStep++;
            updateUI('forward');
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateUI('backward');
        }
    });

    // ─── Init ────────────────────────────────────────────────────────────────
    updateUI(null);
});
