import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaSort, FaTh, FaListUl } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productApi';
import { addToCart, isUserAuthenticated } from '../services/cartApi';
import './Products.css';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Get current filters from URL
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'name';
  const sortOrder = searchParams.get('sortOrder') || 'asc';

  useEffect(() => {
    fetchProducts();
  }, [category, search, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;

      const response = await getProducts(params);
      setProducts(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newFilters };
    setSearchParams(updated);
  };

  const handleSearch = (searchTerm) => {
    handleFilterChange({ search: searchTerm });
  };

  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    handleFilterChange({ sortBy: field, sortOrder: newOrder });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const handleAddToCart = async (cartItem) => {
    // Check if user is logged in
    if (!isUserAuthenticated()) {
      // For public users, show a message to login first
      const loginToast = document.createElement('div');
      loginToast.className = 'login-toast';
      loginToast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>Please login to add items to cart</span>
          <button onclick="window.location.href='/login'" style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Login</button>
        </div>
      `;
      document.body.appendChild(loginToast);
      
      setTimeout(() => {
        if (document.body.contains(loginToast)) {
          document.body.removeChild(loginToast);
        }
      }, 4000);
      return;
    }

    // User is logged in, add to cart via API
    try {
      const cartData = {
        productId: cartItem.id,
        quantity: cartItem.quantity,
        size: cartItem.size,
        color: cartItem.color
      };

      await addToCart(cartData);
      
      // Show success message
      const successToast = document.createElement('div');
      successToast.className = 'success-toast';
      successToast.textContent = 'Item added to cart successfully!';
      document.body.appendChild(successToast);
      
      setTimeout(() => {
        if (document.body.contains(successToast)) {
          document.body.removeChild(successToast);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Show error message
      const errorToast = document.createElement('div');
      errorToast.className = 'error-toast';
      errorToast.textContent = error.response?.data?.message || 'Failed to add item to cart';
      document.body.appendChild(errorToast);
      
      setTimeout(() => {
        if (document.body.contains(errorToast)) {
          document.body.removeChild(errorToast);
        }
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-container">
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <h1>Our Products</h1>
          <p>Discover our collection of 100% cotton products</p>
        </div>

          <div className="controls-panel">
            <div className="controls-left">
              <button 
                className="filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter /> Filters
              </button>
              <span className="product-count">
                {products.length} products found
              </span>
            </div>

            <div className="controls-right">
              <div className="sort-controls">
                <select 
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    handleSort(field);
                  }}
                >
                  <option value="name-asc">Sort by Name (A-Z)</option>
                  <option value="name-desc">Sort by Name (Z-A)</option>
                  <option value="price-asc">Sort by Price (Low-High)</option>
                  <option value="price-desc">Sort by Price (High-Low)</option>
                </select>
              </div>

              <div className="view-controls">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <FaTh />
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <FaListUl />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="filter-sidebar">
              <div className="filter-section">
                <h3>Category</h3>
                <select 
                  value={category}
                  onChange={(e) => handleFilterChange({ category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="home-linens">Home Linens</option>
                </select>
              </div>

              <div className="filter-section">
                <h3>Price Range</h3>
                <input
                  type="number"
                  placeholder="Min Price"
                  onChange={(e) => handleFilterChange({ minPrice: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
                />
              </div>

              <button className="clear-filters" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          )}

          {error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchProducts}>Try Again</button>
            </div>
          ) : products.length === 0 ? (
            <div className="no-products-found">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className={`products-grid ${viewMode}`}>
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

export default Products; 