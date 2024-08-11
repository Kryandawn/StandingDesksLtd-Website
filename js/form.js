// Form validation and submission handling
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
});

function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (validateForm(form)) {
        submitForm(form);
    }
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    return isValid;
}

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;

    if (input.required && value === '') {
        showError(input, 'This field is required');
        return false;
    }

    if (type === 'email' && !isValidEmail(value)) {
        showError(input, 'Please enter a valid email address');
        return false;
    }

    if (name === 'phone' && !isValidPhone(value)) {
        showError(input, 'Please enter a valid phone number');
        return false;
    }

    clearError(input);
    return true;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^\+?[\d\s-]{10,}$/;
    return re.test(phone);
}

function showError(input, message) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        const newErrorElement = document.createElement('span');
        newErrorElement.classList.add('error-message');
        newErrorElement.textContent = message;
        input.parentNode.insertBefore(newErrorElement, input.nextSibling);
    }
    input.classList.add('error');
}

function clearError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    input.classList.remove('error');
}

function submitForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Here you would typically send the data to a server
    // For this example, we'll just log it to the console
    console.log('Form submitted:', data);

    // Show a success message
    const successMessage = document.createElement('div');
    successMessage.textContent = 'Form submitted successfully!';
    successMessage.classList.add('success-message');
    form.appendChild(successMessage);

    // Clear the form
    form.reset();

    // Remove the success message after 3 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Export functions for use in other modules
export { validateForm, submitForm };
