// How my code will be working once its done
//  1. Gets the data from the other js file
//  2. Uppercases the data and removes spaces and hastags
//  3. Filters out the correct HEX values 
//  4. Filters out written colors and replaces them with HEX values
//  5. Filters out RGB colors and converts it to HEX
//  6. Puts all the correct data back together 

//all the data from survayAnswers.js is loaded into a single variable which i'm able to use later
const surveyAnswer = data
//The name of the colomn I want to extract data from
const colomnNameOne = "oogKleur"
const brownHex = "4F1B03"
const blueHex = "6074A6"
const lightBlueHex = "9BBCCC"
const greenHex = "045C41"

//Creates an array of all the eye color values and converts them to uppercase and removes spaces and hastags
//Code adapted from Sergio Eijben
function transformData(){
    const eyeColors = surveyAnswer.map(answer => answer[colomnNameOne]
        .toUpperCase()
        .replace("#", "")
        .replace(" ", "")
        .replace("BRUIN", brownHex)
        .replace("LICHTBLAUW", lightBlueHex)
        .replace("BLAUW", blueHex)
        .replace("GROEN", greenHex)
    )
    
    //Shows all the eye color data in the console
    console.log(eyeColors)
    
    //Checks if the hex values are six characters long and separates the correct hex values and puts them into an array
    const correctHexValues = eyeColors.filter(color => color.length == 6)
    //Separates the incorrect hex values and puts them into an array, all incorrect values are less or more than 6 characters
    const wrongValues = eyeColors.filter(color => color.length != 6)
    
    // source https://stackoverflow.com/questions/40454296/filter-a-list-element-starting-with-a-letter-in-javascript
    //Checks if only the array items starting with RGB are put into the new array
    const halfRgbValues = wrongValues.filter(rgb => rgb.startsWith("RGB"))
    console.log(halfRgbValues)
    
    //Prepares the value's fro conversion by removing brackets, commas, dots and the RGB text infront
    let rgbValues = halfRgbValues[0]
        .replace("RGB", "")
        .replace("(", "")
        .replace(")", "")
        .replace(".", " ")
        .replace(",", " ")
        .split(" ")
    
    //Debug console.log to shows if the RGB values have propperly prepared for conversion
    console.log(rgbValues)
    
    //Passes the array of rgb values through the rgbToHex function
    const correctRgb = rgbToHex(rgbValues)
    
    //Pushes the corrected RGB values to HEX back into the main array
    correctHexValues.push(correctRgb)
    
    //Adds the hashtags back in front of each item in the array
    //Source: https://stackoverflow.com/questions/20498409/adding-text-to-beginning-of-each-array-element
    for(let i=0;i<correctHexValues.length;i++){
        correctHexValues[i]="#"+correctHexValues[i];
    }
    
    //This line wouldn't work for some reason :(
    // correctHexValues.forEach(item => {item.padStart(7, "#")})
    
    //Shows the final result in the console
    console.log(correctHexValues)
}

//Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
//These functions convert rgb values to hex
function componentToHex(rgbComponent) {
    let hex = rgbComponent.toString(16)
    return hex.length == 1 ? "0" + hex : hex
}
  
// Code adapted from Veerle Prins
function rgbToHex (arr) {
    let int1 = parseInt(arr[0])
    let int2 = parseInt(arr[1])
    let int3 = parseInt(arr[2])
    console.log(int1, int2, int3)
    return componentToHex(int1) + componentToHex(int2) + componentToHex(int3)
}
