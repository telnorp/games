// Load game state from localStorage
const resetSaveElement = document.getElementById('resetSave');
let lastClickTime = 0;
const clickDelay = 1000;

resetSaveElement.addEventListener('click', () => {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime <= clickDelay) {
        resetSave();
    }
    lastClickTime = currentTime;

    if (resetSaveElement.style.color !== 'rgb(255, 0, 50)') {
        resetSaveElement.style.color = 'rgb(255, 0, 50)';
    }
});

function loadGame() {
    const savedClickCount = localStorage.getItem('clickCount');
    const savedClicksPerClick = localStorage.getItem('clicksPerClick');
    const savedAutoClickers = localStorage.getItem('autoClickers');
    const savedClickRate = localStorage.getItem('clickRate');
    const savedTotalClicks = localStorage.getItem('totalClicksGenerated');
    const savedUpgradesPurchased = localStorage.getItem('upgradesPurchased');
    const savedLevel = localStorage.getItem('pLevel');
    const savedXp = localStorage.getItem('pXp');
    const savedNextLevelXp = localStorage.getItem('nextLevelXp');

    if (savedClickCount !== null) {
        clickCount = parseInt(savedClickCount, 10);
    }

    if (savedClicksPerClick !== null) {
        clicksPerClick = parseInt(savedClicksPerClick, 10);
    }

    if (savedAutoClickers !== null) {
        autoClickers = parseInt(savedAutoClickers, 10);
    }

    if (savedClickRate !== null) {
        clickRate = parseInt(savedClickRate, 10);
    }

    if (savedTotalClicks !== null) {
        totalClicksGenerated = parseInt(savedTotalClicks, 10);
    }

    if (savedUpgradesPurchased !== null) {
        upgradesPurchased = parseInt(savedUpgradesPurchased, 10);
    }

    if (savedLevel !== null) {
        pLevel = parseInt(savedLevel, 10);
    }

    if (savedXp !== null) {
        pXp = parseInt(savedXp, 10);
    }

    if (savedNextLevelXp !== null) {
        nextLevelXp = parseInt(savedNextLevelXp, 10);
    }

    updateClickCount();
    updateXP(); // Update the XP bar after loading
}

// Save game state to localStorage
function saveGame() {
    localStorage.setItem('clickCount', clickCount);
    localStorage.setItem('clicksPerClick', clicksPerClick);
    localStorage.setItem('autoClickers', autoClickers);
    localStorage.setItem('clickRate', clickRate);
    localStorage.setItem('totalClicksGenerated', totalClicksGenerated);
    localStorage.setItem('upgradesPurchased', upgradesPurchased);
    localStorage.setItem('pLevel', pLevel);
    localStorage.setItem('pXp', pXp);
    localStorage.setItem('nextLevelXp', nextLevelXp);
}

// Reset game save data in localStorage
function resetSave() {
    localStorage.removeItem('clickCount');
    localStorage.removeItem('clicksPerClick');
    localStorage.removeItem('autoClickers');
    localStorage.removeItem('clickRate');
    localStorage.removeItem('totalClicksGenerated');
    localStorage.removeItem('upgradesPurchased');
    localStorage.removeItem('pLevel');
    localStorage.removeItem('pXp');
    localStorage.removeItem('nextLevelXp');

    // Optionally reset game variables
    clickCount = 0;
    clicksPerClick = 1;
    autoClickers = 0;
    clickRate = 1;
    totalClicksGenerated = 0;
    upgradesPurchased = 0;
    pLevel = 1;
    pXp = 0;
    nextLevelXp = 500; // Reset to initial value or whatever your starting value is

    updateClickCount();
    updateXP(); // Reset the XP bar to its initial state
    console.log("Game save reset successfully.");
    resetSaveElement.style.color = '#4caf50';
    resetSaveElement.textContent = "   Done   ";
    setTimeout(() => {
        resetSaveElement.textContent = "Reset game",
        resetSaveElement.style.color = '';
    }, 2000);
}

// Call loadGame on page load
window.addEventListener('load', loadGame);

// Save game periodically (e.g., every 5 seconds)
setInterval(saveGame, 5000);

// Optionally, save when the page is unloaded
window.addEventListener('beforeunload', saveGame);