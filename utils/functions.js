const padDigits = (number, digits) => {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

module.exports = {
    padDigits
}