// --- Search Functionality ---
document.addEventListener('DOMContentLoaded', () => {
    // Search bar logic
    const searchBar = document.getElementById('search-bar');
    const searchResults = document.getElementById('search-results');
    if (searchBar && searchResults) {
        // Support both <form> and <input> for search bar
        let input = searchBar.tagName === 'FORM'
            ? searchBar.querySelector('input[type="text"]')
            : searchBar;
        // Listen for input event
        input.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            // Only select visible sections (not search-results)
            const allSections = Array.from(document.querySelectorAll('.main-content > div[id]:not(#search-results)'));
            // Filter out any divs whose id is empty or not present
            // (This is defensive, but not strictly needed if HTML is correct)
            // allSections = allSections.filter(sec => sec.id);
            if (!query) {
                searchResults.style.display = 'none';
                allSections.forEach(sec => sec.style.display = '');
                return;
            }
            // Gather all weapon cards from all sections
            let cards = [];
            allSections.forEach(section => {
                section.querySelectorAll('.weapon-card').forEach(card => {
                    const name = card.querySelector('h3')?.textContent?.toLowerCase() || '';
                    if (name.includes(query)) {
                        // Clone the card for display in search results
                        const clone = card.cloneNode(true);
                        cards.push(clone);
                    }
                });
            });
            // Hide all sections except search results
            allSections.forEach(sec => sec.style.display = 'none');
            searchResults.innerHTML = '';
            if (cards.length === 0) {
                searchResults.innerHTML = '<div style="color:#ffb347;font-size:1.2em;">No results found.</div>';
            } else {
                const scrollDiv = document.createElement('div');
                scrollDiv.className = 'weapon-scroll';
                cards.forEach(card => scrollDiv.appendChild(card));
                searchResults.appendChild(scrollDiv);
            }
            searchResults.style.display = '';
            // Re-attach event listeners to Add to Cart buttons in search results
            searchResults.querySelectorAll('button[data-name][data-price]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const name = btn.getAttribute('data-name');
                    const price = parseInt(btn.getAttribute('data-price'), 10);
                    addToCart({name, price});
                });
            });
        });
        // Prevent form submit from reloading page
        if (searchBar.tagName === 'FORM') {
            searchBar.addEventListener('submit', function(e) {
                e.preventDefault();
            });
        }
    }
});

// No changes needed if cat.js is loaded before search.js in HTML.
