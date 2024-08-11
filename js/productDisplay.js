// Product display functionality
let products = [];

// Function to fetch products from JSON file
async function fetchProducts() {
  try {
    const response = await fetch('/js/products.json');
    const data = await response.json();
    products = data.products;
    console.log('Products fetched successfully:', products);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Function to display products in the grid
function displayProducts(productsToDisplay = products) {
  const productGrid = document.getElementById('desk-grid');
  if (!productGrid) {
    console.error('Product grid element not found');
    return;
  }

  productGrid.innerHTML = '';

  if (productsToDisplay.length === 0) {
    productGrid.innerHTML = '<p class="no-products">No products available</p>';
    return;
  }

  productsToDisplay.forEach(product => {
    const productElement = createProductElement(product);
    productGrid.appendChild(productElement);
  });
}

// Function to create a product element
function createProductElement(product) {
  const element = document.createElement('div');
  element.classList.add('desk-item');
  element.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.name}">
    <div class="desk-item-content">
      <h3>${product.name}</h3>
      <p>${truncateDescription(product.description, 100)}</p>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button class="buy-now-btn" data-id="${product.id}" data-price="${product.price}">Buy Now</button>
      <button class="add-to-cart-btn" data-id="${product.id}" data-price="${product.price}">Add to Cart</button>
    </div>
  `;
  return element;
}

// Function to filter products
function filterProducts(filters) {
  return products.filter(product => {
    return (
      product.price >= filters.minPrice &&
      product.price <= filters.maxPrice &&
      (filters.category === 'all' || product.category === filters.category)
    );
  });
}

// Helper function to truncate description
function truncateDescription(description, maxLength) {
  if (description.length <= maxLength) return description;
  return description.substr(0, maxLength) + '...';
}

// Function to show checkout modal
function showCheckoutModal(productId, price) {
  const modal = document.getElementById('modal');
  if (!modal) {
    console.error('Checkout modal not found');
    return;
  }

  // Populate modal with product details if needed
  // For example:
  // const productDetails = document.getElementById('product-details');
  // productDetails.textContent = `Product ID: ${productId}, Price: $${price}`;

  modal.style.display = 'block';
}

// Initialize product display
document.addEventListener('DOMContentLoaded', async () => {
  await fetchProducts();
  displayProducts();

  // Event delegation for buy now and add to cart buttons
  document.getElementById('desk-grid').addEventListener('click', (event) => {
    if (event.target.classList.contains('buy-now-btn')) {
      const productId = event.target.dataset.id;
      const price = parseFloat(event.target.dataset.price);
      console.log(`Buy Now clicked for product ${productId} at price $${price}`);
      showCheckoutModal(productId, price);
    } else if (event.target.classList.contains('add-to-cart-btn')) {
      const productId = event.target.dataset.id;
      const price = parseFloat(event.target.dataset.price);
      console.log(`Add to Cart clicked for product ${productId} at price $${price}`);
      // Implement add to cart functionality
      // For example: addToBasket(productId, price);
    }
  });

  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// Export functions for use in other modules
export { fetchProducts, displayProducts, filterProducts };
