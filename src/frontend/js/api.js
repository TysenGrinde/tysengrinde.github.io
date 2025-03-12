function submitForm(formData) {
    fetch('/api/contact', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        const contactForm = document.getElementById('contactForm');
        contactForm.innerHTML = `
            <div class="success-message">
                <h2>Thank You!</h2>
                <p>Your message has been successfully submitted.</p>
                <p>We'll get back to you soon.</p>
            </div>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
        // Show error message
        const contactForm = document.getElementById('contactForm');
        contactForm.innerHTML += `
            <div class="error-message">
                <p>Sorry, there was a problem submitting your form. Please try again later.</p>
            </div>
        `;
    });
}

// Function to fetch ambassador data dynamically
function fetchAmbassadorData() {
    fetch('/api/ambassadors')
    .then(response => response.json())
    .then(data => {
        const ambassadorSection = document.querySelector('.ambassador-brands');
        if (ambassadorSection) {
            // Update ambassador section with dynamic data
            const brandsList = ambassadorSection.querySelector('ul');
            brandsList.innerHTML = data.brands.map(brand => `
                <li>
                    <h3>${brand.name}</h3>
                    <p>${brand.description}</p>
                    <a href="${brand.website}" target="_blank">Visit Brand</a>
                </li>
            `).join('');
        }
    })
    .catch(error => {
        console.error('Error fetching ambassador data:', error);
    });
}

// Call this function when the ambassador page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.ambassador-brands')) {
        fetchAmbassadorData();
    }
});