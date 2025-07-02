// import { test, expect } from 'bun:test'
// import "../fetch-swr";
// import '../../aid-js'
// import '../mocks.ts'
// import './index'

// const cacheKeys = ['testing', 'cached', 'keys']

// function fetchMock<T extends object>(obj: T, ok: boolean, wait=1) {
//    const status = ok ? 200 : 500
//    const content = JSON.stringify(obj)
//    const response = new Response(content, { status })

//    globalThis.fetch = ((...args: Parameters<typeof fetch>) =>
//       Time.wait(wait, () => response)) as typeof fetch as any
// }

// function fetching(reset: boolean, args?: any, wait = 1) {
//    fetchMock({ text: 'ok' }, true, wait)
//    if (reset) fetchApi.stats.requests = 0
//    if (reset) fetchApi.clear()
//    return fetch('http://test.com', { ...args })
// }

// test('fetch: clear', async function () {
//    await fetching(true, { cache: '1s', cacheKeys })
//    fetchApi.clear(cacheKeys)
//    await fetching(false)
//    expect(fetchApi.stats.requests).toEqual(2)

//    fetchApi.stats.clear()
   
//    await fetching(true, { cache: 111, cacheKeys })
//    fetchApi.clear()
//    await fetching(false)
//    expect(fetchApi.stats.requests).toEqual(2)
// })

// test('fetch: cache', async function () {
//    await fetching(true, { cache: 111 })
//    for (let i = 0; i < 7; i++) await fetching(false)
//    await Time.delay(500)
//    await fetching(false)
//    expect(fetchApi.stats.requests).toEqual(2)

//    fetchApi.stats.clear()

//    await fetching(true, { cache: 111, cacheKeys })
//    for (let i = 0; i < 9; i++) await fetching(false)
//    await Time.delay(500)
//    await fetching(false)
//    expect(fetchApi.stats.requests).toEqual(3) 
// })

// test('fetch: retry', async function () { 
//    fetchApi.clear()
//    fetchMock({ text: 'ok' }, false)      
//    await fetchApi('http://test.com', 3, 111)
//    expect(fetchApi.stats.retries).toEqual(3)
// })