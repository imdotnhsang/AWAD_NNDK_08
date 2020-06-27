import * as moment from 'moment'
export function getDateFromTimeStamp(timestamp) {
   // const date = new Date(timestamp)
    return moment(timestamp).format("DD-MM-YYYY hh:mm:ss");
}   

export function formatMoney(amount) {
    return amount && amount.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")
}