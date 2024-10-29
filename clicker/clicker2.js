let clickCount = 0;
let clicksPerClick = 1;
let autoClickers = 0;  // Number of auto-clickers owned by the player
let clickRate = 0;  // Clicks per second from auto-clickers
let totalClicksGenerated = 0;  // Tracks total clicks (manual + auto-clicker)
let upgradesPurchased = 0;  // Number of upgrades purchased
let priceFactor = 1.15;
let aClickPrice = 50;
let upgradePrice = 10;
let pLevel = 1;
let pXp = 0;
let xpCurve = 2.4;
let nextLevelXp = 500;
//consts

const clickButton = document.getElementById('clickButton');
const clickCountDisplay = document.getElementById('clickCount');
const upgradeButton = document.getElementById('upgradeButton');
const autoClickerButton = document.getElementById('autoClickerButton');
const aClickPriceStat = document.getElementById('aClickPriceStat');
const upgradePriceStat = document.getElementById('upgradePriceStat');
// Stats elements
const upgradesPurchasedDisplay = document.getElementById('upgradesPurchased');
const autoClickersOwnedDisplay = document.getElementById('autoClickersOwned');
const clicksPerSecondDisplay = document.getElementById('clicksPerSecond');
const totalClicksGeneratedDisplay = document.getElementById('totalClicksGenerated');

// Variable to control the scroll debounce timing
let lastScrollTime = 0;
const scrollDebounceTime = 25;

// Flag to track space bar state
let spacePressed = false;

// Update the click count display and enable/disable buttons
function updateClickCount() {
    clickCountDisplay.textContent = clickCount; // Update the displayed click count

    // Enable the upgrade button if the player has enough clicks
    if (clickCount >= calculateUpgradePrice()) {
        upgradeButton.disabled = false;
    } else {
        upgradeButton.disabled = true;
    }

    // Enable the auto-clicker button if the player has enough clicks
    if (clickCount >= autoClickPrice()) {
        autoClickerButton.disabled = false;
    } else {
        autoClickerButton.disabled = true;
    }

    // Update stats related to upgrades and auto-clickers
    upgradesPurchasedDisplay.textContent = upgradesPurchased;
    autoClickersOwnedDisplay.textContent = autoClickers;
    clicksPerSecondDisplay.textContent = clickRate * 2; // Assuming click rate reflects clicks per second
    totalClicksGeneratedDisplay.textContent = totalClicksGenerated;

    // Update prices
    aClickPrice = autoClickPrice();
    aClickPriceStat.textContent = aClickPrice;
    upgradePrice = calculateUpgradePrice();
    upgradePriceStat.textContent = upgradePrice;

    // Add experience to XP and update the XP bar only on manual clicks
    // This ensures XP is not updated during auto-clicks
    if (clickCount > 0) { // Example condition to avoid unnecessary updates
        addExperience();
    }
}

// Add clicks from idle auto-clickers every second
function applyIdleClicks() {
    clickCount += clickRate;  // Increment by the click rate (idle clicks)
    totalClicksGenerated += clickRate;  // Track total clicks
    updateClickCount(); // Update display without adding XP
}

// Handle click events from button
clickButton.addEventListener('click', () => {
    clickCount += clicksPerClick;
    totalClicksGenerated += clicksPerClick;  // Track total clicks
    addExperience(); // Only add XP when the player clicks manually
    updateClickCount();
});

// Handle scroll events as clicks (with debounce for trackpads)
window.addEventListener('wheel', (event) => {
    const currentTime = new Date().getTime();

    if (Math.abs(event.deltaY) > 30 && (currentTime - lastScrollTime) > scrollDebounceTime) {
        clickCount += clicksPerClick;
        totalClicksGenerated += clicksPerClick;  // Track total clicks
        updateClickCount();
        lastScrollTime = currentTime;
    }
});

// Handle space bar press as clicks
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (!event.target.matches('input, textarea, select, button')) {
            event.preventDefault();

            if (!spacePressed) {
                clickCount += clicksPerClick;
                totalClicksGenerated += clicksPerClick;  // Track total clicks
                updateClickCount();
                spacePressed = true;
            }
        }
    }
});

// Reset the spacePressed flag on keyup
window.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        spacePressed = false;
    }
});

upgradeButton.addEventListener('click', () => {
    const cUpPrice = calculateUpgradePrice();
    if (clickCount >= cUpPrice) {
        clickCount -= cUpPrice;
        clicksPerClick++;
        upgradesPurchased++;
        updateClickCount();
    }
});

autoClickerButton.addEventListener('click', () => {
    if (clickCount >= aClickPrice) {
        clickCount -= aClickPrice;
        autoClickers++;
        clickRate += 1;
        updateClickCount();
    }
});
//function for calculating upgrade price.
/*function upCalc(){
}*/
function calculateUpgradePrice() {
    var upgradePrice = 10;
    var temp;
    temp = Math.ceil(upgradePrice * Math.pow(priceFactor, upgradesPurchased));  
    upgradePrice = roundToNearest5(temp);
    return upgradePrice;
}

function autoClickPrice() {
    var aClickPriceStat = 50;
    var temp;
    temp = Math.ceil(aClickPriceStat * Math.pow(priceFactor, autoClickers));
    aClickPriceStat = roundToNearest5(temp);
    return aClickPriceStat;
}

function roundToNearest5(num) {
    return Math.round(num / 5) * 5;
}

// XP/LEVEL SYSTEM

function addExperience() {
    pXp++;
    updateXP();
    if (pXp >= nextLevelXp) {
        lvlUp();
    }
}

function lvlUp() {
    pLevel++;
    nextLevelXp = pXp * xpCurve;
    pXp = 0;
    //todo:
    //image flash on levelup
    //play sound on levelup
}

let xpInterval;

function updateXP() {
    clearInterval(xpInterval); // Clear any existing interval
    const xpProgress = document.getElementById('xpProgress');
    const targetPercentage = (pXp / nextLevelXp) * 100;
    let currentPercentage = parseFloat(xpProgress.style.width) || 0;

    const increment = targetPercentage > currentPercentage ? 1 : -1;

    xpInterval = setInterval(() => {
        if ((increment > 0 && currentPercentage < targetPercentage) || 
            (increment < 0 && currentPercentage > targetPercentage)) {
            currentPercentage += increment;
            xpProgress.style.width = currentPercentage + '%';
        } else {
            clearInterval(xpInterval); // Clear interval once target is reached
        }
    }, 20);
}

//
setInterval(applyIdleClicks, 500);