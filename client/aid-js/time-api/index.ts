type TimeString = `${number}h` | `${number}min` | `${number}s`

class Time {
   public static getMillisecondsFrom(ts: number | TimeString): number {
      if (typeof ts == "number") return ts

      const maps = { h: 1000 * 60 * 60, min: 1000 * 60, s: 1000 }
      const unit = `${ts}`.replace(/\d/g, '')?.trim() || ''
      const data = parseInt(`${ts}`.replace(/\D/g, '')?.trim() || '0')
      const time = (maps[unit] || 0) * (data || 0)

      return time
   }

   public static delay(ms: number): Promise<void>
   public static delay(ts: TimeString): Promise<void>
   public static delay(ms: number | TimeString): Promise<void> {
      const time = Time.getMillisecondsFrom(ms)
      return new Promise(done => setTimeout(done, time))
   }

   public static wait(t: number | TimeString, callback: () => void) {
      const waiting = Time.getMillisecondsFrom(t)
      const timeout = resolve => () => { resolve(callback()) }
      const promise = resolve => setTimeout(timeout(resolve), waiting)

      return new Promise(promise)
   }
}