import moment from 'moment'
export default class DateService {
  static formattedDuration (durationMs) {
    return moment.utc(durationMs).format(durationMs > 3600000 ? 'HH:mm:ss' : 'mm:ss')
  }

  static englishFormattedDuration (durationMs) {
    const days = Math.floor(moment.duration(durationMs, 'milliseconds').asDays())
    const daysComponent = days > 0 ? `${Math.floor(moment.duration(durationMs, 'milliseconds').asDays())} day ` : ''
    const hours = moment.utc(durationMs).format('H')
    const hoursComponent = hours > 0 ? `${hours} hr ` : ''
    const minutes = moment.utc(durationMs).format('m')
    const minutesComponent = minutes > 0 ? `${minutes} min` : ''
    return `${daysComponent}${hoursComponent}${minutesComponent}`
  }
}
