// Initialize interactive features
document.addEventListener('DOMContentLoaded', () => {
    initializeHoverPopovers();
    initializeTooltips();
    initializeGraphInteractions();
    initializeTreeItems();
    initializeSVGInteractivity();
});

// Hover popover functionality
function initializeHoverPopovers() {
    const popovers = document.querySelectorAll('.hover-popover');
    popovers.forEach(popover => {
        // Set display based on hover
        popover.style.setProperty('--popover-display', 'none');
        
        // Show on hover
        popover.addEventListener('mouseenter', () => {
            popover.style.setProperty('--popover-display', 'flex');
        });
        
        // Hide on leave
        popover.addEventListener('mouseleave', () => {
            popover.style.setProperty('--popover-display', 'none');
        });
    });
}

// Tooltip functionality 
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[aria-label]');
    tooltips.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-arrow"></div>
            <div class="tooltip-content">${element.getAttribute('aria-label')}</div>
        `;
        
        element.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
            positionTooltip(tooltip, element);
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.remove();
        });
    });
}

// Graph interactions
function initializeGraphInteractions() {
    const graphContainer = document.querySelector('.graph-view-container');
    if (!graphContainer) return;

    // Add expand/collapse functionality
    const expandButton = document.createElement('button');
    expandButton.className = 'graph-expand graph-icon';
    expandButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-arrow-up-right"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>';
    
    expandButton.addEventListener('click', () => {
        graphContainer.classList.toggle('mod-expanded');
    });
    
    graphContainer.appendChild(expandButton);
}

// Tree item interactions
function initializeTreeItems() {
    const treeItems = document.querySelectorAll('.tree-item');
    treeItems.forEach(item => {
        const collapseIcon = item.querySelector('.collapse-icon');
        if (collapseIcon) {
            collapseIcon.addEventListener('click', () => {
                item.classList.toggle('is-collapsed');
            });
        }
        
        const clickableItems = item.querySelectorAll('.tree-item-self.is-clickable');
        clickableItems.forEach(clickable => {
            clickable.addEventListener('click', (e) => {
                if (!e.target.closest('.collapse-icon')) {
                    // Handle navigation or other click actions
                    const link = clickable.getAttribute('data-href');
                    if (link) window.location.href = link;
                }
            });
        });
    });
}

// Helper function to position tooltips
function positionTooltip(tooltip, element) {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Position above by default
    let top = rect.top - tooltipRect.height - 5;
    let left = rect.left + (rect.width - tooltipRect.width) / 2;
    
    // Add position classes
    tooltip.classList.remove('mod-top', 'mod-bottom', 'mod-left', 'mod-right');
    
    // Adjust if too close to viewport edges
    if (top < 0) {
        top = rect.bottom + 5;
        tooltip.classList.add('mod-bottom');
    } else {
        tooltip.classList.add('mod-top');
    }
    
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}

// Initialize SVG interactivity
function initializeSVGInteractivity() {
    // Wait for the page to be fully loaded
    window.addEventListener('load', function() {
        // Find all SVG images in the article
        const images = document.querySelectorAll('img[src$=".svg"], .internal-embed.image-embed img');
        
        images.forEach(img => {
            // Skip if already processed
            if (img.closest('.svg-interactive-container')) return;
            
            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'svg-interactive-container';
            wrapper.style.cursor = 'pointer';
            
            // Replace image with wrapper containing image
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
            
            // Add hover effects
            wrapper.addEventListener('mouseenter', () => {
                img.style.transition = 'all 0.2s ease-in-out';
                img.style.transform = 'scale(1.02)';
                img.style.filter = 'brightness(1.1) drop-shadow(0 0 2px rgba(0,0,0,0.2))';
            });
            
            wrapper.addEventListener('mouseleave', () => {
                img.style.transition = 'all 0.2s ease-in-out';
                img.style.transform = '';
                img.style.filter = '';
            });
            
            // Add click effects
            wrapper.addEventListener('click', (e) => {
                createRippleEffect(e, wrapper);
            });
        });
    });
}

// Create ripple effect on click
function createRippleEffect(event, container) {
    const ripple = document.createElement('div');
    ripple.className = 'svg-ripple';
    
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    container.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => ripple.remove(), 600);
}

// Add required CSS
const style = document.createElement('style');
style.textContent = `
    .svg-interactive-container {
        position: relative;
        display: inline-block;
        overflow: hidden;
        max-width: 100%;
    }
    
    .svg-interactive-container img {
        display: block;
        max-width: 100%;
        height: auto;
        transition: all 0.2s ease-in-out;
    }
    
    .svg-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        width: 100px;
        height: 100px;
        margin-left: -50px;
        margin-top: -50px;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .tooltip {
        position: fixed;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
    }
    
    .tooltip-arrow {
        position: absolute;
        width: 0;
        height: 0;
        border-style: solid;
    }
    
    .tooltip.mod-top .tooltip-arrow {
        bottom: -5px;
        left: 50%;
        margin-left: -5px;
        border-width: 5px 5px 0;
        border-color: rgba(0, 0, 0, 0.8) transparent transparent;
    }
    
    .tooltip.mod-bottom .tooltip-arrow {
        top: -5px;
        left: 50%;
        margin-left: -5px;
        border-width: 0 5px 5px;
        border-color: transparent transparent rgba(0, 0, 0, 0.8);
    }
`;
document.head.appendChild(style);
