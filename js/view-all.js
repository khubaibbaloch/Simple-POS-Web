// Toggle action menu function
function toggleActionMenu(event, itemId) {
    event.stopPropagation();
    document.querySelectorAll('.action-menu').forEach(menu => {
        if (menu.id !== `menu-${itemId}`) menu.style.display = 'none';
    });
    const menu = document.getElementById(`menu-${itemId}`);
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Close menus if clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.action-menu').forEach(menu => {
        menu.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const brandTitle = document.getElementById('brand-title');
    const totalItems = document.getElementById('total-items');
    const itemsGrid = document.getElementById('items-grid');
    const searchInput = document.querySelector('.search-bar input');
    const tabs = document.querySelectorAll('.tab');
    
    // Delete Dialog Elements
    const deleteDialog = document.getElementById('deleteDialog');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    let selectedItemId = null;

    // Data State
    let allItems = [];
    let currentBrandItems = [];
    let activeCondition = 'all';
    let searchTerm = '';

    // Event Listeners
    const addItemBtn = document.querySelector('.add-item-btn');
    addItemBtn.addEventListener('click', () => {
        window.location.href = 'add-item.html';
    });

    // Delete Dialog Handlers
    confirmDeleteBtn.addEventListener('click', handleDeleteConfirmation);
    cancelDeleteBtn.addEventListener('click', closeDeleteDialog);
    deleteDialog.addEventListener('click', (e) => {
        if (e.target === deleteDialog) closeDeleteDialog();
    });

    // Initial Setup
    const urlParams = new URLSearchParams(window.location.search);
    const selectedBrand = urlParams.get('brand');

    // Fetch Items
    fetch('http://localhost/mobile-stock/get_items.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                allItems = data.data;
                filterItemsByBrand();
                setupEventListeners();
                updateUI();
            } else {
                console.error('Fetch failed:', data.message);
            }
        })
        .catch(console.error);

    // Core Functions
    function filterItemsByBrand() {
        currentBrandItems = allItems.filter(item => item.brand === selectedBrand);
    }

    function setupEventListeners() {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                activeCondition = tab.dataset.tab;
                updateUI();
            });
        });

        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.trim().toLowerCase();
            updateUI();
        });
    }

    function updateUI() {
        const tokens = searchTerm.split(/\s+/).filter(Boolean);
        const filtered = currentBrandItems.filter(item => 
            tokens.every(token => 
                item.brand.toLowerCase().includes(token) || 
                item.model.toLowerCase().includes(token)
            ) && 
            (activeCondition === 'all' || item.condition === activeCondition)
        );

        renderItems(filtered);
        totalItems.textContent = `Showing ${filtered.length} devices`;
        brandTitle.textContent = `${selectedBrand} Devices`;
    }

    function renderItems(items) {
        itemsGrid.innerHTML = '';
        items.forEach(item => createItemCard(item));
    }

    function createItemCard(item) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = generateItemHTML(item);
        card.addEventListener('click', () => {
            window.location.href = `item-detail.html?id=${item.id}`;
        });
        itemsGrid.appendChild(card);
    }

    function generateItemHTML(item) {
        const priceAfterDiscount = item.sellingPrice - (item.sellingPrice * (item.discount / 100));
        const purchaseDate = new Date(item.purchaseDate).toLocaleDateString();
        
        return `
            <div class="item-image-container">
                <img src="${item.invoice ? `data:image/jpeg;base64,${item.invoice}` : 'https://via.placeholder.com/300'}" 
                     alt="${item.model}" class="item-image">
                <div class="item-badges">
                    <div class="status-badge condition">
                        <i class="fas fa-${item.condition === 'new' ? 'tags' : 'history'}"></i>
                        ${item.condition}
                    </div>
                    <div class="top-right-controls">
                        <div class="status-badge status ${item.status.toLowerCase()}">
                            <i class="fas fa-${item.status === 'Available' ? 'check-circle' : 'times-circle'}"></i>
                            ${item.status}
                        </div>
                        <button class="action-toggle" onclick="toggleActionMenu(event, '${item.id}')">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <div class="action-menu" id="menu-${item.id}">
                            <button class="action-button edit" onclick="event.stopPropagation(); editItem('${item.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="action-button delete" onclick="event.stopPropagation(); deleteItem('${item.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item-details">
                ${generateItemDetails(item, priceAfterDiscount, purchaseDate)}
            </div>`;
    }

    function generateItemDetails(item, price, date) {
        return `
            <div class="item-header">
                <h3 class="item-title">${item.brand} ${item.model}</h3>
                <div class="item-price">
                    <span class="current-price">$${price}</span>
                    ${item.discount > 0 ? `<span class="original-price">$${item.sellingPrice}</span>` : ''}
                </div>
            </div>
            <div class="specs-grid">
                ${['ram', 'storage', 'network'].map(field => `
                    <div class="spec-item">
                        <i class="fas fa-${getSpecIcon(field)} spec-icon"></i>
                        ${item[field]}
                        <span class="spec-label">${field.charAt(0).toUpperCase() + field.slice(1)}</span>
                    </div>`).join('')}
            </div>
            <div class="detail-grid">
                ${generateDetailItems(item, date)}
            </div>
            ${generateStockInfo(item)}`;
    }

    function getSpecIcon(field) {
        return {
            ram: 'memory',
            storage: 'database',
            network: 'sim-card'
        }[field];
    }

    function generateDetailItems(item, date) {
        return [
            { label: 'IMEI', value: item.imei },
            { label: 'Color', value: item.color,  },
            { label: 'Battery Health', value: `${item.batteryHealth}%`, wrap: true },
            { label: 'Warranty', value: item.warranty || 'None',wrap: true  },
            { label: 'Supplier', value: item.supplier },
            { label: 'Purchase Date', value: date, wrap: true }
        ].map(detail => `
            <div class="detail-item ${detail.wrap ? 'wrap-text' : ''}">
                <span class="detail-label">${detail.label}</span>
                <span class="detail-value" title="${detail.value}">${detail.value}</span>
            </div>`).join('');
    }

    function generateStockInfo(item) {
        return `
            <div class="stock-info">
                <div class="stock-status">
                    <div class="stock-dot ${getStockStatusClass(item)}"></div>
                    ${item.quantity > 0 ? `${item.quantity} in stock` : 'Out of stock'}
                </div>
                ${item.quantity <= item.restockThreshold && item.quantity > 0 ? `
                    <div class="restock-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        Restock needed
                    </div>` : ''}
            </div>`;
    }

    function getStockStatusClass(item) {
        if (item.quantity === 0) return 'out-of-stock';
        return item.quantity <= item.restockThreshold ? 'low-stock' : 'in-stock';
    }

    // Delete Functionality
    window.deleteItem = function(itemId) {
        selectedItemId = itemId;
        deleteDialog.style.display = 'flex';
    };

    function handleDeleteConfirmation() {
        if (!selectedItemId) return;

        fetch('http://localhost/mobile-stock/delete_item.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedItemId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Item deleted successfully');
                window.location.reload();
            } else {
                alert('Deletion failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete item');
        })
        .finally(closeDeleteDialog);
    }

    function closeDeleteDialog() {
        deleteDialog.style.display = 'none';
        selectedItemId = null;
    }

    // Edit Function (placeholder)
    // Edit Function
window.editItem = function(itemId) {
    window.location.href = `add-item.html?id=${itemId}`;
};
});