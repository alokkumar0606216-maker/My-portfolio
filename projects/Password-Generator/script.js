document.addEventListener('DOMContentLoaded', () => {
    const passwordDisplay = document.getElementById('password-display');
    const copyBtn = document.getElementById('copy-btn');
    const copyTooltip = document.getElementById('copy-tooltip');
    const lengthSlider = document.getElementById('length-slider');
    const lengthVal = document.getElementById('length-val');
    const includeUpper = document.getElementById('include-upper');
    const includeLower = document.getElementById('include-lower');
    const includeNumbers = document.getElementById('include-numbers');
    const includeSymbols = document.getElementById('include-symbols');
    const generateBtn = document.getElementById('generate-btn');
    const strengthText = document.getElementById('strength-text');
    const themeBtn = document.getElementById('theme-btn');
    const bars = [
        document.getElementById('bar-1'),
        document.getElementById('bar-2'),
        document.getElementById('bar-3'),
        document.getElementById('bar-4')
    ];

    const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBERS = '0123456789';
    const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Theme toggle
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeBtn.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Slider listener
    lengthSlider.addEventListener('input', (e) => {
        lengthVal.textContent = e.target.value;
        generatePassword();
    });

    [includeUpper, includeLower, includeNumbers, includeSymbols].forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Ensure at least one is checked
            if (!includeUpper.checked && !includeLower.checked && !includeNumbers.checked && !includeSymbols.checked) {
                checkbox.checked = true;
            }
            generatePassword();
        });
    });

    generateBtn.addEventListener('click', () => {
        const icon = generateBtn.querySelector('i');
        icon.style.transform = 'rotate(360deg)';
        icon.style.transition = '0.4s';
        setTimeout(() => icon.style.transform = 'rotate(0deg)', 400);
        generatePassword();
    });

    // Copy Password
    copyBtn.addEventListener('click', () => {
        const pass = passwordDisplay.value;
        if (!pass) return;

        navigator.clipboard.writeText(pass).then(() => {
            copyTooltip.classList.add('show');
            setTimeout(() => copyTooltip.classList.remove('show'), 1500);
        });
    });

    function generatePassword() {
        let charPool = '';
        if (includeUpper.checked) charPool += UPPERCASE;
        if (includeLower.checked) charPool += LOWERCASE;
        if (includeNumbers.checked) charPool += NUMBERS;
        if (includeSymbols.checked) charPool += SYMBOLS;

        const length = parseInt(lengthSlider.value, 10);
        let password = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charPool.length);
            password += charPool[randomIndex];
        }

        passwordDisplay.value = password;
        updateStrength(password, length);
    }

    function updateStrength(pass, length) {
        let score = 0;
        if (length >= 8) score++;
        if (length >= 14) score++;
        if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
        if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score++;

        bars.forEach(b => b.style.backgroundColor = '');

        if (score <= 1) {
            strengthText.textContent = 'Too Weak';
            strengthText.style.color = '#ef4444';
            bars[0].style.backgroundColor = '#ef4444';
        } else if (score === 2) {
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#f97316';
            bars[0].style.backgroundColor = '#f97316';
            bars[1].style.backgroundColor = '#f97316';
        } else if (score === 3) {
            strengthText.textContent = 'Medium';
            strengthText.style.color = '#eab308';
            bars[0].style.backgroundColor = '#eab308';
            bars[1].style.backgroundColor = '#eab308';
            bars[2].style.backgroundColor = '#eab308';
        } else {
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#10b981';
            bars.forEach(b => b.style.backgroundColor = '#10b981');
        }
    }

    // Initial password generation
    generatePassword();
});