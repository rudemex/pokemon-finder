const padDigits = (number, digits) => {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

const filterResponse = (data,key,search) =>{
    const dataFiltered = data.filter( item =>
       item[key].includes(search)
    );
    return dataFiltered;
}

module.exports = {
    padDigits,
    filterResponse
}