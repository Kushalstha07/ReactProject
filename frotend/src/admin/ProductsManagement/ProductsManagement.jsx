import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaShoppingBag, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaEye,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';
import { getAllProducts, deleteProduct, updateProduct, checkAdminAuth } from '../../services/adminApi';
import './ProductsManagement.css';

const ProductsManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'women', label: 'Women' },
    { value: 'kids', label: 'Kids' },
    { value: 'home-linens', label: 'Home Linens' }
  ];

  useEffect(() => {
    if (!checkAdminAuth()) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [navigate, currentPage, searchTerm, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        category: categoryFilter
      };
      
      const response = await getAllProducts(params);
      const { products: productData, pagination } = response.data.data;
      
      setProducts(productData);
      setTotalPages(pagination.totalPages);
      setTotalProducts(pagination.totalProducts);
      setError('');
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(productId);
      setProducts(products.filter(product => product.id !== productId));
      setTotalProducts(totalProducts - 1);
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  };

  const handleToggleActive = async (productId, currentStatus) => {
    try {
      await updateProduct(productId, { isActive: !currentStatus });
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, isActive: !currentStatus } 
          : product
      ));
    } catch (error) {
      console.error('Failed to update product status:', error);
      alert('Failed to update product status');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryBadge = (category) => {
    const categoryClasses = {
      'women': 'category-women',
      'kids': 'category-kids',
      'home-linens': 'category-home'
    };
    
    return `category-badge ${categoryClasses[category] || 'category-default'}`;
  };

  if (loading && products.length === 0) {
    return (
      <div className="products-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-management">
      <div className="page-header">
        <div className="header-content">
          <button 
            className="back-btn"
            onClick={() => navigate('/admin')}
          >
            <FaChevronLeft />
            Back to Dashboard
          </button>
          <div className="header-info">
            <h1><FaShoppingBag /> Products Management</h1>
            <p>Manage your product catalog</p>
          </div>
        </div>
        
        <button 
          className="add-product-btn"
          onClick={() => navigate('/admin/products/add')}
        >
          <FaPlus />
          Add New Product
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchProducts}>Retry</button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="controls-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="filter-section">
          <FaFilter className="filter-icon" />
          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="products-stats">
          <span className="stat-item">Total Products: <strong>{totalProducts}</strong></span>
          <span className="stat-item">Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className={`product-card ${!product.isActive ? 'inactive' : ''}`}>
              <div className="product-image">
                <img 
                  src={product.image} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <div className="product-overlay">
                  <button 
                    className="overlay-btn view"
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="overlay-btn edit"
                    onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                    title="Edit Product"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="overlay-btn delete"
                    onClick={() => handleDeleteProduct(product.id)}
                    title="Delete Product"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="product-info">
                <div className="product-header">
                  <h3 className="product-name">{product.name}</h3>
                  <button
                    className={`toggle-active ${product.isActive ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleActive(product.id, product.isActive)}
                    title={product.isActive ? 'Deactivate Product' : 'Activate Product'}
                  >
                    {product.isActive ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                </div>
                
                <p className="product-description">
                  {product.description.length > 100 
                    ? `${product.description.substring(0, 100)}...` 
                    : product.description
                  }
                </p>
                
                <div className="product-meta">
                  <span className={getCategoryBadge(product.category)}>
                    {product.category}
                  </span>
                  <span className="product-price">{formatCurrency(product.price)}</span>
                </div>
                
                <div className="product-details">
                  <div className="detail-item">
                    <span className="label">Stock:</span>
                    <span className={`value ${product.stock < 10 ? 'low-stock' : ''}`}>
                      {product.stock}
                    </span>
                  </div>
                  {product.size && (
                    <div className="detail-item">
                      <span className="label">Size:</span>
                      <span className="value">{product.size}</span>
                    </div>
                  )}
                  {product.color && (
                    <div className="detail-item">
                      <span className="label">Color:</span>
                      <span className="value">{product.color}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="label">Created:</span>
                    <span className="value">{formatDate(product.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            {searchTerm || categoryFilter ? (
              <div className="no-results">
                <FaSearch size={48} />
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button 
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('');
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="empty-state">
                <FaShoppingBag size={48} />
                <h3>No products yet</h3>
                <p>Start building your catalog by adding your first product</p>
                <button 
                  className="add-first-product-btn"
                  onClick={() => navigate('/admin/products/add')}
                >
                  <FaPlus />
                  Add First Product
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
            Previous
          </button>
          
          <div className="pagination-info">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
