function showTab(tabId) {
    // Get all tabs and buttons
    const tabs = document.querySelectorAll('.tab');
    const buttons = document.querySelectorAll('.tab-button');

    // Hide all tabs and remove active class from buttons
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab and set its button as active
    document.getElementById(tabId).classList.add('active');
    const activeButton = Array.from(buttons).find(button => button.textContent.includes(tabId.charAt(3).toUpperCase()));
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Show the first tab by default on load
document.addEventListener('DOMContentLoaded', () => {
    showTab('tab1');
});