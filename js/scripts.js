console.log('Script execution started');
let fetchedProducts = [];
let products = [];

document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  console.log('Initializing basket functionality');

  const userInfoForm = document.getElementById('user-info-form');
  const modal = document.getElementById('modal');
  const closeModalBtn = document.getElementById('close-modal');
  const checkoutButton = document.getElementById('checkout-btn');

  // Check for required elements
  const requiredElements = [
    { element: userInfoForm, name: 'User info form' },
    { element: modal, name: 'Modal' },
    { element: closeModalBtn, name: 'Close modal button' },
    { element: checkoutButton, name: 'Checkout button' }
  ];

  requiredElements.forEach(({ element, name }) => {
    if (!element) {
      console.error(`${name} not found`);
    }
  });

  // Ensure userInfoForm is defined before use
  if (!userInfoForm) {
    console.error('User info form not found. Creating a placeholder.');
    const userInfoFormPlaceholder = document.createElement('form');
    userInfoFormPlaceholder.id = 'user-info-form';
    document.body.appendChild(userInfoFormPlaceholder);
  }

  // Modal popup functionality
  function showModal() {
    if (modal) {
      modal.style.display = 'block';
    } else {
      console.error('Modal element not found');
    }
  }

  function hideModal() {
    if (modal) {
      modal.style.display = 'none';
    }
  }

  if (checkoutButton) {
    checkoutButton.addEventListener('click', showModal);
    console.log('Checkout button event listener added');
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideModal);
    console.log('Close modal button event listener added');
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideModal);
    console.log('Close modal button event listener added');
  } else {
    console.error('Close modal button not found');
  }

  // Ensure modal is hidden when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      hideModal();
    }
  });

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      hideModal();
    }
  });



  // Basket functionality
  let basketItems = document.getElementById('basket-items');
  let basketTotal = document.getElementById('basket-total');
  let basketIcon = document.getElementById('basket-icon');
  let floatingBasket = document.getElementById('floating-basket');
  let basketCount = document.getElementById('basket-count');
  let userInfoSection = document.getElementById('user-info-section');
  let basket = [];

  console.log('Basket elements:', {
    basketItems: !!basketItems,
    basketTotal: !!basketTotal,
    basketIcon: !!basketIcon,
    floatingBasket: !!floatingBasket,
    basketCount: !!basketCount,
    userInfoSection: !!userInfoSection,
    userInfoForm: !!userInfoForm
  });

  function addItemToBasket(productId, price) {
    console.log(`Adding item to basket: Product ID ${productId}, Price $${price}`);
    let existingItem = basket.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
      console.log(`Increased quantity for existing item: ${existingItem.quantity}`);
    } else {
      basket.push({ id: productId, price: price, quantity: 1 });
      console.log('Added new item to basket');
    }
    updateBasketDisplay();
    updateBasketTotal();
    showFloatingBasket();
    console.log('Current basket:', basket);
  }

  function removeItemFromBasket(productId) {
    console.log(`Removing item with ID ${productId} from basket`);
    const originalLength = basket.length;
    basket = basket.filter(item => item.id !== productId);
    console.log(`Basket length changed from ${originalLength} to ${basket.length}`);
    updateBasketDisplay();
    updateBasketTotal();
    if (basket.length === 0) {
      console.log('Basket is now empty, hiding floating basket');
      hideFloatingBasket();
    }
  }

  function updateItemQuantity(productId, newQuantity) {
    const item = basket.find(item => item.id === productId);
    if (item) {
      if (newQuantity > 0) {
        item.quantity = newQuantity;
      } else {
        removeItemFromBasket(productId);
      }
      updateBasketDisplay();
      updateBasketTotal();
    }
  }

  function updateBasketTotal() {
    console.log('Updating basket total');
    const total = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log('Calculated total:', total);
    if (basketTotal) {
      basketTotal.textContent = `$${total.toFixed(2)}`;
      console.log('Updated basketTotal element:', basketTotal.textContent);
    } else {
      console.warn('basketTotal element not found');
    }
    if (basketIcon) {
      const itemCount = basket.reduce((sum, item) => sum + item.quantity, 0);
      console.log('Total item count:', itemCount);
      basketIcon.setAttribute('data-count', itemCount);
      basketCount.textContent = itemCount;
      basketIcon.classList.toggle('has-items', itemCount > 0);
      console.log('Updated basketIcon:', { dataCount: itemCount, hasItems: itemCount > 0 });
    } else {
      console.warn('basketIcon element not found');
    }
  }

  function updateBasketDisplay() {
    if (basketItems) {
      basketItems.innerHTML = '';
      if (basket.length === 0) {
        basketItems.innerHTML = '<p>Your basket is empty</p>';
      } else {
        basket.forEach(item => {
          const itemElement = document.createElement('div');
          itemElement.classList.add('basket-item');
          const product = products.find(p => p.id === item.id) || {};
          itemElement.innerHTML = `
            <img src="images/${product.imageUrl || 'placeholder.jpg'}" alt="${product.name || 'Product'}" class="basket-item-image">
            <div class="basket-item-details">
              <h4>${product.name || 'Unknown Product'}</h4>
              <div class="quantity-controls">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
              </div>
              <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
          `;
          basketItems.appendChild(itemElement);
        });
      }
    }
    updateBasketTotal();
  }

  function showFloatingBasket() {
    const floatingBasket = document.getElementById('floating-basket');
    if (floatingBasket) {
      floatingBasket.classList.remove('hidden');
      floatingBasket.classList.add('show');
    } else {
      console.warn('Floating basket element not found');
    }
  }

  function hideFloatingBasket() {
    const floatingBasket = document.getElementById('floating-basket');
    if (floatingBasket) {
      floatingBasket.classList.remove('show');
      floatingBasket.classList.add('hidden');
    } else {
      console.warn('Floating basket element not found');
    }
  }

  // Event delegation for basket item controls
  if (basketItems) {
    console.log('Basket items element found, adding event listener');
    basketItems.addEventListener('click', (event) => {
      const target = event.target;
      if (target.classList.contains('quantity-btn')) {
        const productId = parseInt(target.getAttribute('data-id'));
        const item = basket.find(item => item.id === productId);
        if (item) {
          if (target.classList.contains('plus')) {
            console.log(`Increasing quantity for product ${productId}`);
            updateItemQuantity(productId, item.quantity + 1);
          } else if (target.classList.contains('minus')) {
            console.log(`Decreasing quantity for product ${productId}`);
            updateItemQuantity(productId, item.quantity - 1);
          }
        }
      } else if (target.classList.contains('remove-item') || target.closest('.remove-item')) {
        const productId = parseInt(target.getAttribute('data-id') || target.closest('.remove-item').getAttribute('data-id'));
        console.log(`Removing product ${productId} from basket`);
        removeItemFromBasket(productId);
      }
    });
  } else {
    console.error('Basket items element not found');
  }

  // Checkout button event listener
  if (checkoutButton) {
    console.log('Checkout button found, adding event listener');
    checkoutButton.addEventListener('click', () => {
      console.log('Checkout button clicked');
      if (floatingBasket) {
        console.log('Hiding floating basket');
        floatingBasket.classList.add('hidden');
      } else {
        console.warn('Floating basket element not found');
      }
      if (modal) {
        console.log('Displaying modal');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
      } else {
        console.error('Modal element not found');
      }
    });
  } else {
    console.error('Checkout button not found');
  }

  // User info form submission
  if (userInfoForm) {
    console.log('User info form found');
    userInfoForm.addEventListener('submit', (event) => {
      console.log('Form submission event triggered');
      event.preventDefault();
      if (validateUserInfoForm()) {
        console.log('Form validation passed');
        const formData = new FormData(userInfoForm);
        const userInfo = Object.fromEntries(formData.entries());
        console.log('User Info:', userInfo);
        console.log('Basket:', basket);

        // TODO: Send order data to server
        // Simulating server request
        console.log('Simulating server request...');
        simulateOrderPlacement(userInfo)
          .then(() => {
            console.log('Order placement simulation complete');
            alert('Order placed successfully!');
            resetOrderProcess();
          })
          .catch((error) => {
            console.error('Order placement failed:', error);
            alert('Failed to place order. Please try again.');
          });
      } else {
        console.log('Form validation failed');
      }
    });
  } else {
    console.error('User info form not found');
  }

  function simulateOrderPlacement(userInfo) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Order placed successfully:', userInfo);
        resolve();
      }, 1000);
    });
  }

  function resetOrderProcess() {
    basket = [];
    updateBasketDisplay();
    userInfoForm.reset();
    if (modal) {
      console.log('Closing modal');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    } else {
      console.warn('Modal element not found');
    }
    // Clear error messages
    const errorMessages = userInfoForm.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.textContent = '');
    console.log('Form reset and errors cleared');
  }

  function validateUserInfoForm() {
    const name = document.getElementById('name');
    const address = document.getElementById('address');
    const phone = document.getElementById('phone');
    let isValid = true;

    // Validate name
    if (!name || !name.value.trim()) {
      isValid = false;
      showError(name, 'Name is required');
    } else if (name.value.trim().length < 2) {
      isValid = false;
      showError(name, 'Name must be at least 2 characters long');
    } else {
      clearError(name);
    }

    // Validate address
    if (!address || !address.value.trim()) {
      isValid = false;
      showError(address, 'Address is required');
    } else if (address.value.trim().length < 10) {
      isValid = false;
      showError(address, 'Please enter a complete address');
    } else {
      clearError(address);
    }

    // Validate phone
    if (!phone || !phone.value.trim()) {
      isValid = false;
      showError(phone, 'Phone number is required');
    } else if (!isValidPhone(phone.value.trim())) {
      isValid = false;
      showError(phone, 'Invalid phone number format');
    } else {
      clearError(phone);
    }

    return isValid;
  }

  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    let error = formGroup.querySelector('.error-message');
    if (!error) {
      error = document.createElement('div');
      error.className = 'error-message';
      formGroup.appendChild(error);
    }
    error.textContent = message;
    error.style.display = 'block';
    input.classList.add('error');
  }

  function clearError(input) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message');
    if (error) {
      formGroup.removeChild(error);
    }
  }

  function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  }

  // Function to populate the desk grid
  function populateDeskGrid(filteredProducts = products, activeCategory = 'All Desks') {
    const deskGrid = document.getElementById('desk-grid') || document.getElementById('deskGrid');
    if (!deskGrid) {
      console.error('Desk grid element not found. Make sure the element with id "desk-grid" or "deskGrid" exists.');
      return;
    }

    // Clear existing items
    deskGrid.innerHTML = '';

    if (!Array.isArray(fetchedProducts) || fetchedProducts.length === 0) {
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'No products available. Please try again later.';
      errorMessage.classList.add('error-message');
      deskGrid.appendChild(errorMessage);
      return;
    }

    // Add featured product
    const featuredProduct = fetchedProducts.find(p => p.featured) || filteredProducts[0] || fetchedProducts[0];
    if (featuredProduct) {
      const featuredSection = document.createElement('section');
      featuredSection.classList.add('featured-product');
      featuredSection.innerHTML = createProductHTML(featuredProduct, true);
      deskGrid.appendChild(featuredSection);
    }

    // Group remaining products by category
    const categories = ['All Desks', 'Floor-Standing Desks', 'L-Shaped Desks', 'Corner Desks', 'Laptop Desks', 'Treadmill Desks'];
    categories.forEach(category => {
      let categoryProducts = filterProductsByCategory(filteredProducts, category, featuredProduct ? featuredProduct.id : null);

      if (categoryProducts.length > 0 || category === activeCategory) {
        const categorySection = createCategorySection(category, activeCategory);
        const productGrid = document.createElement('div');
        productGrid.classList.add('desk-category-items');

        categoryProducts.forEach(product => {
          if (product) {
            const deskItem = document.createElement('div');
            deskItem.classList.add('desk-item');
            deskItem.innerHTML = createProductHTML(product);
            productGrid.appendChild(deskItem);
          }
        });

        if (productGrid.children.length > 0) {
          categorySection.appendChild(productGrid);
          deskGrid.appendChild(categorySection);
        }
      }
    });

    // If no products are displayed, show a message
    if (deskGrid.children.length === 0) {
      const noProductsMessage = document.createElement('p');
      noProductsMessage.textContent = 'No products found matching your criteria.';
      noProductsMessage.classList.add('no-products-message');
      deskGrid.appendChild(noProductsMessage);
    }
  }

function createProductHTML(product, isFeatured = false) {
  if (!product) {
    console.error('Product is undefined');
    return '';
  }

  const descriptionLength = isFeatured ? 200 : 100;
  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || Math.floor(Math.random() * 100) + 1;
  const features = product.features || [];

  // Ensure the image path is correct and includes error handling
  const imagePath = product.imageUrl ? `/images/${product.imageUrl}` : '/images/placeholder.jpg';

  return `
    ${isFeatured ? '<h2>Featured Product</h2>' : ''}
    <div class="${isFeatured ? 'featured-product-content' : 'desk-item-content'}">
      <div class="${isFeatured ? 'featured-product-image' : 'desk-item-image'}">
        <img src="${imagePath}" alt="${product.name || 'Product Image'}" onerror="this.onerror=null; this.src='/images/placeholder.jpg';">
      </div>
      <div class="${isFeatured ? 'featured-product-details' : ''}">
        <h3>${product.name || 'Untitled Product'}</h3>
        <p class="description">${truncateDescription(product.description || 'No description available', descriptionLength)}</p>
        <p class="price">$${(product.price || 0).toFixed(2)}</p>
        <div class="rating">
          <span class="stars">${'★'.repeat(Math.floor(rating))}${'☆'.repeat(5 - Math.floor(rating))}</span>
          <span class="review-count">(${reviewCount} reviews)</span>
        </div>
        <ul class="product-features">
          ${features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <p class="material">Material: ${product.material || 'Not specified'}</p>
        <p class="height">Max Height: ${product.height || 'N/A'}cm</p>
        <div class="product-buttons">
          <button class="buy-now-btn" data-id="${product.id || ''}" data-price="${product.price || 0}">Buy Now</button>
          <button class="add-to-cart-btn" data-id="${product.id || ''}" data-price="${product.price || 0}">Add to Cart</button>
          <button class="view-details-btn" data-id="${product.id || ''}">View Details</button>
        </div>
      </div>
    </div>
  `;
}

  function filterProductsByCategory(products, category, featuredProductId) {
    if (category === 'All Desks') {
      return products.filter(product => product.id !== featuredProductId);
    } else {
      const categoryKeywords = (category || '').toLowerCase().split(' ');
      return products.filter(product => {
        const title = (product.title || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const features = Array.isArray(product.features) ? product.features : [];
        return categoryKeywords.every(keyword =>
          title.includes(keyword) ||
          description.includes(keyword) ||
          features.some(feature => (feature || '').toLowerCase().includes(keyword))
        ) && product.id !== featuredProductId;
      });
    }
  }

  function createCategorySection(category, activeCategory) {
    const categorySection = document.createElement('section');
    categorySection.innerHTML = `<h2 class="category-title">${category}</h2>`;
    categorySection.classList.add('desk-category');
    if (category === activeCategory) {
      categorySection.classList.add('active');
    }
    return categorySection;
  }

  // Helper function to truncate description
  function truncateDescription(description, maxLength) {
    if (description.length <= maxLength) return description;
    return description.substr(0, maxLength) + '...';
  }

  // Call the function to populate the desk grid
  populateDeskGrid();

  // Add event listener for "Buy Now", "Add to Cart" buttons and category navigation
  document.addEventListener('click', function(event) {
    console.log('Click event detected:', event.target);

    if (event.target.classList.contains('buy-now-btn') || event.target.classList.contains('add-to-cart-btn')) {
      console.log('Buy Now or Add to Cart button clicked');
      const productId = parseInt(event.target.getAttribute('data-id'));
      const price = parseFloat(event.target.getAttribute('data-price'));
      if (event.target.classList.contains('buy-now-btn')) {
        console.log('Buy Now clicked for product:', productId);
        addItemToBasket(productId, price);
        // Redirect to checkout page or show checkout modal
        // TODO: Implement checkout functionality
      } else {
        console.log('Add to Cart clicked for product:', productId);
        addItemToBasket(productId, price);
      }
    } else if (event.target.closest('#category-nav')) {
      const categoryLink = event.target.closest('a');
      if (categoryLink) {
        console.log('Category link clicked:', categoryLink);
        event.preventDefault();
        const category = categoryLink.getAttribute('data-category');
        console.log('Updating category to:', category);
        updateActiveCategory(category);
        populateDeskGrid(products, category);
      }
    }
  });

  // Ensure category buttons are working
  const categoryButtons = document.querySelectorAll('#category-nav a');
  categoryButtons.forEach(button => {
    console.log('Category button found:', button);
    button.addEventListener('click', function(event) {
      console.log('Category button clicked:', this);
      event.preventDefault();
      const category = this.getAttribute('data-category');
      updateActiveCategory(category);
      populateDeskGrid(products, category);
    });
  });

  function updateActiveCategory(category) {
    const categoryLinks = document.querySelectorAll('#category-nav a');
    categoryLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-category') === category);
    });
  }

  // Add event listeners for filter form inputs and submission
  const filterForm = document.getElementById('filter-form');
  if (filterForm) {
    const minHeightInput = document.getElementById('min-height');
    const maxHeightInput = document.getElementById('max-height');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const heightRangeDisplay = document.getElementById('height-range-display');
    const priceRangeDisplay = document.getElementById('price-range-display');

    [minHeightInput, maxHeightInput].forEach(input => {
      input.addEventListener('input', () => {
        heightRangeDisplay.textContent = `${minHeightInput.value}cm - ${maxHeightInput.value}cm`;
      });
    });

    [minPriceInput, maxPriceInput].forEach(input => {
      input.addEventListener('input', () => {
        priceRangeDisplay.textContent = `$${minPriceInput.value} - $${maxPriceInput.value}`;
      });
    });

    filterForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const formData = new FormData(filterForm);
      const filters = {
        minHeight: parseInt(minHeightInput.value),
        maxHeight: parseInt(maxHeightInput.value),
        minPrice: parseFloat(minPriceInput.value) || 0,
        maxPrice: parseFloat(maxPriceInput.value) || Infinity,
        materials: formData.getAll('material'),
        features: formData.getAll('feature')
      };
      filterProducts(filters);
    });
  }

  // Function to update filter displays
  function updateFilterDisplays(filters) {
    const heightRangeDisplay = document.getElementById('height-range-display');
    if (heightRangeDisplay) {
      heightRangeDisplay.textContent = `${filters.minHeight}cm - ${filters.maxHeight}cm`;
    }
    const priceRangeDisplay = document.getElementById('price-range-display');
    if (priceRangeDisplay) {
      priceRangeDisplay.textContent = `$${filters.minPrice} - $${filters.maxPrice === Infinity ? 'Max' : filters.maxPrice}`;
    }
  }

  function filterProducts(filters) {
    const filteredProducts = products.filter(product => {
      return (product.height >= filters.minHeight &&
              product.height <= filters.maxHeight &&
              product.price >= filters.minPrice &&
              product.price <= filters.maxPrice &&
              (filters.materials.length === 0 || filters.materials.includes(product.material)) &&
              (filters.features.length === 0 || filters.features.some(feature => product.features.includes(feature))));
    });
    populateDeskGrid(filteredProducts);

    // Update height range display
    const heightRangeDisplay = document.getElementById('height-range-display');
    if (heightRangeDisplay) {
      heightRangeDisplay.textContent = `${filters.minHeight}cm - ${filters.maxHeight}cm`;
    }

    // Update price range display
    const priceRangeDisplay = document.getElementById('price-range-display');
    if (priceRangeDisplay) {
      priceRangeDisplay.textContent = `$${filters.minPrice.toFixed(2)} - $${filters.maxPrice === Infinity ? 'Max' : filters.maxPrice.toFixed(2)}`;
    }
  }

  // Initialize basket icon click event
  if (basketIcon) {
    basketIcon.addEventListener('click', () => {
      if (floatingBasket) {
        floatingBasket.classList.toggle('show');
        floatingBasket.classList.remove('hidden');
      } else {
        console.warn('Floating basket element not found, creating one');
        createFloatingBasket();
      }
    });
  } else {
    console.warn('Basket icon not found, creating one');
    createBasketIcon();
  }

  // Close basket button functionality
  const closeBasketBtn = document.querySelector('.close-btn');
  if (closeBasketBtn) {
    closeBasketBtn.addEventListener('click', () => {
      if (floatingBasket) {
        floatingBasket.classList.remove('show');
        floatingBasket.classList.add('hidden');
      } else {
        console.warn('Floating basket element not found when closing');
      }
    });
  } else {
    console.warn('Close basket button not found, adding one to floating basket');
    addCloseButtonToFloatingBasket();
  }

  function createFloatingBasket() {
    floatingBasket = document.createElement('div');
    floatingBasket.id = 'floating-basket';
    floatingBasket.classList.add('hidden');
    document.body.appendChild(floatingBasket);
    updateBasketDisplay();
  }

  function createBasketIcon() {
    basketIcon = document.createElement('a');
    basketIcon.id = 'basket-icon';
    basketIcon.innerHTML = '<i class="fas fa-shopping-cart"></i> <span id="basket-count" class="badge">0</span>';
    document.querySelector('nav ul').appendChild(basketIcon);
    basketIcon.addEventListener('click', () => {
      if (floatingBasket) {
        floatingBasket.classList.toggle('show');
        floatingBasket.classList.remove('hidden');
      } else {
        createFloatingBasket();
      }
    });
  }

  function addCloseButtonToFloatingBasket() {
    if (floatingBasket) {
      const closeBtn = document.createElement('button');
      closeBtn.classList.add('close-btn');
      closeBtn.innerHTML = '&times;';
      closeBtn.addEventListener('click', () => {
        floatingBasket.classList.remove('show');
        floatingBasket.classList.add('hidden');
      });
      floatingBasket.insertBefore(closeBtn, floatingBasket.firstChild);
    } else {
      console.warn('Cannot add close button: floating basket not found');
    }
  }
});
