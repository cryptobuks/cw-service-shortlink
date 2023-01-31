const config = require('config')
const cw = require('@cowellness/cw-micro-service')(config)

beforeAll(async () => {
  await cw.autoStart()
})

describe('Test shortlink services', () => {
  it('Should validate incoming message for new url', async () => {
    const resp = await cw.rabbitmq.sendAndRead('/shortlinks/post', {

    })
    expect(resp.data.errors).toBeDefined()
  })

  it('Should validate incoming message for getting shot url ', async () => {
    const resp = await cw.rabbitmq.sendAndRead('/shortlinks/get', {

    })
    expect(resp.data.errors).toBeDefined()
  })
  it('Should validate incoming message for shot url & create a unquie key for same ', async () => {
    const resp = await cw.rabbitmq.sendAndRead('/shortlinks/post', {
      url: 'https://www.google.com',
      expiryDays: 0
    })
    expect(resp.data.errors).not.toBeDefined()
    expect(resp.data.result).toBe('ok')
    expect(resp.data.data.key).toBeDefined()
    expect(resp.data.data.key.length).toBe(7)
    expect(resp.data.data.link).toBe('https://www.google.com')
  })

  it('Should create a token for url and fetch url based on it key from queue ', async () => {
    const resp = await cw.rabbitmq.sendAndRead('/shortlinks/post', {
      url: 'https://dev.cowellness.net',
      expiryDays: 10
    })
    expect(resp.data.errors).not.toBeDefined()
    expect(resp.data.result).toBe('ok')
    expect(resp.data.data.key).toBeDefined()
    expect(resp.data.data.key.length).toBe(7)
    expect(resp.data.data.link).toBe('https://dev.cowellness.net')
    const resp1 = await cw.rabbitmq.sendAndRead('/shortlinks/get', {
      key: resp.data.data.key
    })
    const d = new Date()
    d.setDate(d.getDate() + 10)
    expect(resp1.data.errors).not.toBeDefined()
    expect(resp1.data.data.link).toBe('https://dev.cowellness.net')
    expect(new Date(resp1.data.data.validTill).getDate()).toBe(d.getDate())
  })

  it('Should handle bad request for get in queue', async () => {
    const resp = await cw.rabbitmq.sendAndRead('/shortlinks/get', {
      key: 'test'
    })
    expect(resp.data.errors).not.toBeDefined()
    expect(resp.data.data).toBe(null)
  })

  it('Should create a token for url and fetch url based on it key from browser', async () => {
    const resp = await cw.rabbitmq.sendAndRead('/shortlinks/post', {
      url: 'https://www.funtime.com',
      expiryDays: 10
    })
    expect(resp.data.errors).not.toBeDefined()
    expect(resp.data.result).toBe('ok')
    expect(resp.data.data.key).toBeDefined()
    expect(resp.data.shortURL).toBeDefined()
    expect(resp.data.shortURL.includes(resp.data.data.key)).toBe(true)
    expect(resp.data.data.key.length).toBe(7)
    expect(resp.data.data.link).toBe('https://www.funtime.com')
    const resp1 = await cw.fastify.inject({ method: 'GET', url: '/links/' + resp.data.data.key })
    expect(resp1.statusCode).toBe(302)
    expect(resp.data.data.link).toBe('https://www.funtime.com')
    const resp2 = await cw.fastify.inject({ method: 'GET', url: '/links/' + resp.data.data.key }).headers({ 'user-agent': 'APIs-Google' })
    expect(resp2.statusCode).toBe(302)
  })

  it('Should create a token for url and fetch url based on it key from browser (google bot)', async () => {
    const resp = await cw.rabbitmq.sendAndRead('/shortlinks/post', {
      url: 'https://www.googlebot.com',
      expiryDays: 10
    })
    expect(resp.data.errors).not.toBeDefined()
    expect(resp.data.result).toBe('ok')
    expect(resp.data.data.key).toBeDefined()
    expect(resp.data.shortURL).toBeDefined()
    expect(resp.data.shortURL.includes(resp.data.data.key)).toBe(true)
    expect(resp.data.data.key.length).toBe(7)
    expect(resp.data.data.link).toBe('https://www.googlebot.com')
    const resp2 = await cw.fastify.inject({ method: 'GET', url: '/links/' + resp.data.data.key }).headers({ 'user-agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)' })
    expect(resp2.statusCode).toBe(302)
    const resp1 = await cw.rabbitmq.sendAndRead('/shortlinks/get', {
      key: resp.data.data.key
    })
    expect(resp1.data.data.click).toBe(0)
  })
})
