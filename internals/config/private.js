import { port } from './public'

const { NODE_ENV } = process.env

const config = {

  default: {
    port,
    locales: [ 'en', 'ko', 'ja', 'zh' ]
  },

  development: {

  },

  staging: {

  },

  production: {

  }

}

export default config[NODE_ENV] ?
  { ...config.default, ...config[NODE_ENV] } :
  { ...config.default, ...config.development }
