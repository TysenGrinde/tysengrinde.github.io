document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        document.getElementById('contactForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            // Basic form validation
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                interests: Array.from(document.getElementById('interests').selectedOptions).map(option => option.value)
            };

            // Reset previous error states
            [email, message].forEach(field => {
                field.classList.remove('error');
            });

            let isValid = true;

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                email.classList.add('error');
                isValid = false;
            }

            // Message validation
            if (message.value.trim() === '') {
                message.classList.add('error');
                isValid = false;
            }

            // If all validations pass, proceed with form submission
            if (isValid) {
                // Call API submission function
                submitForm(new FormData(contactForm));
            }

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        
            const result = await response.json();
            console.log(result);
        });
    }

    // Add error styling to CSS for validation
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border: 2px solid red;
            animation: shake 0.5s;
        }
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            50% { transform: translateX(10px); }
            75% { transform: translateX(-10px); }
            100% { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
});