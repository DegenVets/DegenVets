document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const firstNameInput = document.getElementById('firstname');
    const lastNameInput = document.getElementById('lastname');
    const emailInput = document.getElementById('email');
    const countryCodeInput = document.getElementById('countryCode');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    // Error message elements
    const firstNameError = document.getElementById('firstnameError');
    const lastNameError = document.getElementById('lastnameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const messageError = document.getElementById('messageError');

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });

    // Input validation logic
    const validateName = (name) => /^[A-Za-z]{3,}$/.test(name);
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (countryCode, phoneNumber) => {
        const phonePatterns = {
            '+1': /^\d{10}$/,
            '+44': /^\d{10}$/,
            '+91': /^\d{10}$/
        };
        return phonePatterns[countryCode]?.test(phoneNumber) || false;
    };

    const validateField = (input, validator, errorElement, errorMessage) => {
        const value = input.value.trim();
        const isValid = validator(value);

        if (!isValid) {
            errorElement.textContent = errorMessage;
            input.classList.add('invalid');
        } else {
            errorElement.textContent = '';
            input.classList.remove('invalid');
        }

        return isValid;
    };

    const validateForm = () => {
        const isFirstNameValid = validateField(
            firstNameInput,
            validateName,
            firstNameError,
            'First name must be at least 3 letters long'
        );

        const isLastNameValid = validateField(
            lastNameInput,
            validateName,
            lastNameError,
            'Last name must be at least 3 letters long'
        );

        const isEmailValid = validateField(
            emailInput,
            validateEmail,
            emailError,
            'Please enter a valid email address'
        );

        const isPhoneValid = validateField(
            { value: phoneInput.value.trim() },
            () => validatePhone(countryCodeInput.value, phoneInput.value.trim()),
            phoneError,
            'Please enter a valid phone number'
        );

        const isMessageValid = messageInput.value.trim().length > 0;
        messageError.textContent = isMessageValid ? '' : 'Message cannot be empty';

        submitBtn.disabled = !(isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid && isMessageValid);
    };

    // Glitch effect for text
    const glitchEffect = (element) => {
        setInterval(() => {
            const randomX = Math.random() * 4 - 2;
            const randomY = Math.random() * 4 - 2;
            element.style.textShadow = `
                ${randomX}px ${randomY}px #ff00ff,
                ${-randomX}px ${-randomY}px #00ffff`;
        }, 100);
    };

    document.querySelectorAll('h1, h2').forEach(glitchEffect);

    // Add real-time validation listeners
    [firstNameInput, lastNameInput, emailInput, phoneInput, messageInput, countryCodeInput].forEach(input => {
        input.addEventListener('input', validateForm);
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const emailContent = `
From: ${formData.get('firstname')} ${formData.get('lastname')}
Email: ${formData.get('email')}
Phone: ${formData.get('countryCode')} ${formData.get('phone')}

Message:
${formData.get('message')}
        `;

        try {
            const response = await fetch('https://formspree.io/f/your_formspree_endpoint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: 'example@yourdomain.com',
                    subject: 'New Contact Form Submission',
                    text: emailContent,
                }),
            });

            if (response.ok) {
                alert('Message sent successfully!');
                form.reset();
                submitBtn.disabled = true;
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was a problem sending your message. Please try again.');
        }
    });

    // Initial form validation
    validateForm();
});
