import { users } from './data.json'

const CreateSend = require('createsend-node')

const auth = { apiKey: 'cf58a5e521795c1a4744eab35930193b' }
const api = new CreateSend(auth)

const simplifyUsers = (collection) =>
  collection
    .map(({ user, seed }) => ({ ...user, seed }))
    .map(({ email, name, seed, picture }) => ({ email, name, seed, picture }))

function routes(router) {
  router.get('/users', async (ctx) => {
    ctx.body = simplifyUsers(users.slice(0, 10))
  })
  router.post('/newsletter', (ctx, next) => {
    api.subscribers.addSubscriber(
      'ff69017957aa8009a3fb82ac7b862115',
      ctx.request.body,
      (err, payload) => {
        if (err) {
          ctx.status = 500
        }

        const cache = []

        ctx.body = JSON.stringify(payload, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return
            }
            // Store value in our collection
            cache.push(value)
          }
          return value
        })
      },
    )

    return next()
  })
  router.get('/users/:seed', async (ctx) => {
    const { seed } = ctx.params
    const [ result ] = simplifyUsers(users.filter((user) => user.seed === seed))

    if (!result) {
      ctx.body = { error: { message: 'User not found' } }
    } else {
      ctx.body = result
    }
  })
}

// can't export directly function, run into const issue
// see: https://phabricator.babeljs.io/T2892
export default routes
