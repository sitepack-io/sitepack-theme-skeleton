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

console.log('SitePack Theme Skeleton Loaded');
