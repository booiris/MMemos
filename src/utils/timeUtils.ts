import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localeData)

/**
 * Format UTC time to local time display
 * @param utcTime UTC time string
 * @param t Internationalization function
 * @returns Formatted time string
 */
export const formatLocalTime = (
    utcTime: string,
    t: (key: string) => string
): string => {
    if (!utcTime) return ''

    try {
        const localTime = dayjs.utc(utcTime).local()
        const now = dayjs()

        if (localTime.isSame(now, 'day')) {
            return localTime.format('HH:mm')
        }

        if (localTime.isSame(now.subtract(1, 'day'), 'day')) {
            return `${t('time.yesterday')} ${localTime.format('HH:mm')}`
        }

        if (localTime.isSame(now, 'year')) {
            return localTime.format(`${t('time.format.date')}`)
        }

        return localTime.format(`${t('time.format.fullDate')}`)
    } catch (error) {
        console.error('Time format error:', error)
        return utcTime
    }
}
