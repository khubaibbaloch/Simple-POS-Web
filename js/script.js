document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const searchInput = document.querySelector('.search-bar input');
    let allItems = [];
    let groupedItems = {};

    // Add Item button navigation
    const addItemBtn = document.querySelector('.add-item-btn');
    addItemBtn.addEventListener('click', () => {
        window.location.href = 'add-item.html';
    });

    // Fetch data from the PHP backend
    fetch('http://localhost/mobile-stock/get_items.php')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                allItems = data.data;
                groupedItems = groupItemsByBrand(allItems);
                createBrandSections(groupedItems);
            } else {
                console.error('Error fetching data:', data.message);
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });

    // Search functionality
    searchInput.addEventListener('input', handleSearch);

    function handleSearch(e) {
        const searchTerm = e.target.value.trim().toLowerCase();
        const filteredItems = allItems.filter(item => {
            const fullName = `${item.brand.toLowerCase()} ${item.model.toLowerCase()}`;
            return (
                item.brand.toLowerCase().includes(searchTerm) || // Match brand
                item.model.toLowerCase().includes(searchTerm) || // Match model
                fullName.includes(searchTerm) // Match full name (brand + model)
            );
        });

        const filteredGrouped = groupItemsByBrand(filteredItems);
        container.innerHTML = ''; // Clear current items
        createBrandSections(filteredGrouped);
    }

    function groupItemsByBrand(items) {
        return items.reduce((acc, item) => {
            if (!acc[item.brand]) acc[item.brand] = [];
            acc[item.brand].push(item);
            return acc;
        }, {});
    }

    function createBrandSections(groupedItems) {
        for (const brand in groupedItems) {
            if (!groupedItems.hasOwnProperty(brand)) continue;

            const brandSection = document.createElement('div');
            brandSection.classList.add('brand-section');

            // Brand header
            const brandHeader = document.createElement('div');
            brandHeader.classList.add('brand-header');

            const brandTitle = document.createElement('h2');
            brandTitle.classList.add('brand-title');
            brandTitle.textContent = brand;

            const viewAllBtn = document.createElement('button');
            viewAllBtn.classList.add('view-all-btn');
            viewAllBtn.textContent = 'View All';
            viewAllBtn.addEventListener('click', () => {
                window.location.href = `view-all.html?brand=${encodeURIComponent(brand)}`;
            });

            brandHeader.appendChild(brandTitle);
            brandHeader.appendChild(viewAllBtn);

            // Items grid
            const itemsGrid = document.createElement('div');
            itemsGrid.classList.add('items-grid');

            groupedItems[brand].slice(0, 3).forEach(item => {
                const itemCard = createItemCard(item);
                itemsGrid.appendChild(itemCard);
            });

            brandSection.appendChild(brandHeader);
            brandSection.appendChild(itemsGrid);
            container.appendChild(brandSection);
        }
    }

    function createItemCard(item) {
        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card');

        // Item image
        const itemImage = document.createElement('img');
        itemImage.src = item.invoice 
            ? `data:image/jpeg;base64,${item.invoice}` 
            : 'https://via.placeholder.com/300';
        itemImage.alt = `${item.brand} ${item.model}`;

        // Item details
        const itemDetails = document.createElement('div');
        itemDetails.classList.add('item-details');

        const itemName = document.createElement('h3');
        itemName.textContent = `${item.brand} ${item.model}`;

        const itemPrice = document.createElement('div');
        itemPrice.classList.add('price');
        itemPrice.textContent = `$${item.sellingPrice}`;

        const stockInfo = document.createElement('div');
        stockInfo.classList.add('stock-info');

        const stockStatus = document.createElement('div');
        stockStatus.classList.add('stock', item.quantity > 0 ? 'in-stock' : 'out-of-stock');
        stockStatus.textContent = item.quantity > 0 ? 'In Stock' : 'Out of Stock';

        stockInfo.appendChild(stockStatus);
        itemDetails.append(itemName, itemPrice, stockInfo);
        itemCard.append(itemImage, itemDetails);

        return itemCard;
    }
});