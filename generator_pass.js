const inputSlider = document.querySelector("[data-slider-length]"); // Use data-slider-length instead of datasilder-length
const passwordDisplay = document.querySelector("[data-password]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase"); // Use # for IDs
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number"); // Assuming "number" is an ID
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton"); // Use . for classes
const allCheckBox = document.querySelectorAll("input[type=checkbox]"); // Use querySelectorAll to select multiple checkboxes

const show = document.querySelector(".strength-container");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let  passWordLength=10;
let checkCount = 0;
handleSlider();

setIndicator("#ccc");
// show("#ccc");

// function show(color){
//     show.style.backgroundColor = color;
// }

// Set password length
function handleSlider() {
    inputSlider.value = passWordLength;
    lengthDisplay.innerText = passWordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passWordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}




function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

function  gereratorRandomNumber(){
    return getRndInteger(0,9);
}

function gereratorLowerCase(){
    return  String.fromCharCode(getRndInteger(97,123));
}

function gereratorUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function genereteSymbol(){
    const randNumer = getRndInteger(0,symbols.length);
    return symbols.charAt(randNumer);
}

 function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passWordLength>=8){
        setIndicator("#0f0");
        // navigator.clipboard.writeText(passwordDisplay.value);
        // // show("#ccc");
        // setIndicator.innerText = "Strong Password";
    }
    else if((hasLower || hasUpper) || (hasNum || hasSym) &&  passWordLength>=6){
        setIndicator("#ff0");
        // show("#ccc");
        // navigator.clipboard.writeText(passwordDisplay.value);
        // setIndicator.innerText = "Medium Password";
    }
    else{
        setIndicator("#f00");
        // show("#ccc");
        // navigator.clipboard.writeText(passwordDisplay.value);
        // setIndicator.innerText = "Week Password";
    }
    // show.classList.add("active")
}




async function copyContent(){
   try{
       await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
   }
   catch(e){
       copyMsg.innerText = "failed";
   } 

   // to make copyed message visiable
   copyMsg.classList.add("active");

   setTimeout(() => {
       copyMsg.classList.remove("active");
   }, 2000);
}



function shufflePassword(array){
    //fisher Yates  method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el)=>(str+=el));
    return str;

}



function handleCheckBoxChange(){
    checkCount= 0;
    allCheckBox.forEach( (checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special condition
     if(passWordLength < checkCount){
        passWordLength = checkCount;
        handleSlider();
     }
};

allCheckBox.forEach( (checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
});




inputSlider.addEventListener('input',(e)=>{
    passWordLength = e.target.value;
    handleSlider();
});


copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

console.log("success");
generateBtn.addEventListener('click', () => {
    // If no checkboxes are selected
    console.log("success");
    if (checkCount == 0) return;

    // Adjust password length if necessary
    if (passWordLength < checkCount) {
        passWordLength = checkCount;
        handleSlider();
    }

    console.log("Starting password generation");
    // Remove old password
    password = "";

    // Array to store the functions for generating random characters
    let funArr = [];

    if (uppercaseCheck.checked) {
        funArr.push(gereratorUpperCase);
    }

    if (lowercaseCheck.checked) {
        funArr.push(gereratorLowerCase);
    }

    if (numberCheck.checked) {
        funArr.push(gereratorRandomNumber);
    }

    if (symbolsCheck.checked) {
        funArr.push(genereteSymbol);
    }

    // Add required characters
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }
    console.log("Compulsory characters added");

    // Add remaining characters to meet the desired password length
    for (let i = 0; i < passWordLength-funArr.length; i++) {
        let randIndex = getRndInteger(0, funArr.length);
        password += funArr[randIndex]();
    }
    console.log("Remaining characters added");

    // Shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Password shuffled");

    // Display the password in the UI
    passwordDisplay.value = password;
    console.log("Password displayed on the UI");

    // Calculate password strength
    calcStrength();
});