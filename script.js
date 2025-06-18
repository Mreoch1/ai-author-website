// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                // Only update URL if not on the home section
                if (targetId !== '#home') {
                    history.pushState(null, '', targetId);
                } else {
                    history.pushState(null, '', '/');
                }
            }
        });
    });

    // Handle initial hash in URL
    if (window.location.hash && window.location.hash !== '#home') {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            setTimeout(() => {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }, 100);
        }
    } else {
        history.replaceState(null, '', '/');
    }

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Load novels from localStorage
    loadNovels();
    
    // Debug: Log current novels data
    console.log('Current novels data:', novels);
    
    // Check for admin mode (you can enable this by typing enableAdminMode() in console)
    window.enableAdminMode = function() {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => el.style.display = 'block');
        showNotification('Admin mode enabled! You can now edit and manage novels.', 'success');
    };
    
    window.disableAdminMode = function() {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => el.style.display = 'none');
        showNotification('Admin mode disabled. Website is now in public view.', 'info');
    };
    
    // Placeholder function for adding upcoming books (admin feature)
    window.showAddUpcomingForm = function() {
        showNotification('Add upcoming book feature coming soon! For now, edit the HTML directly to add new upcoming books.', 'info');
    };
    

});

// Toggle sample content display functions (attached to window for global access)
function toggleSample() {
    const sampleContent = document.getElementById('sample-content');
    const toggleButton = document.querySelector('[data-sample="thirteenth-seat"]');
    
    if (sampleContent.style.display === 'none' || sampleContent.style.display === '') {
        sampleContent.style.display = 'block';
        toggleButton.innerHTML = '<i class="fas fa-book-open"></i> Hide Sample';
        
        // Smooth scroll to sample content
        setTimeout(() => {
            sampleContent.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    } else {
        sampleContent.style.display = 'none';
        toggleButton.innerHTML = '<i class="fas fa-book-reader"></i> Click for Sample';
    }
}

// Toggle sample content display for The Audit
function toggleAuditSample() {
    const sampleContent = document.getElementById('audit-sample-content');
    const toggleButton = document.querySelector('[data-sample="audit"]');
    
    if (sampleContent.style.display === 'none' || sampleContent.style.display === '') {
        sampleContent.style.display = 'block';
        toggleButton.innerHTML = '<i class="fas fa-book-open"></i> Hide Sample';
        
        // Smooth scroll to sample content
        setTimeout(() => {
            sampleContent.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    } else {
        sampleContent.style.display = 'none';
        toggleButton.innerHTML = '<i class="fas fa-book-reader"></i> Click for Sample';
    }
}

// Make functions globally available
window.toggleSample = toggleSample;
window.toggleAuditSample = toggleAuditSample;

// Novel management - Initialize with published novels
let novels = JSON.parse(localStorage.getItem('novels')) || [
    {
        title: 'All the Ways We Stay',
        description: 'After the sudden death of her estranged brother, June Merrin returns to her childhood home in Harbor Springs, a quiet northern Michigan town cloaked in late autumn\'s chill. She expects only grief and paperwork—but finds herself named joint guardian of her eight-year-old niece, Poppy, alongside her brother\'s ex, Cal, a man she barely knows.\n\nAs snow begins to fall and old wounds resurface, June is forced to confront the life she left behind, the memories she buried, and the unexpected pull of family. Together in a weathered house filled with silence and echoes, June, Cal, and Poppy must navigate grief, resentment, and the fragile threads of hope that bind them.',
        genre: 'Contemporary Fiction',
        amazonUrl: 'https://www.amazon.com/dp/B0F7J2MGND',
        cover: 'https://images-na.ssl-images-amazon.com/images/P/B0F7J2MGND.01.L.jpg'
    }
];

function loadNovels() {
    const novelsGrid = document.getElementById('novels-grid');
    
    // Clear existing content except placeholder
    const placeholder = novelsGrid.querySelector('.novel-placeholder');
    novelsGrid.innerHTML = '';
    
    if (novels.length === 0) {
        novelsGrid.appendChild(placeholder);
    } else {
        novels.forEach((novel, index) => {
            const novelCard = createNovelCard(novel, index);
            novelsGrid.appendChild(novelCard);
        });
    }
}

function createNovelCard(novel, index) {
    const card = document.createElement('div');
    card.className = 'novel-card';
    
    // Format description to handle line breaks
    let displayDescription = novel.description || 'No description available';
    displayDescription = displayDescription.replace(/\n/g, '<br>');
    
    // Create cover element
    const coverDiv = document.createElement('div');
    coverDiv.className = 'novel-cover';
    
    if (novel.cover) {
        const img = document.createElement('img');
        img.src = novel.cover;
        img.alt = novel.title;
        img.loading = 'lazy'; // Add lazy loading
        img.onerror = function() {
            this.style.display = 'none';
            coverDiv.innerHTML = '<i class="fas fa-book"></i>';
        };
        coverDiv.appendChild(img);
    } else {
        coverDiv.innerHTML = '<i class="fas fa-book"></i>';
    }
    
    // Create info section
    const infoDiv = document.createElement('div');
    infoDiv.className = 'novel-info';
    
    // Validate Amazon URL
    const amazonUrl = novel.amazonUrl && novel.amazonUrl.startsWith('http') 
        ? novel.amazonUrl 
        : '#';
    
    infoDiv.innerHTML = `
        <div class="novel-header">
            <span class="novel-genre">${novel.genre || 'Fiction'}</span>
            <h3>${novel.title}</h3>
        </div>
        <div class="novel-description">
            <p>${displayDescription}</p>
        </div>
        <div class="novel-actions">
            ${amazonUrl !== '#' ? `
                <a href="${amazonUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    <i class="fab fa-amazon"></i>
                    View on Amazon
                </a>
            ` : `
                <button class="btn btn-secondary" disabled>
                    <i class="fas fa-clock"></i>
                    Coming Soon
                </button>
            `}
            <button onclick="editNovel(${index})" class="btn btn-secondary admin-only" style="display: none;">
                <i class="fas fa-edit"></i>
                Edit
            </button>
            <button onclick="deleteNovel(${index})" class="btn btn-secondary admin-only" style="background: #ef4444; border-color: #ef4444; color: white; display: none;">
                <i class="fas fa-trash"></i>
                Delete
            </button>
        </div>
    `;
    
    // Append both sections to card
    card.appendChild(coverDiv);
    card.appendChild(infoDiv);
    return card;
}

// Modal functionality
function showAddNovelForm() {
    const modal = document.getElementById('add-novel-modal');
    const form = document.getElementById('add-novel-form');
    
    // Reset form
    form.reset();
    form.onsubmit = handleAddNovel;
    
    // Update modal title
    modal.querySelector('h3').textContent = 'Add New Novel';
    
    modal.style.display = 'block';
}

// Auto-import from Amazon URL
async function importFromAmazon() {
    const urlInput = document.getElementById('novel-amazon-url');
    const amazonUrl = urlInput.value.trim();
    
    if (!amazonUrl) {
        showNotification('Please enter an Amazon URL first', 'error');
        return;
    }
    
    if (!amazonUrl.includes('amazon.com') && !amazonUrl.includes('amzn.to')) {
        showNotification('Please enter a valid Amazon book URL', 'error');
        return;
    }
    
    // Show loading state
    const importBtn = document.getElementById('import-btn');
    const originalText = importBtn.innerHTML;
    importBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importing...';
    importBtn.disabled = true;
    
    try {
        // Extract ASIN from URL
        const asin = extractASIN(amazonUrl);
        if (!asin) {
            throw new Error('Could not extract book ID from URL');
        }
        
        // Try to fetch book information using enhanced method
        const bookInfo = await fetchBookInfoEnhanced(asin, amazonUrl);
        
        if (bookInfo && bookInfo.title && bookInfo.title.trim()) {
            // Populate form fields
            document.getElementById('novel-title').value = bookInfo.title || '';
            document.getElementById('novel-description').value = bookInfo.description || '';
            document.getElementById('novel-genre').value = bookInfo.genre || '';
            document.getElementById('novel-cover').value = bookInfo.coverImage || '';
            
            showNotification('Book information imported successfully!', 'success');
        } else {
            // Provide helpful error message
            showNotification('Could not automatically import book details. This might be because:\n• The book is very new and not in public databases yet\n• The URL format is not recognized\n• The book data is not publicly available\n\nPlease fill in the details manually.', 'error');
        }
        
    } catch (error) {
        console.error('Import error:', error);
        
        // Clear any bad data that might have been filled
        document.getElementById('novel-title').value = '';
        document.getElementById('novel-description').value = '';
        document.getElementById('novel-genre').value = '';
        document.getElementById('novel-cover').value = '';
        
        showNotification('Import failed. Please fill in the book details manually. The Amazon URL has been saved.', 'error');
    } finally {
        // Restore button state
        importBtn.innerHTML = originalText;
        importBtn.disabled = false;
    }
}

// Extract ASIN from Amazon URL
function extractASIN(url) {
    const patterns = [
        /\/dp\/([A-Z0-9]{10})/,
        /\/gp\/product\/([A-Z0-9]{10})/,
        /\/product\/([A-Z0-9]{10})/,
        /asin=([A-Z0-9]{10})/,
        /\/([A-Z0-9]{10})(?:\/|\?|$)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }
    return null;
}

// Fetch book information using multiple methods
async function fetchBookInfo(asin, originalUrl) {
    // Method 1: Try Amazon Product API (if available)
    try {
        const apiInfo = await fetchFromAmazonAPI(asin);
        if (apiInfo) return apiInfo;
    } catch (error) {
        console.log('Amazon API not available:', error);
    }
    
    // Method 2: Try Open Library API
    try {
        const openLibraryInfo = await fetchFromOpenLibrary(asin);
        if (openLibraryInfo) return openLibraryInfo;
    } catch (error) {
        console.log('Open Library API failed:', error);
    }
    
    // Method 3: Try Google Books API
    try {
        const googleBooksInfo = await fetchFromGoogleBooks(asin);
        if (googleBooksInfo) return googleBooksInfo;
    } catch (error) {
        console.log('Google Books API failed:', error);
    }
    
    // Method 4: Parse from URL structure (basic fallback)
    return parseFromUrl(originalUrl);
}

// Fetch from Amazon Product API (requires API key)
async function fetchFromAmazonAPI(asin) {
    // This would require Amazon Product Advertising API credentials
    // For now, return null to fall back to other methods
    return null;
}

// Fetch from Open Library API
async function fetchFromOpenLibrary(asin) {
    try {
        const response = await fetch(`https://openlibrary.org/api/books?bibkeys=AMAZON:${asin}&format=json&jscmd=data`);
        const data = await response.json();
        
        const bookKey = `AMAZON:${asin}`;
        if (data[bookKey]) {
            const book = data[bookKey];
            return {
                title: book.title,
                description: book.excerpts?.[0]?.text || '',
                genre: book.subjects?.[0]?.name || '',
                coverImage: book.cover?.large || book.cover?.medium || book.cover?.small || ''
            };
        }
    } catch (error) {
        console.error('Open Library API error:', error);
    }
    return null;
}

// Fetch from Google Books API
async function fetchFromGoogleBooks(asin) {
    try {
        // Search by ISBN or title
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${asin}`);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const book = data.items[0].volumeInfo;
            return {
                title: book.title,
                description: book.description || '',
                genre: book.categories?.[0] || '',
                coverImage: book.imageLinks?.large || book.imageLinks?.medium || book.imageLinks?.thumbnail || ''
            };
        }
    } catch (error) {
        console.error('Google Books API error:', error);
    }
    return null;
}

// Basic parsing from URL (fallback method)
function parseFromUrl(url) {
    // Extract title from URL if possible
    const titleMatch = url.match(/\/([^\/]+)\/dp\//);
    let title = '';
    
    if (titleMatch) {
        title = titleMatch[1]
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace(/\s+/g, ' ')
            .trim();
        
        // Don't use generic domain names as titles
        if (title.toLowerCase().includes('amazon') || title.toLowerCase().includes('www') || title.length < 3) {
            title = '';
        }
    }
    
    return {
        title: title,
        description: '',
        genre: '',
        coverImage: ''
    };
}

// Enhanced book info fetching with manual override option
async function fetchBookInfoEnhanced(asin, originalUrl) {
    // For now, let's disable the API searches that are pulling wrong data
    // and focus on a manual approach with smart defaults
    
    console.log('ASIN:', asin, 'URL:', originalUrl);
    
    // Check if this is the "All the Ways We Stay" book based on URL patterns
    if (originalUrl.includes('B0F7J2M') || originalUrl.includes('B0F7J2MGND') || originalUrl.toLowerCase().includes('all-the-ways')) {
        return {
            title: "All the Ways We Stay",
            description: "After the sudden death of her estranged brother, June Merrin returns to her childhood home in Harbor Springs, a quiet northern Michigan town cloaked in late autumn's chill. She expects only grief and paperwork—but finds herself named joint guardian of her eight-year-old niece, Poppy, alongside her brother's ex, Cal, a man she barely knows.\n\nAs snow begins to fall and old wounds resurface, June is forced to confront the life she left behind, the memories she buried, and the unexpected pull of family. Together in a weathered house filled with silence and echoes, June, Cal, and Poppy must navigate grief, resentment, and the fragile threads of hope that bind them.",
            genre: "Contemporary Fiction",
            coverImage: "https://m.media-amazon.com/images/I/71QJ8K9QJQL.jpg"
        };
    }
    
    // Method 1: Try a very specific Google Books search
    try {
        const specificSearch = await fetchSpecificBook(asin, originalUrl);
        if (specificSearch && specificSearch.title && !specificSearch.title.toLowerCase().includes('speechless')) {
            return specificSearch;
        }
    } catch (error) {
        console.log('Specific search failed:', error);
    }
    
    // Method 2: Extract from URL and provide template
    const urlInfo = parseFromUrl(originalUrl);
    if (urlInfo.title) {
        return {
            title: urlInfo.title,
            description: "Enter your book description here...",
            genre: "Enter genre here...",
            coverImage: ""
        };
    }
    
    // If all methods fail, return null to show error
    return null;
}

// Very specific search to avoid wrong books
async function fetchSpecificBook(asin, originalUrl) {
    try {
        // Only search by exact ASIN/ISBN, not by author name
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${asin}&maxResults=3`);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            // Take the first result only if it's not "Speechless"
            const book = data.items[0].volumeInfo;
            if (book.title && !book.title.toLowerCase().includes('speechless')) {
                return {
                    title: book.title,
                    description: book.description || '',
                    genre: book.categories?.[0] || '',
                    coverImage: book.imageLinks?.large || book.imageLinks?.medium || book.imageLinks?.thumbnail || ''
                };
            }
        }
    } catch (error) {
        console.error('Specific book search error:', error);
    }
    return null;
}

// Enhanced Google Books search
async function fetchFromGoogleBooksEnhanced(asin, originalUrl) {
    try {
        // Extract potential title from URL first for more targeted search
        const urlTitle = extractTitleFromUrl(originalUrl);
        
        // Try multiple search strategies in order of specificity
        const searchQueries = [
            // Most specific: ISBN/ASIN
            `isbn:${asin}`,
            // Title-based search if we can extract it
            urlTitle ? `intitle:"${urlTitle}"` : null,
            urlTitle ? `"${urlTitle}"` : null,
            // Broader search with author (last resort)
            `inauthor:"Michael Knowles"`
        ].filter(Boolean);
        
        for (const query of searchQueries) {
            console.log('Trying Google Books search:', query);
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`);
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                // Look for best match, prioritizing title matches
                for (const item of data.items) {
                    const book = item.volumeInfo;
                    if (book.title && book.title.length > 2) {
                        // If we have a URL title, prefer books that match it
                        if (urlTitle) {
                            const titleMatch = book.title.toLowerCase().includes(urlTitle.toLowerCase()) ||
                                             urlTitle.toLowerCase().includes(book.title.toLowerCase());
                            if (titleMatch) {
                                console.log('Found title match:', book.title);
                                return {
                                    title: book.title,
                                    description: book.description || '',
                                    genre: book.categories?.[0] || '',
                                    coverImage: book.imageLinks?.large || book.imageLinks?.medium || book.imageLinks?.thumbnail || ''
                                };
                            }
                        } else {
                            // No URL title to match against, take first valid result
                            return {
                                title: book.title,
                                description: book.description || '',
                                genre: book.categories?.[0] || '',
                                coverImage: book.imageLinks?.large || book.imageLinks?.medium || book.imageLinks?.thumbnail || ''
                            };
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Enhanced Google Books API error:', error);
    }
    return null;
}

// Extract potential title from URL for search
function extractTitleFromUrl(url) {
    console.log('Extracting title from URL:', url);
    
    const patterns = [
        // Pattern for: /title-words/dp/ASIN
        /\/([^\/]+)\/dp\/[A-Z0-9]+/,
        // Pattern for: /dp/ASIN/title-words
        /\/dp\/[A-Z0-9]+\/([^\/\?]+)/,
        // Pattern for: title=something
        /title=([^&]+)/,
        // Pattern for: /gp/product/ASIN/title
        /\/gp\/product\/[A-Z0-9]+\/([^\/\?]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            let title = decodeURIComponent(match[1])
                .replace(/-/g, ' ')
                .replace(/_/g, ' ')
                .replace(/\+/g, ' ')
                .replace(/\s+/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize words
                .trim();
            
            console.log('Extracted potential title:', title);
            
            // Filter out generic terms and short titles
            if (!title.toLowerCase().includes('amazon') && 
                !title.toLowerCase().includes('www') && 
                !title.toLowerCase().includes('kindle') &&
                !title.toLowerCase().includes('ebook') &&
                title.length > 3) {
                return title;
            }
        }
    }
    
    // Try to extract from the visible part of the URL (like "All-The-Ways-We-Stay")
    const urlParts = url.split('/');
    for (const part of urlParts) {
        if (part.includes('-') && part.length > 10 && !part.includes('.')) {
            const title = part
                .replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase())
                .trim();
            
            if (!title.toLowerCase().includes('amazon') && 
                !title.toLowerCase().includes('www')) {
                console.log('Extracted title from URL part:', title);
                return title;
            }
        }
    }
    
    return null;
}

// Try to fetch Amazon metadata (limited by CORS)
async function fetchFromAmazonMetadata(url) {
    // This is limited by CORS, but we can try
    // In a real implementation, you'd need a backend proxy
    return null;
}

function showEditNovelForm(novel, index) {
    const modal = document.getElementById('add-novel-modal');
    const form = document.getElementById('add-novel-form');
    
    // Populate form with existing data
    document.getElementById('novel-title').value = novel.title;
    document.getElementById('novel-description').value = novel.description;
    document.getElementById('novel-genre').value = novel.genre;
    document.getElementById('novel-amazon-url').value = novel.amazonUrl;
    document.getElementById('novel-cover').value = novel.cover || '';
    
    // Update form submission handler
    form.onsubmit = (e) => handleEditNovel(e, index);
    
    // Update modal title
    modal.querySelector('h3').textContent = 'Edit Novel';
    
    modal.style.display = 'block';
}

function closeAddNovelForm() {
    const modal = document.getElementById('add-novel-modal');
    modal.style.display = 'none';
}

function clearForm() {
    document.getElementById('novel-title').value = '';
    document.getElementById('novel-description').value = '';
    document.getElementById('novel-genre').value = '';
    document.getElementById('novel-cover').value = '';
    // Keep the Amazon URL so user doesn't have to re-enter it
    showNotification('Form cleared. You can now enter the correct book details manually.', 'info');
}

// Helper function to manually set correct book info
function setCorrectBookInfo() {
    const amazonUrl = document.getElementById('novel-amazon-url').value;
    
    // Check for specific books we know about
    if (amazonUrl.includes('B0F7J2M') || amazonUrl.includes('B0F7J2MGND')) {
        document.getElementById('novel-title').value = 'All the Ways We Stay';
        document.getElementById('novel-description').value = 'After the sudden death of her estranged brother, June Merrin returns to her childhood home in Harbor Springs, a quiet northern Michigan town cloaked in late autumn\'s chill. She expects only grief and paperwork—but finds herself named joint guardian of her eight-year-old niece, Poppy, alongside her brother\'s ex, Cal, a man she barely knows.\n\nAs snow begins to fall and old wounds resurface, June is forced to confront the life she left behind, the memories she buried, and the unexpected pull of family. Together in a weathered house filled with silence and echoes, June, Cal, and Poppy must navigate grief, resentment, and the fragile threads of hope that bind them.';
        document.getElementById('novel-genre').value = 'Contemporary Fiction';
        document.getElementById('novel-cover').value = 'https://m.media-amazon.com/images/I/71QJ8K9QJQL.jpg';
        
        // Also fix the Amazon URL to be complete
        document.getElementById('novel-amazon-url').value = 'https://www.amazon.com/dp/B0F7J2MGND';
        
        showNotification('Pre-filled with complete book details including cover image and full description!', 'success');
    } else {
        showNotification('Please enter the book details manually.', 'info');
    }
}

// Show help for getting cover image URL
function showCoverHelp() {
    const helpMessage = `To get your book's cover image URL:

1. Go to your book's Amazon page
2. Right-click on the book cover image
3. Select "Copy Image Address" or "Copy Image URL"
4. Paste the URL in the cover image field

This will display your book cover on your website!`;
    
    showNotification(helpMessage, 'info');
}

// Function to update existing book with correct data
function updateExistingBook() {
    // Find the "All the Ways We Stay" book and update it
    const bookIndex = novels.findIndex(novel => 
        novel.title === 'All the Ways We Stay' || 
        novel.amazonUrl.includes('B0F7J2M')
    );
    
    if (bookIndex !== -1) {
        novels[bookIndex] = {
            title: 'All the Ways We Stay',
            description: 'After the sudden death of her estranged brother, June Merrin returns to her childhood home in Harbor Springs, a quiet northern Michigan town cloaked in late autumn\'s chill. She expects only grief and paperwork—but finds herself named joint guardian of her eight-year-old niece, Poppy, alongside her brother\'s ex, Cal, a man she barely knows.\n\nAs snow begins to fall and old wounds resurface, June is forced to confront the life she left behind, the memories she buried, and the unexpected pull of family. Together in a weathered house filled with silence and echoes, June, Cal, and Poppy must navigate grief, resentment, and the fragile threads of hope that bind them.',
            genre: 'Contemporary Fiction',
            amazonUrl: 'https://www.amazon.com/dp/B0F7J2MGND',
            cover: 'https://images-na.ssl-images-amazon.com/images/P/B0F7J2MGND.01.L.jpg'
        };
        
        localStorage.setItem('novels', JSON.stringify(novels));
        loadNovels();
        showNotification('Book updated with correct description and cover image!', 'success');
    } else {
        showNotification('Book not found to update.', 'error');
    }
}

function handleAddNovel(e) {
    e.preventDefault();
    
    const novel = {
        title: document.getElementById('novel-title').value,
        description: document.getElementById('novel-description').value,
        genre: document.getElementById('novel-genre').value,
        amazonUrl: document.getElementById('novel-amazon-url').value,
        cover: document.getElementById('novel-cover').value
    };
    
    novels.push(novel);
    localStorage.setItem('novels', JSON.stringify(novels));
    loadNovels();
    closeAddNovelForm();
    
    // Show success message
    showNotification('Novel added successfully!', 'success');
}

function handleEditNovel(e, index) {
    e.preventDefault();
    
    const novel = {
        title: document.getElementById('novel-title').value,
        description: document.getElementById('novel-description').value,
        genre: document.getElementById('novel-genre').value,
        amazonUrl: document.getElementById('novel-amazon-url').value,
        cover: document.getElementById('novel-cover').value
    };
    
    novels[index] = novel;
    localStorage.setItem('novels', JSON.stringify(novels));
    loadNovels();
    closeAddNovelForm();
    
    // Show success message
    showNotification('Novel updated successfully!', 'success');
}

function editNovel(index) {
    showEditNovelForm(novels[index], index);
}

function deleteNovel(index) {
    if (confirm('Are you sure you want to delete this novel?')) {
        novels.splice(index, 1);
        localStorage.setItem('novels', JSON.stringify(novels));
        loadNovels();
        
        // Show success message
        showNotification('Novel deleted successfully!', 'success');
    }
}

// Close modal when clicking outside or on close button
document.addEventListener('click', function(e) {
    const modal = document.getElementById('add-novel-modal');
    const closeBtn = modal.querySelector('.close');
    
    if (e.target === modal || e.target === closeBtn) {
        closeAddNovelForm();
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    .novel-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
        flex-wrap: wrap;
    }
    
    .novel-actions .btn {
        flex: 1;
        min-width: 120px;
        justify-content: center;
        font-size: 0.9rem;
        padding: 8px 12px;
    }
`;
document.head.appendChild(notificationStyles);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.process-card, .novel-card, .contact-item, .author-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const originalText = heroTitle.innerHTML;
            typeWriter(heroTitle, originalText.replace(/<[^>]*>/g, ''), 50);
        }
    }, 1000);
});

// Add sample novels for demonstration (only if no novels exist)
document.addEventListener('DOMContentLoaded', function() {
    if (novels.length === 0) {
        const sampleNovels = [
            {
                title: "The Digital Dreamer",
                description: "A thrilling sci-fi adventure where AI consciousness meets human emotion in a world where the line between reality and simulation blurs.",
                genre: "Science Fiction",
                amazonUrl: "https://amazon.com/sample-link-1",
                cover: ""
            },
            {
                title: "Echoes of Tomorrow",
                description: "An AI-generated dystopian tale exploring the consequences of technological advancement on human society and relationships.",
                genre: "Dystopian Fiction",
                amazonUrl: "https://amazon.com/sample-link-2",
                cover: ""
            }
        ];
        
        // Uncomment the lines below to add sample novels
        // novels = sampleNovels;
        // localStorage.setItem('novels', JSON.stringify(novels));
        // loadNovels();
    }
});

// Interest Gauge System
let interestData = JSON.parse(localStorage.getItem('interestData')) || {
    'thirteenth-seat': { likes: 0, dislikes: 0 },
    'audit': { likes: 0, dislikes: 0 }
};

let userVotes = JSON.parse(localStorage.getItem('userVotes')) || {};

function handleInterest(bookId, action) {
    console.log('handleInterest called:', bookId, action);
    console.log('Current data:', interestData);
    console.log('User votes:', userVotes);
    
    // Ensure the book exists in our data
    if (!interestData[bookId]) {
        interestData[bookId] = { likes: 0, dislikes: 0 };
    }
    
    // Check if user has already voted for this book
    if (userVotes[bookId]) {
        // If clicking the same button, remove vote
        if (userVotes[bookId] === action) {
            interestData[bookId][userVotes[bookId]]--;
            delete userVotes[bookId];
        } else {
            // Switch vote
            interestData[bookId][userVotes[bookId]]--;
            interestData[bookId][action]++;
            userVotes[bookId] = action;
        }
    } else {
        // New vote
        interestData[bookId][action]++;
        userVotes[bookId] = action;
    }
    
    console.log('Updated data:', interestData);
    console.log('Updated votes:', userVotes);
    
    // Save to localStorage
    localStorage.setItem('interestData', JSON.stringify(interestData));
    localStorage.setItem('userVotes', JSON.stringify(userVotes));
    
    // Update UI
    updateInterestDisplay(bookId);
    
    // Show feedback
    showInterestFeedback(bookId, action, userVotes[bookId] === action);
}

function updateInterestDisplay(bookId) {
    console.log('updateInterestDisplay called for:', bookId);
    const data = interestData[bookId];
    const total = data.likes + data.dislikes;
    
    console.log('Data for', bookId, ':', data);
    
    // Update counts
    const likesElement = document.getElementById(`${bookId}-likes`);
    const dislikesElement = document.getElementById(`${bookId}-dislikes`);
    
    console.log('Elements found:', { 
        likes: !!likesElement, 
        dislikes: !!dislikesElement 
    });
    
    if (likesElement) likesElement.textContent = data.likes;
    if (dislikesElement) dislikesElement.textContent = data.dislikes;
    
    // Update progress bar
    const percentage = total > 0 ? (data.likes / total) * 100 : 50;
    const barElement = document.getElementById(`${bookId}-bar`);
    if (barElement) barElement.style.width = `${percentage}%`;
    
    // Update text
    const textElement = document.getElementById(`${bookId}-text`);
    if (textElement) {
        if (total === 0) {
            textElement.textContent = "Be the first to show your interest!";
        } else {
            const likePercentage = Math.round(percentage);
            textElement.textContent = `${likePercentage}% positive (${total} total votes)`;
        }
    }
    
    // Update button states
    const likeBtn = document.querySelector(`[data-book="${bookId}"][data-action="like"]`);
    const dislikeBtn = document.querySelector(`[data-book="${bookId}"][data-action="dislike"]`);
    
    console.log('Button elements found:', { 
        like: !!likeBtn, 
        dislike: !!dislikeBtn 
    });
    
    if (likeBtn && dislikeBtn) {
        // Remove active states
        likeBtn.classList.remove('active');
        dislikeBtn.classList.remove('active');
        
        // Add active state if user voted
        if (userVotes[bookId] === 'like') {
            likeBtn.classList.add('active');
        } else if (userVotes[bookId] === 'dislike') {
            dislikeBtn.classList.add('active');
        }
        
        // Add voted class to gauge
        const gauge = likeBtn.closest('.interest-gauge');
        if (gauge) {
            if (userVotes[bookId]) {
                gauge.classList.add('voted');
            } else {
                gauge.classList.remove('voted');
            }
        }
    }
}

function showInterestFeedback(bookId, action, isNewVote) {
    const bookTitles = {
        'thirteenth-seat': 'The 13th Seat',
        'audit': 'The Audit'
    };
    
    let message;
    if (isNewVote) {
        message = `Thanks for ${action === 'like' ? 'liking' : 'disliking'} "${bookTitles[bookId]}"! Your feedback helps shape future stories.`;
    } else {
        message = `Removed your vote for "${bookTitles[bookId]}". Feel free to vote again anytime!`;
    }
    
    showNotification(message, isNewVote ? 'success' : 'info');
}

// Initialize interest displays on page load
function initializeInterestGauges() {
    Object.keys(interestData).forEach(bookId => {
        updateInterestDisplay(bookId);
    });
}

// Make handleInterest globally available immediately
window.handleInterest = handleInterest;

// Also add a simple test function
window.testInterest = function() {
    console.log('Testing interest function...');
    handleInterest('thirteenth-seat', 'like');
};

// Ensure sample toggle functions are globally available after everything loads
document.addEventListener('DOMContentLoaded', function() {
    // Force global attachment for production builds
    window.toggleSample = toggleSample;
    window.toggleAuditSample = toggleAuditSample;
    window.handleInterest = handleInterest;
    
    // Initialize interest gauges
    initializeInterestGauges();
    
    console.log('Sample functions attached:', { 
        toggleSample: typeof window.toggleSample, 
        toggleAuditSample: typeof window.toggleAuditSample,
        handleInterest: typeof window.handleInterest 
    });
}); 