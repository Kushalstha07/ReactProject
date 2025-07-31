import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  FaArrowLeft, 
  FaImage, 
  FaUpload, 
  FaTags, 
  FaDollarSign,
  FaCube,
  FaPalette,
  FaRuler,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import { createProduct, checkAdminAuth } from '../../services/adminApi';
import './AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      isActive: true,
      stock: 0
    }
  });

  // Check admin auth
  React.useEffect(() => {
    if (!checkAdminAuth()) {
      navigate('/login');
    }
  }, [navigate]);

  const categories = [
    { value: 'women', label: 'Women' },
    { value: 'kids', label: 'Kids' },
    { value: 'home-linens', label: 'Home Linens' }
  ];

  const sizes = [
    { value: 'XS', label: 'Extra Small (XS)' },
    { value: 'S', label: 'Small (S)' },
    { value: 'M', label: 'Medium (M)' },
    { value: 'L', label: 'Large (L)' },
    { value: 'XL', label: 'Extra Large (XL)' },
    { value: 'XXL', label: 'Double XL (XXL)' },
    { value: 'One Size', label: 'One Size' }
  ];

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageError(''); // Clear any existing errors
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setValue('image', file); // Store the actual file, not base64
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setImageError('Please select a valid image file (JPG, PNG, GIF)');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const onSubmit = async (data) => {
    // Check if image is selected
    if (!watch('image')) {
      setImageError('Please select a product image');
      return;
    }

    setLoading(true);
    setImageError(''); // Clear any existing errors
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('category', data.category);
      formData.append('stock', data.stock || 0);
      if (data.size) formData.append('size', data.size);
      if (data.color) formData.append('color', data.color);
      formData.append('isActive', data.isActive);
      formData.append('image', data.image);

      await createProduct(formData);
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'success-toast';
      successDiv.textContent = 'Product created successfully!';
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        document.body.removeChild(successDiv);
        navigate('/admin/products');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to create product:', error);
      
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-toast';
      errorDiv.textContent = error.response?.data?.message || 'Failed to create product';
      document.body.appendChild(errorDiv);
      
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      navigate('/admin/products');
    }
  };

  return (
    <div className="add-product">
      <div className="add-product-header">
        <button 
          className="back-btn"
          onClick={() => navigate('/admin/products')}
        >
          <FaArrowLeft />
          Back to Products
        </button>
        <h1>Add New Product</h1>
        <p>Create a new product for your CottonCo catalog</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="add-product-form">
        <div className="form-grid">
          {/* Left Column */}
          <div className="form-column">
            {/* Basic Information */}
            <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <FaTags /> Product Name *
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter product name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  {...register('name', { 
                    required: 'Product name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                />
                {errors.name && <span className="error-message">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Product Description *
                </label>
                <textarea
                  id="description"
                  placeholder="Describe your product in detail..."
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  rows="4"
                  {...register('description', { 
                    required: 'Product description is required',
                    minLength: { value: 10, message: 'Description must be at least 10 characters' }
                  })}
                />
                {errors.description && <span className="error-message">{errors.description.message}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    Category *
                  </label>
                  <select
                    id="category"
                    className={`form-select ${errors.category ? 'error' : ''}`}
                    {...register('category', { required: 'Category is required' })}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="error-message">{errors.category.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="price" className="form-label">
                    <FaDollarSign /> Price *
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className={`form-input ${errors.price ? 'error' : ''}`}
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                  />
                  {errors.price && <span className="error-message">{errors.price.message}</span>}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="form-section">
              <h2>Product Details</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="stock" className="form-label">
                    <FaCube /> Stock Quantity
                  </label>
                  <input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    className="form-input"
                    {...register('stock', { 
                      min: { value: 0, message: 'Stock cannot be negative' }
                    })}
                  />
                  {errors.stock && <span className="error-message">{errors.stock.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="size" className="form-label">
                    <FaRuler /> Size
                  </label>
                  <select
                    id="size"
                    className="form-select"
                    {...register('size')}
                  >
                    <option value="">Select size (optional)</option>
                    {sizes.map(size => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="color" className="form-label">
                  <FaPalette /> Color
                </label>
                <input
                  id="color"
                  type="text"
                  placeholder="e.g., Red, Blue, Multi-color"
                  className="form-input"
                  {...register('color')}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                  />
                  <span className="checkbox-custom"></span>
                  Active Product (visible to customers)
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="form-column">
            <div className="form-section">
              <h2>Product Image</h2>
              
              <div className="image-upload-section">
                <div 
                  className={`image-upload-area ${dragActive ? 'drag-active' : ''} ${imagePreview ? 'has-image' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Product preview" />
                      <div className="image-overlay">
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => {
                            setImagePreview('');
                            setValue('image', '');
                            setImageError('');
                          }}
                        >
                          <FaTimes /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <FaImage className="upload-icon" />
                      <h3>Upload Product Image</h3>
                      <p>Drag and drop an image here, or click to select</p>
                      <button type="button" className="upload-btn">
                        <FaUpload /> Choose Image
                      </button>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input"
                    onChange={(e) => handleImageChange(e.target.files[0])}
                  />
                </div>
                
                {imageError && <span className="error-message">{imageError}</span>}
                
                <div className="upload-guidelines">
                  <h4>Image Guidelines:</h4>
                  <ul>
                    <li>Recommended size: 800x800px or larger</li>
                    <li>Formats: JPG, PNG, WebP</li>
                    <li>Max file size: 5MB</li>
                    <li>Square images work best</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            <FaTimes />
            Cancel
          </button>
          
          <button
            type="submit"
            className={`submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Creating Product...
              </>
            ) : (
              <>
                <FaSave />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
