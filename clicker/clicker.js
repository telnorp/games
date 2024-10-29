let clickCount = 0;
let clicksPerClick = 1;
let autoClickers = 0;  
let clickRate = 0;  
let totalClicksGenerated = 0;  
let upgradesPurchased = 0;  
const priceFactor = 1.15;
let aClickPrice = 50;
let upgradePrice = 10;
let pLevel = 1;
let pXp = 0;
const xpCurve = 2.4;
let nextLevelXp = 500;

var cSrc;

const clickButton = document.getElementById('clickButton');
const clickCountDisplay = document.getElementById('clickCount');
const upgradeButton = document.getElementById('upgradeButton');
const autoClickerButton = document.getElementById('autoClickerButton');
const aClickPriceStat = document.getElementById('aClickPriceStat');
const upgradePriceStat = document.getElementById('upgradePriceStat');
const upgradesPurchasedDisplay = document.getElementById('upgradesPurchased');
const autoClickersOwnedDisplay = document.getElementById('autoClickersOwned');
const clicksPerSecondDisplay = document.getElementById('clicksPerSecond');
const totalClicksGeneratedDisplay = document.getElementById('totalClicksGenerated');
const pLevelDisplay = document.getElementById('showLevel');
 
let lastScrollTime = 0;
const scrollDebounceTime = 25;
let spacePressed = false;

function updateClickCount(cSrc) {
    clickCountDisplay.textContent = clickCount;

    toggleButtonState(upgradeButton, clickCount >= calculateUpgradePrice());
    toggleButtonState(autoClickerButton, clickCount >= autoClickPrice());

    upgradesPurchasedDisplay.textContent = upgradesPurchased;
    autoClickersOwnedDisplay.textContent = autoClickers;
    clicksPerSecondDisplay.textContent = autoClickers; 
    totalClicksGeneratedDisplay.textContent = totalClicksGenerated;
    pLevelDisplay.textContent = pLevel;

    aClickPrice = autoClickPrice();
    aClickPriceStat.textContent = aClickPrice;
    upgradePrice = calculateUpgradePrice();
    upgradePriceStat.textContent = upgradePrice;

    if (clickCount > 0 && cSrc == 1) {
        addExperience();
    }
}

function toggleButtonState(button, condition) {
    button.disabled = !condition;
}

function applyIdleClicks() {
    if (autoClickers !== 0) {
    clickCount += clickRate;  // Increment by the click rate (idle clicks)
    totalClicksGenerated += clickRate;  // Track total clicks
    updateClickCount(0); // Update display without adding XP
    }
}

clickButton.addEventListener('click', () => {
    clickCount += clicksPerClick;
    totalClicksGenerated += clicksPerClick;  
    updateClickCount(1);
});

window.addEventListener('wheel', (event) => {
    const currentTime = Date.now();

    if (Math.abs(event.deltaY) > 30 && (currentTime - lastScrollTime) > scrollDebounceTime) {
        clickCount += clicksPerClick;
        totalClicksGenerated += clicksPerClick;
        updateClickCount(1);
        lastScrollTime = currentTime;
    }
});

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !event.target.matches('input, textarea, select, button')) {
        event.preventDefault();

        if (!spacePressed) {
            clickCount += clicksPerClick;
            totalClicksGenerated += clicksPerClick;  // Track total clicks
            updateClickCount(1);
            spacePressed = true;
        }
    }
});

window.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        spacePressed = false;
    }
});

upgradeButton.addEventListener('click', () => {
    const cUpPrice = calculateUpgradePrice();
    if (clickCount >= cUpPrice) {
        clickCount -= cUpPrice;
        clicksPerClick += pLevel;
        upgradesPurchased++;
        updateClickCount(1);
    }
});

autoClickerButton.addEventListener('click', () => {
    if (clickCount >= aClickPrice) {
        clickCount -= aClickPrice;
        autoClickers++;
        clickRate++;
        updateClickCount(1);
    }
});

function calculateUpgradePrice() {
    return roundToNearest5(Math.ceil(10 * Math.pow(priceFactor, upgradesPurchased)));
}

function autoClickPrice() {
    return roundToNearest5(Math.ceil(50 * Math.pow(priceFactor, autoClickers)));
}

function roundToNearest5(num) {
    return Math.round(num / 5) * 5;
}

function createFloatingText(xpAmount, x, y, type) {
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    if (type = "xp") {
    floatingText.innerText = `+${xpAmount} xp`;
    } 
    else if (type = "lvl") {
        floatingText.innerText = `+LVL`;
        floatingText.style.color = '#fff959';
    }
    document.body.appendChild(floatingText);
    
    // Position the text at the specified coordinates
    floatingText.style.left = `${x}px`;
    floatingText.style.top = `${y}px`;

    // Animate the text
    setTimeout(() => {
        floatingText.style.transform = 'translateY(-50px)';
        floatingText.style.opacity = '0';
    }, 10);

    // Remove the text after the animation completes
    setTimeout(() => {
        floatingText.remove();
    }, 600);
}
function addExperience() {
    const xpAmount = 5; // Change this if you want to display different amounts
    pXp += xpAmount; // Increase experience by 5 instead of 1
    updateXP();

    // Get random position for the floating text
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const x = windowWidth * 0.4 + Math.random() * (windowWidth * 0.2);
    const y = windowHeight * 0.4 + Math.random() * (windowHeight * 0.2);

    createFloatingText(xpAmount, x, y, "xp");

    if (pXp >= nextLevelXp) {
        lvlUp();
    }
}

function lvlUp() {
    pLevel++;
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    createFloatingText(5, x, y, "lvl");
    nextLevelXp = pXp * xpCurve;
    pXp = 0;
}

let xpInterval;

function updateXP() {
    clearInterval(xpInterval);
    const xpProgress = document.getElementById('xpProgress');
    const targetPercentage = (pXp / nextLevelXp) * 100;
    let currentPercentage = parseFloat(xpProgress.style.width) || 0;

    // Prevent fluctuation by setting a small threshold for adjustments
    const increment = (targetPercentage > currentPercentage) ? 1 : -1;

    xpInterval = setInterval(() => {
        if ((increment > 0 && currentPercentage < targetPercentage) || 
            (increment < 0 && currentPercentage > targetPercentage)) {
            currentPercentage += increment;
            if (increment > 0 && currentPercentage > targetPercentage) {
                currentPercentage = targetPercentage;
            } else if (increment < 0 && currentPercentage < targetPercentage) {
                currentPercentage = targetPercentage;
            }
            xpProgress.style.width = currentPercentage + '%';
        } else {
            clearInterval(xpInterval); 
        }
    }, 20);
}

setInterval(applyIdleClicks, 1000);