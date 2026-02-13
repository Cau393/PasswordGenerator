console.clear();

const sliderProps = {
    fill: "#0B1EDF",
    background: "rgba(255, 255, 255, 0.214)",
};

const sliderContainer = document.querySelector(".length.range__slider");
const sliderInput = document.getElementById("slider");

sliderInput.addEventListener("input", event => {
    sliderContainer.querySelector(".length__title").dataset.length = event.target.value;
    applyFill(event.target);
});

applyFill(sliderInput);

function applyFill(slider) {
    const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
    const bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage + 0.1}%)`;
    slider.style.background = bg;
    sliderContainer.querySelector(".length__title").dataset.length = slider.value;
}

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol,
};

function secureMathRandom() {
    return globalThis.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1);
}

function getRandomLower() {
    return String.fromCodePoint(Math.floor(Math.random() * 26) + 97);
}
function getRandomUpper() {
    return String.fromCodePoint(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumber() {
    return String.fromCodePoint(Math.floor(secureMathRandom() * 10) + 48);
}
function getRandomSymbol() {
    const symbols = '~!@#$%^&*()_+{}":?><;.,';
    return symbols[Math.floor(Math.random() * symbols.length)];
}

const resultEl = document.getElementById("result");
const lengthEl = document.getElementById("slider");
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numberEl = document.getElementById("number");
const symbolEl = document.getElementById("symbol");
const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy-btn");
const resultContainer = document.querySelector(".result");
const copyInfo = document.querySelector(".result__info.right");
const copiedInfo = document.querySelector(".result__info.left");

let generatedPassword = false;

let resultContainerBound = {
    left: resultContainer.getBoundingClientRect().left,
    top: resultContainer.getBoundingClientRect().top,
};

resultContainer.addEventListener("mousemove", e => {
    resultContainerBound = {
        left: resultContainer.getBoundingClientRect().left,
        top: resultContainer.getBoundingClientRect().top,
    };
    if (generatedPassword) {
        copyBtn.style.opacity = "1";
        copyBtn.style.pointerEvents = "all";
        copyBtn.style.setProperty("--x", `${e.x - resultContainerBound.left}px`);
        copyBtn.style.setProperty("--y", `${e.y - resultContainerBound.top}px`);
    } else {
        copyBtn.style.opacity = "0";
        copyBtn.style.pointerEvents = "none";
    }
});

window.addEventListener("resize", () => {
    resultContainerBound = {
        left: resultContainer.getBoundingClientRect().left,
        top: resultContainer.getBoundingClientRect().top,
    };
});

copyBtn.addEventListener("click", () => {
    const password = resultEl.innerText;
    if (!password || password === "CLICK GENERATE") {
        return;
    }
    navigator.clipboard.writeText(password).catch(() => {
        const textarea = document.createElement("textarea");
        textarea.value = password;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
    });
    copyInfo.style.transform = "translateY(200%)";
    copyInfo.style.opacity = "0";
    copiedInfo.style.transform = "translateY(0%)";
    copiedInfo.style.opacity = "0.75";
});

generateBtn.addEventListener("click", () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numberEl.checked;
    const hasSymbol = symbolEl.checked;
    generatedPassword = true;
    resultEl.innerText = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
    copyInfo.style.transform = "translateY(0%)";
    copyInfo.style.opacity = "0.75";
    copiedInfo.style.transform = "translateY(200%)";
    copiedInfo.style.opacity = "0";
});

function generatePassword(length, lower, upper, number, symbol) {
    let generated = "";
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);
    if (typesCount === 0) {
        return "";
    }
    for (let i = 0; i < length; i++) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generated += randomFunc[funcName]();
        });
    }
    return generated.slice(0, length)
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
}

function disableOnlyCheckbox() {
    const allCheckboxes = [uppercaseEl, lowercaseEl, numberEl, symbolEl];
    const totalChecked = allCheckboxes.filter(el => el.checked);
    allCheckboxes.forEach(el => {
        el.disabled = totalChecked.length === 1 && el.checked;
    });
}

[uppercaseEl, lowercaseEl, numberEl, symbolEl].forEach(el => {
    el.addEventListener("click", () => {
        disableOnlyCheckbox();
    });
});