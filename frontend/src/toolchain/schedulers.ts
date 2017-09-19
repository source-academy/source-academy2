import { Scheduler, Value, Context, Result } from './types'

export class AsyncScheduler implements Scheduler {
  run(it: IterableIterator<Value>, context: Context): Promise<Result> {
    return new Promise((resolve, reject) => {
      context.runtime.isRunning = true
      let itValue = it.next()
      try {
        while (!itValue.done) {
          itValue = it.next()
        }
      } catch (e) {
        resolve({ status: 'error' })
      } finally {
        context.runtime.isRunning = false
      }
      resolve({
        status: 'finished',
        value: itValue.value
      })
    })
  }
}

export class PreemptiveScheduler implements Scheduler {
  constructor(public steps: number) {
  }

  run(it: IterableIterator<Value>, context: Context): Promise<Result> {
    return new Promise((resolve, reject) => {
      context.runtime.isRunning = true
      let itValue = it.next()
      let interval: number
      interval = setInterval(() => {
        let step = 0
        try {
          while (!itValue.done && step < this.steps) {
            itValue = it.next()
            step++
          }
        } catch (e) {
          context.runtime.isRunning = false
          clearInterval(interval)
          resolve({ status: 'error' })
        }
        if (itValue.done) {
          context.runtime.isRunning = false
          clearInterval(interval)
          resolve({ status: 'finished', value: itValue.value })
        }
      })
    })
  }
}
