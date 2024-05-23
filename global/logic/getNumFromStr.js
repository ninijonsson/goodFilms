export function extractNumbersFromString (str) {
    let number = "";

    for (let char of str) {
        if (Number.isInteger(Number(char))) {
            number += char;
        }
    }
    return number;
}