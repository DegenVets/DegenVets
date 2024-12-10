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

    // Navigation links smooth scrolling
    const navLinks = document.querySelectorAll('.menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Validation functions
    const validateName = (name) => {
        // Must be more than 3 characters, letters only
        const nameRegex = /^[A-Za-z]{4,}$/;
        return nameRegex.test(name);
    };

    const validateEmail = (email) => {
        // Standard email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (countryCode, phoneNumber) => {
        // Different regex patterns for different country codes
        const phonePatterns = {
            '+1': /^\d{10}$/, // US/Canada 10 digit
            '+44': /^\d{10}$/, // UK 10 digit
            '+91': /^\d{10}$/ // India 10 digit
        };

        return countryCode && phonePatterns[countryCode] 
            ? phonePatterns[countryCode].test(phoneNumber)
            : false;
    };

    // Validate and update error messages
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

    // Validate form inputs on each change
    const validateForm = () => {
        const isFirstNameValid = validateField(
            firstNameInput, 
            validateName, 
            firstNameError, 
            'First name must be at least 4 letters long'
        );
        
        const isLastNameValid = validateField(
            lastNameInput, 
            validateName, 
            lastNameError, 
            'Last name must be at least 4 letters long'
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
            'Please enter a valid phone number for the selected country code'
        );
        
        const isMessageValid = messageInput.value.trim().length > 0;
        messageError.textContent = isMessageValid ? '' : 'Message cannot be empty';

        // Enable submit button only if all fields are valid
        const isFormValid = isFirstNameValid && 
            isLastNameValid && 
            isEmailValid && 
            isPhoneValid && 
            isMessageValid;
        
        submitBtn.disabled = !isFormValid;
    };

    // Add event listeners for real-time validation
    [firstNameInput, lastNameInput, emailInput, phoneInput, messageInput, countryCodeInput]
        .forEach(input => input.addEventListener('input', validateForm));

    // Form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Prepare form data
        const formData = new FormData(form);
        
        // Compose email content
        const emailContent = `
From: ${formData.get('firstname')} ${formData.get('lastname')}
Email: ${formData.get('email')}
Phone: ${formData.get('countryCode')} ${formData.get('phone')}

Message:
${formData.get('message')}
        `;

        try {
            // Send email using Fetch API or your preferred method
            const response = await fetch('https://formspree.io/f/your_formspree_endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: 'git@fuck-out.com',
                    subject: 'New Contact Form Submission',
                    text: emailContent
                })
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

    // Initial validation to disable submit button
    validateForm();
});