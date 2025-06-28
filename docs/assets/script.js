// MCP Affinity Designer Documentation Site
// Interactive features and utilities

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Code block copy functionality
    addCopyButtons();
    
    // Intersection Observer for animations
    setupScrollAnimations();
    
    // Search functionality (if search input exists)
    setupSearch();
    
    // Theme toggle (future enhancement)
    setupThemeToggle();
});

// Add copy buttons to code blocks
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '📋 Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        
        // Position the button
        block.style.position = 'relative';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '1rem';
        copyButton.style.right = '1rem';
        copyButton.style.padding = '0.5rem 1rem';
        copyButton.style.background = 'rgba(255,255,255,0.1)';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '0.25rem';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontSize = '0.8rem';
        copyButton.style.transition = 'all 0.3s ease';
        
        copyButton.addEventListener('click', async () => {
            try {
                const codeContent = block.textContent.trim();
                await navigator.clipboard.writeText(codeContent);
                
                copyButton.innerHTML = '✅ Copied!';
                copyButton.style.background = 'rgba(0,255,0,0.2)';
                
                setTimeout(() => {
                    copyButton.innerHTML = '📋 Copy';
                    copyButton.style.background = 'rgba(255,255,255,0.1)';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                copyButton.innerHTML = '❌ Error';
                setTimeout(() => {
                    copyButton.innerHTML = '📋 Copy';
                }, 2000);
            }
        });
        
        copyButton.addEventListener('mouseenter', () => {
            copyButton.style.background = 'rgba(255,255,255,0.2)';
        });
        
        copyButton.addEventListener('mouseleave', () => {
            copyButton.style.background = 'rgba(255,255,255,0.1)';
        });
        
        block.appendChild(copyButton);
    });
}

// Setup scroll-triggered animations
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .tool-category, .step');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Search functionality for API documentation
function setupSearch() {
    const searchInput = document.querySelector('#search-input');
    if (!searchInput) return;
    
    let searchData = [];
    
    // Load search data (would be populated with API endpoints and descriptions)
    loadSearchData().then(data => {
        searchData = data;
    });
    
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch(e.target.value, searchData);
        }, 300);
    });
}

// Load search data for API documentation
async function loadSearchData() {
    // This would typically load from a JSON file or API
    // For now, return static data based on our tools
    return [
        {
            title: 'affinity_get_status',
            description: 'Check Affinity Designer application status',
            url: 'api/#affinity_get_status',
            category: 'Application Management'
        },
        {
            title: 'affinity_new_document',
            description: 'Create new document with specified dimensions',
            url: 'api/#affinity_new_document',
            category: 'Document Operations'
        },
        {
            title: 'affinity_create_layer',
            description: 'Create new layer in current document',
            url: 'api/#affinity_create_layer',
            category: 'Layer Management'
        }
        // Add more tools as needed
    ];
}

// Perform search and display results
function performSearch(query, data) {
    const resultsContainer = document.querySelector('#search-results');
    if (!resultsContainer) return;
    
    if (!query.trim()) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    const results = data.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="search-result">
            <a href="${result.url}" class="result-link">
                <h4 class="result-title">${highlightText(result.title, query)}</h4>
                <p class="result-description">${highlightText(result.description, query)}</p>
                <span class="result-category">${result.category}</span>
            </a>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = resultsHTML;
}

// Highlight search terms in text
function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Theme toggle functionality
function setupThemeToggle() {
    const themeToggle = document.querySelector('#theme-toggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle button text/icon
        themeToggle.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
    });
}

// Utility functions

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll-to-top button
function addScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    `;
    
    button.addEventListener('click', scrollToTop);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    document.body.appendChild(button);
}

// Initialize scroll-to-top button
addScrollToTopButton();

// Analytics (if needed)
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, properties);
}

// Export functions for use in other scripts
window.MCPDocs = {
    trackEvent,
    scrollToTop,
    setupSearch,
    performSearch
};