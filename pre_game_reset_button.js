document.addEventListener('DOMContentLoaded', () => {
    // Create reset button (⟳) on top-right
    const resetButton = document.createElement('div');
    resetButton.textContent = '⟳';
    resetButton.style.position = 'absolute';
    resetButton.style.top = '10px';
    resetButton.style.right = '10px';
    resetButton.style.cursor = 'pointer';
    resetButton.style.fontSize = '20px';
    resetButton.style.fontWeight = 'bold';
    resetButton.style.color = '#808080';
    resetButton.title = "Resets all options on all pages"; // Tooltip text
    document.body.appendChild(resetButton);

    // Function to reset all selected radio buttons and remove data from localStorage
    const resetSelection = () => {
        // Find all radio buttons
        const radios = document.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            // Deselect all radio buttons
            radio.checked = false;
            // Reset label colors (if custom color styling is used)
            const label = radio.nextElementSibling;
            if (label) {
                label.style.color = ''; // Reset label color
            }
        });

        // Clear all data from localStorage
        localStorage.clear();
    };

    // Event listener for reset button
    resetButton.addEventListener('click', resetSelection);
});