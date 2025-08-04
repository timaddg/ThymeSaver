import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './ReceiptUpload.css';

const ReceiptUpload: React.FC = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedIngredients, setExtractedIngredients] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setSuccess(null);
      setExtractedIngredients([]);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setSuccess(null);
      setExtractedIngredients([]);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const extractIngredients = async () => {
    if (!selectedFile || !user) {
      setError('Please select an image and ensure you are logged in');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert image to base64
      const base64 = await fileToBase64(selectedFile);

      // Send to backend for Gemini processing
      const response = await fetch('/api/extract-ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          image: base64,
          filename: selectedFile.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setExtractedIngredients(data.ingredients);
        setSuccess(`Successfully extracted ${data.ingredients.length} ingredients from your receipt!`);
      } else {
        setError(data.error || 'Failed to extract ingredients');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const addToGroceryList = async () => {
    if (extractedIngredients.length === 0) {
      setError('No ingredients to add');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ingredients/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          ingredients: extractedIngredients.map(name => ({ name, quantity: 1 })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Successfully added ${extractedIngredients.length} ingredients to your grocery list!`);
        setExtractedIngredients([]);
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setError(data.error || 'Failed to add ingredients to grocery list');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add ingredients');
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64 string
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedIngredients([]);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!user) {
    return (
      <div className="receipt-upload-container">
        <div className="receipt-upload-empty">
          <h2>Please log in to use receipt upload</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="receipt-upload-container">
      <div className="receipt-upload-header">
        <h2 className="receipt-upload-title">Upload Grocery Receipt</h2>
        <p className="receipt-upload-subtitle">
          Take a photo of your grocery receipt and let AI extract ingredients for you
        </p>
      </div>

      <div className="receipt-upload-content">
        {!selectedFile ? (
          <div 
            className="receipt-upload-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">📷</div>
            <h3>Upload Receipt Image</h3>
            <p>Drag and drop your receipt image here, or click to browse</p>
            <p className="upload-hint">Supports JPEG, PNG, and other image formats (max 10MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div className="receipt-preview-section">
            <div className="receipt-preview">
              <img src={previewUrl!} alt="Receipt preview" className="receipt-image" />
              <button className="clear-btn" onClick={clearSelection}>
                ✕
              </button>
            </div>
            
            <div className="receipt-actions">
              <button 
                className="extract-btn"
                onClick={extractIngredients}
                disabled={loading}
              >
                {loading ? 'Extracting...' : 'Extract Ingredients'}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="receipt-error">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="receipt-success">
            <p>{success}</p>
          </div>
        )}

        {extractedIngredients.length > 0 && (
          <div className="extracted-ingredients">
            <h3>Extracted Ingredients ({extractedIngredients.length})</h3>
            <div className="ingredients-list">
              {extractedIngredients.map((ingredient, index) => (
                <div key={index} className="ingredient-item">
                  {ingredient}
                </div>
              ))}
            </div>
            <button 
              className="add-to-grocery-btn"
              onClick={addToGroceryList}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add to Grocery List'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptUpload; 