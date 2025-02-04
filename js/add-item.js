document.addEventListener('DOMContentLoaded', () => {
    // Brand and Model Data
    const brands = [
        { 
            name: 'Apple',
            models: ['iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone SE'],
            colors: ['Space Gray', 'Silver', 'Gold', 'Midnight Green']
        },
        {
            name: 'Samsung',
            models: ['Galaxy S23', 'Galaxy Z Flip', 'Galaxy A54', 'Galaxy Note 20'],
            colors: ['Phantom Black', 'Cream', 'Green', 'Lavender']
        },
        {
            name: 'Google',
            models: ['Pixel 8', 'Pixel 7a', 'Pixel Fold', 'Pixel 6a'],
            colors: ['Obsidian', 'Snow', 'Hazel', 'Charcoal']
        }
    ];

    // Common Specifications
    const rams = [4, 6, 8, 12, 16];
    const storages = [64, 128, 256, 512, 1024];
    const conditions = ['New', 'Used', 'Refurbished'];
    const statusList = ['In Stock', 'Sold Out'];
    const warrantyStatuses = ['Under Warranty', 'Expired'];

    // Get item ID from URL if editing
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    const isEditMode = !!itemId;

    // Update form title and submit button text for edit mode
    const formTitle = document.querySelector('.form-title');
    const submitButton = document.querySelector('.submit-btn');
    if (isEditMode) {
        formTitle.textContent = 'Edit Product';
        submitButton.textContent = 'Update Product';
    }

    // Populate Brand Dropdown
    const brandSelect = document.getElementById('brand');
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand.name.toLowerCase();
        option.textContent = brand.name;
        brandSelect.appendChild(option);
    });

    // Populate Models based on Brand selection
    brandSelect.addEventListener('change', () => {
        const mobileSelect = document.getElementById('mobile');
        mobileSelect.innerHTML = '<option value="">Select Model</option>';
        
        const selectedBrand = brands.find(b => b.name.toLowerCase() === brandSelect.value);
        if (selectedBrand) {
            selectedBrand.models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.toLowerCase().replace(/\s/g, '-');
                option.textContent = model;
                mobileSelect.appendChild(option);
            });
        }
    });

    // Populate RAM Options
    const ramSelect = document.getElementById('ram');
    rams.forEach(ram => {
        const option = document.createElement('option');
        option.value = ram;
        option.textContent = `${ram} GB`;
        ramSelect.appendChild(option);
    });

    // Populate Storage Options
    const storageSelect = document.getElementById('storage');
    storages.forEach(storage => {
        const option = document.createElement('option');
        option.value = storage;
        option.textContent = `${storage} GB`;
        storageSelect.appendChild(option);
    });

    // Populate Color Options
    const colorSelect = document.getElementById('color');
    brands.forEach(brand => {
        brand.colors.forEach(color => {
            if (!Array.from(colorSelect.options).some(option => option.text === color)) {
                const option = document.createElement('option');
                option.value = color.toLowerCase().replace(/\s/g, '-');
                option.textContent = color;
                colorSelect.appendChild(option);
            }
        });
    });

    // Populate Condition Options
    const conditionSelect = document.getElementById('condition');
    conditions.forEach(condition => {
        const option = document.createElement('option');
        option.value = condition.toLowerCase();
        option.textContent = condition;
        conditionSelect.appendChild(option);
    });

    // Select Stock Status
    const stockStatusSelect = document.getElementById('status');
    statusList.forEach(status => {
        const option = document.createElement('option');
        option.value = status.toLowerCase();
        option.textContent = status;
        stockStatusSelect.appendChild(option);
    });

    // Populate Warranty Status
    const warrantySelect = document.getElementById('warranty');
    warrantyStatuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status.toLowerCase().replace(/\s/g, '_');
        option.textContent = status;
        warrantySelect.appendChild(option);
    });

    // Profit Margin Calculator
    const purchasePrice = document.getElementById('purchasePrice');
    const sellingPrice = document.getElementById('sellingPrice');
    const profitMargin = document.getElementById('profitMargin');

    [purchasePrice, sellingPrice].forEach(input => {
        input.addEventListener('input', () => {
            if (purchasePrice.value && sellingPrice.value) {
                const profit = sellingPrice.value - purchasePrice.value;
                const margin = (profit / purchasePrice.value * 100);
                profitMargin.value = `${margin}% ($${profit})`;
            }
        });
    });

    // Fetch item data if in edit mode
    if (isEditMode) {
        fetch(`http://localhost/mobile-stock/get_items.php`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Filter the returned data to find the item with matching id
                    const item = data.data.find(item => item.id == itemId);
                    if (item) {
                        populateForm(item);
                    } else {
                        showMessage('Item not found', 'error');
                    }
                } else {
                    showMessage('Error loading items: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error fetching items:', error);
                showMessage('Failed to load items data', 'error');
            });
    }

    // Function to populate form with item data
    function populateForm(item) {
        // Basic Information
        document.getElementById('mobileId').value = item.id;
        document.getElementById('brand').value = item.brand.toLowerCase();
        document.getElementById('brand').dispatchEvent(new Event('change'));

        // Wait for models to populate
        setTimeout(() => {
            document.getElementById('mobile').value = item.model.toLowerCase().replace(/\s/g, '-');
        }, 100);

        document.getElementById('condition').value = item.condition.toLowerCase();
        document.getElementById('ram').value = parseInt(item.ram);
        document.getElementById('storage').value = parseInt(item.storage);
        document.getElementById('imei').value = item.imei;
        document.getElementById('status').value = item.status.toLowerCase();

        // Specifications
        document.getElementById('batteryHealth').value = item.batteryHealth;
        document.getElementById('color').value = item.color.toLowerCase().replace(/\s/g, '-');

        // Pricing
        document.getElementById('purchasePrice').value = item.purchasePrice;
        document.getElementById('sellingPrice').value = item.sellingPrice;
        document.getElementById('discount').value = item.discount;
        // Calculate profit margin if values exist
        if (purchasePrice.value && sellingPrice.value) {
            const profit = sellingPrice.value - purchasePrice.value;
            const margin = (profit / purchasePrice.value * 100);
            profitMargin.value = `${margin}% ($${profit})`;
        }

        // Stock Management
        document.getElementById('quantity').value = item.quantity;
        document.getElementById('restockThreshold').value = item.restockThreshold;
        document.getElementById('supplier').value = item.supplier;

        // Accessories
        const accessories = item.accessories.split(',');
        document.querySelectorAll('[name="accessories[]"]').forEach(checkbox => {
            checkbox.checked = accessories.includes(checkbox.value);
        });

        // Network
        const networks = item.network.split(',');
        document.querySelectorAll('[name="network[]"]').forEach(checkbox => {
            checkbox.checked = networks.includes(checkbox.value);
        });

        // Warranty
        document.getElementById('warranty').value = item.warranty.toLowerCase().replace(/\s/g, '_');
        document.getElementById('purchaseDate').value = new Date(item.purchaseDate).toISOString().split('T')[0];

    }

    // Form Submission Handler
    document.getElementById('addItemForm').addEventListener('submit', (e) => {
        e.preventDefault();
    
        // Get the file input
        const invoiceInput = document.getElementById('invoice');
        const invoiceFile = invoiceInput.files[0];
    
        // Check if the file is required (only for add mode)
        if (!isEditMode && !invoiceFile) {
            showMessage('Invoice/Receipt is required for adding a new item.', 'error');
            return; // Stop form submission
        }
    
        // Prepare form data
        const formData = new FormData(e.target);
        if (isEditMode) formData.append('id', itemId);
    
        // Submit the form
        fetch(`http://localhost/mobile-stock/${isEditMode ? 'update_item.php' : 'add_item.php'}`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage(`Item ${isEditMode ? 'updated' : 'added'} successfully!`, 'success');
                e.target.reset();
                
                // Reset UI to add mode
                formTitle.textContent = 'Add Product';
                submitButton.textContent = 'Add Item';
            } else {
                showMessage(`Error: ${data.message}`, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('An error occurred', 'error');
        });
    });

    // Function to display messages on the screen
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        // Add the message after the submit button
        submitButton.insertAdjacentElement('afterend', messageDiv);

        // Remove the message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
});
