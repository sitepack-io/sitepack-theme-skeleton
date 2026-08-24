/**
 * Example Web Component for a simple toggle button
 */
class ToggleButton extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', () => {
            const targetId = this.getAttribute('toggle-target');
            if (targetId) {
                const target = document.getElementById(targetId);
                if (target) {
                    target.style.display = target.style.display === 'none' ? 'block' : 'none';
                }
            }
        });
    }
}

customElements.define('toggle-button', ToggleButton);

// Initialize SitePackSDK
window.sitepackSdk = new SitePackSDK({type: 'theme', id: 'skeleton'});
const sdk = window.sitepackSdk;

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.querySelector('nav ul');

    if (navToggle && navList) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navList.classList.toggle('menu-open');
        });
    }

    const dropdowns = document.querySelectorAll('nav ul .dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    const href = this.getAttribute('href');
                    if (href === '#' || !href || dropdown.querySelector('.dropdown-menu')) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                }
            });
        }
    });

    // Product tabs
    const tabLinks = document.querySelectorAll('.product-tab-link');
    const tabContents = document.querySelectorAll('.product-tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            tabContents.forEach(content => {
                if (content.id === `tab-${tabId}`) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    });

    // Product thumbnails
    const mainImage = document.querySelector('.product-main-image img');
    const thumbnails = document.querySelectorAll('.product-thumbnails img');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            if (mainImage) {
                mainImage.src = this.src;
            }
        });
    });

    // Global Add to cart form handler (Delegated for global use)
    document.addEventListener('submit', async function(e) {
        const form = e.target.closest('.product-add-to-cart');
        if (!form) return;
        
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled');
        }
        
        const formData = new FormData(form);
        const productId = formData.get('id') || formData.get('product_id') || formData.get('product');
        const quantity = formData.get('quantity') || 1;

        try {
            const data = await sdk.ecommerce.addToCart(productId, parseInt(quantity));
            console.log('Added to cart:', data);
            
            // Dispatch a global event that other components can listen to
            window.dispatchEvent(new CustomEvent('sitepack:cart:added', {
                detail: { product: productId, quantity: quantity, response: data }
            }));
            
            // Open the cart sidebar (standard behavior)
            const cartTrigger = document.getElementById('sitepack-cart-trigger');
            if (cartTrigger) {
                cartTrigger.click();
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Could not add product to cart. Please try again.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('disabled');
            }
        }
    });

    // Sidebar filter toggle (Mobile)
    const sidebarToggle = document.getElementById('sidebar-filter-toggle');
    const sidebarFilters = document.getElementById('sidebar-category-filters');

    if (sidebarToggle && sidebarFilters) {
        sidebarToggle.addEventListener('click', function() {
            sidebarFilters.classList.toggle('show');
            const isVisible = sidebarFilters.classList.contains('show');
            this.innerHTML = isVisible ? '<i class="fas fa-filter"></i> ' + (window.SITEPACK_TRANS?.category?.hide_filters || 'Hide filters') : '<i class="fas fa-filter"></i> ' + (window.SITEPACK_TRANS?.category?.show_filters || 'Show filters');
        });
    }

    // Filter collapse logic
    const filterLinks = document.querySelectorAll('.filter-link[data-toggle="collapse"]');
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            const target = document.getElementById(targetId);

            if (target) {
                const isCollapsed = target.classList.contains('show') || target.classList.contains('in');
                
                if (isCollapsed) {
                    target.classList.remove('show', 'in');
                    this.classList.add('collapsed');
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    target.classList.add('show');
                    this.classList.remove('collapsed');
                    this.setAttribute('aria-expanded', 'true');
                }
            }
        });
    });

    // Stock info handler
    const stockInfoElements = document.querySelectorAll('.product-stock-info');
    stockInfoElements.forEach(async (el) => {
        const productId = el.getAttribute('data-product-id');
        if (productId) {
            try {
                const res = await sdk.ecommerce.getStockInfo(productId);
                if (res.status === 'success' && res.data) {
                    const data = res.data;
                    if (data.inStock > 0 || data.quantityAvailable > 0 || data.inStock === true) {
                        // el.textContent = `In stock: ${data.quantityAvailable || data.inStock}`;
                        el.textContent = `In stock`;
                        el.classList.add('in-stock');

                        // Enable the add to cart button
                        const form = el.closest('.product-detail')?.querySelector('.product-add-to-cart') || el.closest('.product-card')?.querySelector('.product-add-to-cart');
                        if (form) {
                            const addToCartBtn = form.querySelector('button[type="submit"]');
                            if (addToCartBtn) {
                                addToCartBtn.disabled = false;
                                addToCartBtn.classList.remove('disabled');
                            }
                        }
                    } else if (data.allowBackorder) {
                        el.textContent = data.deliveryDate ? `Available on backorder (Delivery: ${data.deliveryDate})` : 'Available on backorder';
                        el.classList.add('backorder');

                        // Enable the add to cart button for backorder
                        const form = el.closest('.product-detail')?.querySelector('.product-add-to-cart') || el.closest('.product-card')?.querySelector('.product-add-to-cart');
                        if (form) {
                            const addToCartBtn = form.querySelector('button[type="submit"]');
                            if (addToCartBtn) {
                                addToCartBtn.disabled = false;
                                addToCartBtn.classList.remove('disabled');
                            }
                        }
                    } else {
                        el.textContent = 'Out of stock';
                        el.classList.add('out-of-stock');
                        // Ensure the add to cart button is disabled
                        const form = el.closest('.product-detail')?.querySelector('.product-add-to-cart') || el.closest('.product-card')?.querySelector('.product-add-to-cart');
                        if (form) {
                            const addToCartBtn = form.querySelector('button[type="submit"]');
                            if (addToCartBtn) {
                                addToCartBtn.disabled = true;
                                addToCartBtn.classList.add('disabled');
                            }
                        }
                    }
                } else if (res && res.stock_message) {
                    el.textContent = res.stock_message;
                } else if (res && typeof res.stock !== 'undefined') {
                    el.textContent = `Stock: ${res.stock}`;
                }
            } catch (error) {
                console.error('Error fetching stock info:', error);
            }
        }
    });

    // Drag-to-scroll for product image grid
    const imageGrid = document.querySelector('.product-image-grid');
    if (imageGrid) {
        let isDown = false;
        let startX;
        let scrollLeft;

        imageGrid.addEventListener('mousedown', (e) => {
            if (window.innerWidth > 768) return; // Only for mobile/slider view
            isDown = true;
            imageGrid.classList.add('dragging');
            startX = e.pageX - imageGrid.offsetLeft;
            scrollLeft = imageGrid.scrollLeft;
        });

        imageGrid.addEventListener('mouseleave', () => {
            if (!isDown) return;
            isDown = false;
            imageGrid.classList.remove('dragging');
        });

        imageGrid.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            imageGrid.classList.remove('dragging');
        });

        imageGrid.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - imageGrid.offsetLeft;
            const walk = (x - startX); // 1:1 Scroll speed
            imageGrid.scrollLeft = scrollLeft - walk;
            if (Math.abs(walk) > 5) {
                imageGrid.classList.add('dragging-moved');
            }
        });

        // Prevent native drag on images
        imageGrid.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        // Prevent dragging from triggering links or other default behaviors
        imageGrid.addEventListener('click', (e) => {
            if (imageGrid.classList.contains('dragging-moved')) {
                e.preventDefault();
                imageGrid.classList.remove('dragging-moved');
            }
        });
    }
});

console.log('SitePack Theme Skeleton Loaded');

/* ===== SPD-2051 product variant options (snippets/product-variant-options.twig) ===== */
(function () {
    function escapeAttr(value) {
        return (window.CSS && CSS.escape) ? CSS.escape(value) : value;
    }

    function init(root) {
        if (root.dataset.spInit) {
            return;
        }
        root.dataset.spInit = '1';

        var options = JSON.parse(root.getAttribute('data-options') || '[]');
        var variants = JSON.parse(root.getAttribute('data-variants') || '[]');
        var selected = {};

        var form = root.closest('form') || document.querySelector('form.product-add-to-cart');
        var availabilityEl = root.querySelector('[data-variant-availability]');
        var unavailableLabel = root.getAttribute('data-unavailable-label') || '';

        // Drive the main PDP price instead of showing a second price block, so the page
        // keeps one price. Themes mark their price node with [data-variant-price];
        // otherwise fall back to the standard price element.
        var priceTargets = document.querySelectorAll('[data-variant-price], .product-price-section .price');
        var originalPrices = [];
        priceTargets.forEach(function (el) { originalPrices.push(el.innerHTML); });

        function setPrice(text) {
            priceTargets.forEach(function (el) { el.textContent = text; });
        }
        function restorePrice() {
            priceTargets.forEach(function (el, i) { el.innerHTML = originalPrices[i]; });
        }

        function hiddenField() {
            if (!form) {
                return null;
            }
            var field = form.querySelector('input[name="variantUuid"], input[name$="[variantUuid]"]');
            if (!field) {
                field = document.createElement('input');
                field.type = 'hidden';
                field.name = 'variantUuid';
                form.appendChild(field);
            }
            return field;
        }

        function submitButton() {
            return form ? form.querySelector('button[type="submit"], input[type="submit"]') : null;
        }

        function findVariant() {
            var names = options.map(function (option) { return option.name; });
            if (names.some(function (name) { return !selected[name]; })) {
                return null;
            }
            return variants.find(function (variant) {
                return names.every(function (name) {
                    return variant.optionValues && variant.optionValues[name] === selected[name];
                });
            }) || null;
        }

        function applyVariant(variant) {
            var field = hiddenField();
            var submit = submitButton();

            if (!variant) {
                if (field) { field.value = ''; }
                restorePrice();
                if (availabilityEl) {
                    availabilityEl.textContent = '';
                    availabilityEl.hidden = true;
                }
                if (submit) { submit.disabled = true; }
                return;
            }

            if (field) { field.value = variant.uuid; }

            if (variant.image && variant.image.url && typeof window.viewProductImage === 'function') {
                window.viewProductImage(variant.image.url);
            }

            if (variant.pricePretty) {
                setPrice('€ ' + variant.pricePretty);
            } else {
                restorePrice();
            }

            if (availabilityEl) {
                availabilityEl.textContent = variant.available ? '' : unavailableLabel;
                availabilityEl.hidden = variant.available;
            }

            if (submit) { submit.disabled = !variant.available; }
        }

        function refreshDisabledStates() {
            root.querySelectorAll('.sp-variant-value').forEach(function (button) {
                var trial = Object.assign({}, selected);
                trial[button.getAttribute('data-option')] = button.getAttribute('data-value');

                var possible = variants.some(function (variant) {
                    return Object.keys(trial).every(function (name) {
                        return variant.optionValues && variant.optionValues[name] === trial[name];
                    });
                });
                button.classList.toggle('is-unavailable', !possible);
            });
        }

        function select(optionName, value) {
            selected[optionName] = value;

            root.querySelectorAll('.sp-variant-value[data-option="' + escapeAttr(optionName) + '"]').forEach(function (button) {
                button.classList.toggle('is-active', button.getAttribute('data-value') === value);
            });

            var label = root.querySelector('[data-option-selected="' + escapeAttr(optionName) + '"]');
            if (label) {
                label.textContent = value;
            }

            refreshDisabledStates();
            applyVariant(findVariant());
        }

        root.querySelectorAll('.sp-variant-value').forEach(function (button) {
            button.addEventListener('click', function () {
                select(button.getAttribute('data-option'), button.getAttribute('data-value'));
            });
        });

        // Land on the first available variant (or the first one) so the shopper starts
        // from a valid selection with its image and price already shown.
        var initial = variants.find(function (variant) { return variant.available; }) || variants[0];
        if (initial && initial.optionValues) {
            Object.keys(initial.optionValues).forEach(function (name) {
                select(name, initial.optionValues[name]);
            });
        } else {
            refreshDisabledStates();
        }
    }

    function boot() {
        document.querySelectorAll('.sp-variant-options').forEach(init);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
/* ===== end SPD-2051 product variant options ===== */
