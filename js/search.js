// Animated text search functionality
import { addToBasket } from './basket.js';
import { fetchProducts } from './productDisplay.js';

let searchInput, searchResults, searchButton;
let products = [];

document.addEventListener('DOMContentLoaded', async () => {
  searchInput = document.querySelector('#searchInput');
  searchResults = document.querySelector('#searchResults');
  searchButton = document.querySelector('#searchButton');

  if (!searchInput || !searchResults || !searchButton) {
    console.warn('Some search elements not found. Creating missing elements.');

    if (!searchInput) {
      searchInput = document.createElement('input');
      searchInput.id = 'searchInput';
      searchInput.placeholder = 'Search desks...';
      document.body.appendChild(searchInput);
    }

    if (!searchResults) {
      searchResults = document.createElement('div');
      searchResults.id = 'searchResults';
      document.body.appendChild(searchResults);
    }

    if (!searchButton) {
      searchButton = document.createElement('button');
      searchButton.id = 'searchButton';
      searchButton.innerHTML = '<i class="fas fa-search"></i>';
      document.body.appendChild(searchButton);
    }
  }

  console.log('Search functionality initialized');
  searchButton.addEventListener('click', performSearch);

  products = await fetchProducts();
  initializeSearch();
});

function performSearch() {
  console.log('Search button clicked');
  const value = searchInput.value.toLowerCase().trim();
  displaySearchResults(value);
}

function initializeSearch() {
  if (searchInput && searchResults) {
    console.log('Search functionality initialized');
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const value = e.target.value.toLowerCase().trim();
        displaySearchResults(value);
      }, 300); // Debounce delay
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('show');
      }
    });

    // Add close button for search results
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.classList.add('close-search-results');
    closeButton.addEventListener('click', () => {
      searchResults.classList.remove('show');
      searchInput.value = '';
    });
    searchResults.appendChild(closeButton);
  } else {
    console.error('Search input or results container not found in the DOM');
  }
}

function displaySearchResults(value) {
  searchResults.innerHTML = ''; // Clear previous results

  if (value === '') {
    searchResults.classList.remove('show');
    return;
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(value) ||
    product.description.toLowerCase().includes(value)
  );

  if (filteredProducts.length === 0) {
    searchResults.innerHTML = '<p class="no-results">No results found</p>';
  } else {
    filteredProducts.forEach(product => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('search-result-item');
      resultItem.innerHTML = `
        <img src="images/${product.imageUrl}" alt="${product.name}" class="search-result-image">
        <div class="search-result-content">
          <h3>${product.name}</h3>
          <p>${truncateDescription(product.description, 100)}</p>
          <p class="price">$${product.price.toFixed(2)}</p>
          <button class="buy-now-btn" data-id="${product.id}" data-price="${product.price}">Buy Now</button>
          <button class="add-to-cart-btn" data-id="${product.id}" data-price="${product.price}">Add to Cart</button>
        </div>
      `;
      searchResults.appendChild(resultItem);

      // Add event listeners for buttons
      const buyNowBtn = resultItem.querySelector('.buy-now-btn');
      const addToCartBtn = resultItem.querySelector('.add-to-cart-btn');

      buyNowBtn.addEventListener('click', () => {
        addToBasket(product.id, product.price);
        // Implement buy now functionality
      });

      addToCartBtn.addEventListener('click', () => {
        addToBasket(product.id, product.price);
      });
    });
  }

  searchResults.classList.add('show');
}

// Helper function to truncate description
function truncateDescription(description, maxLength) {
  if (description.length <= maxLength) return description;
  return description.substr(0, maxLength) + '...';
}

export { initializeSearch };
