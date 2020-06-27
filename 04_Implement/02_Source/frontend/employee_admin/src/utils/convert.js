import * as moment from 'moment'
export function getDateFromTimeStamp(timestamp) {
   // const date = new Date(timestamp)
    return moment(timestamp).format("DD-MM-YYYY hh:mm:ss");
}   
