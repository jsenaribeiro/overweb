type TimeString = `${number}h` | `${number}min` | `${number}s`
   | `${number}h${number}min` | `${number}min${number}s`
   | `${number}:${number}:${number}` | `${number}:${number}`
   | `${number}h${number}min${number}s`

class Time {
   public static parse(ts: number | TimeString): number {
      if (typeof ts == "number") return ts

      if (ts.match(/\d+h\d+min\d+s/)) {
         const [_, h, m, s] = ts.match(/(\d+)h(\d+)min(\d+)s/)
         
         const H = Time.parse(h as TimeString)
         const M = Time.parse(m as TimeString)
         const S = Time.parse(s as TimeString)
         
         return H + M + S
      }

      if (ts.match(/\d+h\d+min/)) {
         const [_, h, m] = ts.match(/(\d+)h(\d+)min/)
         const args = `${h}h${m}min0s` as TimeString
         return Time.parse(args)
      }

      if (ts.match(/\d+min\d+s/)) {
         const [_, m, s] = ts.match(/(\d+)min(\d+)s/)
         const args = `0h${m}min${s}s` as TimeString
         return Time.parse(args)
      }

      if (ts.match(/\d+:\d+/)) {
         const [_, h, m] = ts.match(/(\d+):(\d+)/)
         const args = `${h}h${m}min0s` as TimeString
         return Time.parse(args)
      }

      if (ts.match(/\d+:\d+:\d+/)) {
         const [_, h, m, s] = ts.match(/(\d+):(\d+):(\d+)/)
         const args = `${0}h${m}min${s}s` as TimeString
         return Time.parse(args)
      }

      const maps = { h: 1000 * 60 * 60, min: 1000 * 60, s: 1000 }
      const unit = `${ts}`.replace(/\d/g, '')?.trim() || ''
      const data = parseInt(`${ts}`.replace(/\D/g, '')?.trim() || '0')
      const time = (maps[unit] || 0) * (data || 0)

      return time
   }

   public static delay(ms: number): Promise<void>
   public static delay(ts: TimeString): Promise<void>
   public static delay(tt: any): Promise<void> {
      const time = Time.parse(tt)
      return new Promise(done => setTimeout(done, time))
   }

   public static wait(t: number | TimeString, callback: () => void) {
      const waiting = Time.parse(t)
      const timeout = resolve => () => { resolve(callback()) }
      const promise = resolve => setTimeout(timeout(resolve), waiting)

      return new Promise(promise)
   }
}