document.addEventListener('DOMContentLoaded', function() {
    // Product list array to store product details
    let productList = [];

    // Validation functions
    function validateName(name) {
        return name.trim() !== '';
    }

    function validateDescription(description) {
        return description.trim() !== '';
    }

    function validatePrice(price) {
        const parsedPrice = parseFloat(price);
        return !isNaN(parsedPrice) && parsedPrice > 0;
    }

    function validateImageUrl(url) {
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return urlPattern.test(url);
    }

    function validateProductForm(name, description, price, imageUrl) {
        let isValid = true;

        if (!validateName(name.value)) {
            displayError(name, 'Product name is required');
            isValid = false;
        } else {
            clearError(name);
        }

        if (!validateDescription(description.value)) {
            displayError(description, 'Product description is required');
            isValid = false;
        } else {
            clearError(description);
        }

        if (!validatePrice(price.value)) {
            displayError(price, 'Price must be a positive number');
            isValid = false;
        } else {
            clearError(price);
        }

        if (!validateImageUrl(imageUrl.value)) {
            displayError(imageUrl, 'Please enter a valid URL');
            isValid = false;
        } else {
            clearError(imageUrl);
        }

        // Ensure all fields have been checked and errors are displayed
        if (!isValid) {
            displayErrorMessage('Please correct the errors in the form.');
        }

        return isValid;
    }

    function displayError(input, message) {
        console.log('Error displayed:', message);
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        } else {
            const newErrorElement = document.createElement('span');
            newErrorElement.classList.add('error-message');
            newErrorElement.textContent = message;
            newErrorElement.style.display = 'block';
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

    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.textContent = '');
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => input.classList.remove('error'));
    }

    function displaySuccessMessage(message) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = message;
        messageContainer.className = 'success';
        messageContainer.style.display = 'block';
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    }

    function displayErrorMessage(message) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = message;
        messageContainer.className = 'error';
        messageContainer.style.display = 'block';
    }

    const productForm = document.getElementById('add-product-form');
    const newArrivalsForm = document.getElementById('new-arrivals-form');
    const productListContainer = document.getElementById('product-list-container');
    const emptyStateMessage = document.getElementById('empty-product-list');
    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('open-modal');
    const closeModalBtn = document.getElementsByClassName('close-modal')[0];

    if (openModalBtn) {
        openModalBtn.addEventListener('click', function() {
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
            openModalBtn.style.display = 'none';
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            closeModal();
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        openModalBtn.style.display = 'block';
        document.getElementById('modal-add-product-form').reset();
        clearErrorMessages();
    }

    // Function to fetch product list from server
    function fetchProductList() {
        fetch('/api/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                productList = data.products;
                renderProductList();
            })
            .catch(error => {
                console.error('Error fetching product list:', error);
                displayErrorMessage('Failed to load products. Please try again.');
            });
    }

    // Function to update product list on server
    function updateProductList(action, product, index) {
        let url = '/api/products';
        let method = 'POST';
        let body = { product };

        if (action === 'edit') {
            url += `/${product.id}`;
            method = 'PUT';
        } else if (action === 'delete') {
            url += `/${product.id}`;
            method = 'DELETE';
            body = {};
        }

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                if (action === 'add') {
                    productList.push(data.product);
                } else if (action === 'edit') {
                    productList[index] = data.product;
                } else if (action === 'delete') {
                    productList.splice(index, 1);
                }
                renderProductList();
                displaySuccessMessage(`Product ${action === 'add' ? 'added' : action + 'ed'} successfully!`);
            } else {
                throw new Error(data.message || `Failed to ${action} product`);
            }
        })
        .catch(error => {
            console.error(`Error ${action}ing product:`, error);
            displayErrorMessage(`Failed to ${action} product. ${error.message}`);
        });
    }

    // Function to render the product list
    function renderProductList() {
        productListContainer.innerHTML = '';
        if (productList.length === 0) {
            emptyStateMessage.style.display = 'block';
            productListContainer.style.display = 'none';
        } else {
            emptyStateMessage.style.display = 'none';
            productListContainer.style.display = 'block';
            productList.forEach((product, index) => {
                const productElement = document.createElement('div');
                productElement.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100px;">
                    <button onclick="deleteProduct(${index})">Delete</button>
                `;
                productListContainer.appendChild(productElement);
            });
        }
    }

    // Function to delete a product
    window.deleteProduct = function(index) {
        const productId = productList[index].id;
        productList.splice(index, 1);
        updateProductList('delete', productId)
            .then(() => {
                renderProductList();
                displaySuccessMessage('Product deleted successfully!');
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                displayErrorMessage('Failed to delete product. Please try again.');
            });
    }

    productForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('product-name');
        const description = document.getElementById('product-description');
        const price = document.getElementById('product-price');
        const imageUrl = document.getElementById('product-image');

        clearErrorMessages();

        if (validateProductForm(name, description, price, imageUrl)) {
            const newProduct = {
                name: name.value,
                description: description.value,
                price: parseFloat(price.value),
                imageUrl: imageUrl.value
            };
            updateProductList('add', newProduct)
                .then(() => {
                    renderProductList();
                    productForm.reset();
                    displaySuccessMessage('Product added successfully!');
                })
                .catch(error => {
                    console.error('Error adding product:', error);
                    displayErrorMessage('Failed to add product. Please try again.');
                });
        } else {
            displayErrorMessage('Please correct the errors in the form.');
        }
    });

    newArrivalsForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('arrival-name');
        const description = document.getElementById('arrival-description');
        const price = document.getElementById('arrival-price');
        const imageUrl = document.getElementById('arrival-image');

        clearErrorMessages();

        if (validateProductForm(name, description, price, imageUrl)) {
            const newArrival = {
                name: name.value,
                description: description.value,
                price: parseFloat(price.value),
                imageUrl: imageUrl.value
            };
            updateProductList('add', newArrival);
            newArrivalsForm.reset();
        } else {
            displayErrorMessage('Please correct the errors in the form.');
        }
    });

    // Modal functionality
    if (openModalBtn) {
        openModalBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.classList.add('modal-open');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            closeModal();
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Modal form submission
    const modalForm = document.getElementById('modal-add-product-form');
    modalForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('modal-product-name');
        const description = document.getElementById('modal-product-description');
        const price = document.getElementById('modal-product-price');
        const imageUrl = document.getElementById('modal-product-image');

        if (validateProductForm(name, description, price, imageUrl)) {
            const newProduct = {
                name: name.value,
                description: description.value,
                price: parseFloat(price.value),
                imageUrl: imageUrl.value
            };
            updateProductList('add', newProduct);
            closeModal();
        } else {
            displayErrorMessage('Please correct the errors in the form.');
        }
    });

    // Initial fetch of product list from server
    fetchProductList();
});
