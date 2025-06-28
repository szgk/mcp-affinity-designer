// API Documentation Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Setup API-specific functionality
    setupAPINavigation();
    setupAPISearch();
    setupActiveSection();
    setupParameterHighlighting();
    
});

// API Navigation
function setupAPINavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.api-method');
    
    // Smooth scrolling for navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 120;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                updateActiveNavItem(this);
            }
        });
    });
}

// Update active navigation item
function updateActiveNavItem(activeItem) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}

// API Search functionality
function setupAPISearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const apiMethods = document.querySelectorAll('.api-method');
    
    if (!searchInput || !searchResults) return;
    
    // API data for search
    const apiData = Array.from(apiMethods).map(method => {
        const methodName = method.querySelector('.method-name').textContent;
        const methodDescription = method.querySelector('.method-description').textContent;
        const methodId = method.id;
        const section = method.closest('.api-section').querySelector('.section-title').textContent;
        
        return {
            name: methodName,
            description: methodDescription,
            id: methodId,
            section: section,
            element: method
        };
    });
    
    let debounceTimer;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performAPISearch(e.target.value, apiData, searchResults, apiMethods);
        }, 300);
    });
    
    // Clear search when escape is pressed
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            clearAPISearch(searchResults, apiMethods);
        }
    });
}

// Perform API search
function performAPISearch(query, data, resultsContainer, allMethods) {
    if (!query.trim()) {
        clearAPISearch(resultsContainer, allMethods);
        return;
    }
    
    const results = data.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.section.toLowerCase().includes(query.toLowerCase())
    );
    
    // Show/hide API methods based on search
    allMethods.forEach(method => {
        const matchesSearch = results.some(result => result.id === method.id);
        method.style.display = matchesSearch ? 'block' : 'none';
        
        // Hide/show parent sections if no methods match
        const parentSection = method.closest('.api-section');
        const visibleMethods = parentSection.querySelectorAll('.api-method[style="display: block"], .api-method:not([style*="display: none"])');
        parentSection.style.display = visibleMethods.length > 0 ? 'block' : 'none';
    });
    
    // Display search results summary
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No API methods found for "' + query + '"</div>';
    } else {
        const resultsHTML = `
            <div class="search-summary">
                Found ${results.length} method${results.length === 1 ? '' : 's'} matching "${query}":
            </div>
            <div class="search-results-list">
                ${results.map(result => `
                    <div class="search-result">
                        <a href="#${result.id}" class="result-link">
                            <h4 class="result-title">${highlightSearchTerm(result.name, query)}</h4>
                            <p class="result-description">${highlightSearchTerm(result.description, query)}</p>
                            <span class="result-category">${result.section}</span>
                        </a>
                    </div>
                `).join('')}
            </div>
        `;
        resultsContainer.innerHTML = resultsHTML;
        
        // Add click handlers for search results
        resultsContainer.querySelectorAll('.result-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 120;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    resultsContainer.style.display = 'block';
}

// Clear API search
function clearAPISearch(resultsContainer, allMethods) {
    resultsContainer.style.display = 'none';
    resultsContainer.innerHTML = '';
    
    // Show all methods and sections
    allMethods.forEach(method => {
        method.style.display = 'block';
    });
    
    document.querySelectorAll('.api-section').forEach(section => {
        section.style.display = 'block';
    });
}

// Highlight search terms
function highlightSearchTerm(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Setup active section highlighting based on scroll
function setupActiveSection() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.api-method');
    
    function updateActiveSection() {
        const scrollPosition = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.id;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Update active navigation item
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + sectionId) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial call
    updateActiveSection();
}

// Setup parameter highlighting
function setupParameterHighlighting() {
    const params = document.querySelectorAll('.param');
    
    params.forEach(param => {
        param.addEventListener('mouseenter', function() {
            this.style.background = '#f0f7ff';
            this.style.borderColor = '#667eea';
            this.style.transform = 'translateX(5px)';
        });
        
        param.addEventListener('mouseleave', function() {
            this.style.background = 'white';
            this.style.borderColor = '#e2e8f0';
            this.style.transform = 'translateX(0)';
        });
    });
}

// Copy API method name to clipboard
function copyMethodName(methodName) {
    navigator.clipboard.writeText(methodName).then(() => {
        // Show temporary success message
        const toast = document.createElement('div');
        toast.textContent = 'Method name copied!';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    });
}

// Add copy buttons to method names
document.querySelectorAll('.method-name').forEach(methodName => {
    const copyButton = document.createElement('button');
    copyButton.innerHTML = '📋';
    copyButton.className = 'copy-method-button';
    copyButton.style.cssText = `
        margin-left: 1rem;
        padding: 0.25rem 0.5rem;
        background: rgba(102, 126, 234, 0.1);
        border: 1px solid rgba(102, 126, 234, 0.3);
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.3s ease;
    `;
    
    copyButton.addEventListener('click', () => {
        copyMethodName(methodName.textContent);
    });
    
    copyButton.addEventListener('mouseenter', () => {
        copyButton.style.background = 'rgba(102, 126, 234, 0.2)';
    });
    
    copyButton.addEventListener('mouseleave', () => {
        copyButton.style.background = 'rgba(102, 126, 234, 0.1)';
    });
    
    methodName.appendChild(copyButton);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        const allMethods = document.querySelectorAll('.api-method');
        
        if (searchInput && searchInput.value) {
            searchInput.value = '';
            clearAPISearch(searchResults, allMethods);
            searchInput.blur();
        }
    }
});

// Add keyboard shortcut hint
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput && !searchInput.getAttribute('data-hint-added')) {
        searchInput.placeholder = 'Search tools... (Ctrl+K)';
        searchInput.setAttribute('data-hint-added', 'true');
    }
});

// Analytics tracking for API documentation
function trackAPIEvent(eventName, methodName) {
    if (window.MCPDocs && window.MCPDocs.trackEvent) {
        window.MCPDocs.trackEvent(eventName, {
            method: methodName,
            page: 'api-documentation'
        });
    }
}

// Track method views
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        const methodName = this.textContent.trim();
        trackAPIEvent('api_method_viewed', methodName);
    });
});

// Track search usage
document.getElementById('search-input')?.addEventListener('input', function() {
    if (this.value.length > 2) {
        trackAPIEvent('api_search_used', this.value);
    }
});