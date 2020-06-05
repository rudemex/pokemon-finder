const moment = require('moment');
const DEFAULT_FORMAT = 'YYYY-MM-DD';

module.exports = function localDateToMoment(value, format) {
    let newValue = {};
    if (Array.isArray(value)) {
        newValue = value[0] + '-' + value[1] + '-' + value[2];
    } else {
        newValue = value.year + '-' + value.monthValue + '-' + value.dayOfMonth;
    }
    return moment(newValue).format(format ? format : DEFAULT_FORMAT);
}