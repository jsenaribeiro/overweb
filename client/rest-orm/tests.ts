// import { test, expect, mock } from 'bun:test'
// import '../aid-js'
// import './synch'
// import './types'

// async function fetchMock<T>(ok: boolean, obj?: T) {
//    if (!obj) obj = { test:true } as T

//    const status = ok ? 200 : 500
//    const content = JSON.stringify(obj)
//    const response = new Response(content, { status })

//    globalThis['fetch'] = mock(fetch)
//       .mockResolvedValue(response) as any   
// }

// function synchMock<T>(ok: boolean, obj?: T, isArray = true) {
//    fetchMock<T>(ok, obj)

//    return synch<any>(isArray)
//       .fetch("www.fake.com/api")
//       .catch('not found...')
//       .match(x => x, 'guid')
// }

// async function mutateMock(base: any|any[], 
//    isArray: boolean, method: string, id: number,
//    change: (api: ISync<any,any>) => void) {
//    synch.stats.mutates = []

//    const resultApi = synchMock(true, base, isArray)
//    await Time.delay(99)   

//    change(resultApi)
//    fetchMock(true, base)
//    resultApi.async(true)   
//    await Time.delay(99)   

//    return synch.stats.mutates
//       .filter(x => x.method == method)
//       .filter(x => x.id == id || !id)
//       .length
// }

// interface Person {
//    guid: number
//    name: string
// }

// test('sync: wait syncing map', async function () {
//    const personApi = synchMock(true)
//    expect(personApi.await).toBe(true)
//    await Time.delay(100)
//    expect(personApi.await).toBe(false)
// })

// test('sync: uid key not found', async function () {
//    try { const personApi = synchMock(true) }
//    catch(ex: any) { expect(ex).toBe(NO_ID_KEY) }
// })

// test('sync: request failed', async function () {
//    const resultApi = synchMock(false)
//    await Time.delay(99)
//    expect(resultApi.error).toBe('not found...')
// })

// test('sync: remote get', async function () {
//    const john: Person = { guid:1, name: 'john' }
//    const data = synchMock(true, john, false)

//    expect(!!data.value.name).toBe(false)
//    await Time.delay(99)   
//    expect(data.value.name).toBe('john')   
//    data.value.name = 'paul'
//    expect(data.value.name).toBe('paul')
   
//    fetchMock(true, john)
//    data.async()   
//    await Time.delay(99)   
//    expect(data.value.name).toBe('john')
// })

// test('sync: mutate post object', async function () {
//    const john: Person = { guid:1, name: 'john' }
//    const paul: Person = { guid:2, name: 'paul' }
//    const posts = await mutateMock(
//          john, false, 'POST', 2,
//          api => api.value = paul)

//    expect(posts).toBe(1)
// })

// test('sync: mutate put object', async function () {
//    const john: Person = { guid:1, name: 'john' }

//    const posts = await mutateMock(
//          john, false, 'PUT', 1,
//          api => api.value.name = 'paul')

//    expect(posts).toBe(1)
// })


// test('sync: mutate post array', async function () {
//    const john: Person[] = [{ guid:1, name: 'john' }]
//    const paul: Person = { guid:2, name: 'paul' }

//    const posts = await mutateMock(
//       john, true, 'POST', 0,
//       api => api.value.push(paul))

//    expect(posts).toBe(1)
// })

// test('sync: mutate put array', async function () {
//    const john: Person[] = [{ guid:1, name: 'john' }]
   
//    const puts = await mutateMock(
//       john, true, 'PUT', 1,
//       api => api.value[0].name = 'paul')

//    expect(puts).toBe(1)
// })

// test('sync: mutate delete array', async function () {
//    const band: Person[] = [{ guid:1, name: 'john' }, { guid:2, name: 'paul' }]   
   
//    const deletes = await mutateMock(
//          band, true, 'DELETE', 1,
//          api => delete api.value[0])

//    expect(deletes).toBe(1)
// })

// test('sync: update render', async function() {
//    // TODO: rendering after get
// })