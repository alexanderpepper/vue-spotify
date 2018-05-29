import moment from 'moment'
export default class DateService {
  static formattedDuration (durationMs) {
    return moment.utc(durationMs).format(durationMs > 3600000 ? 'HH:mm:ss' : 'mm:ss')
  }
}
