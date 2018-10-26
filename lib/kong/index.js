const http = require('axios')
const log = console.log
const chalk = require('chalk')

exports = module.exports = { }


class Kong {

  constructor(options) {
    this.options = options
    this.createService = this.createService.bind(this)
    this.createRoute = this.createRoute.bind(this)
  }

  async createRoute(service, ...route) {
    route.forEach( async(route)=>{

      route.service = {
        id: service.id,
      }
  
      try {
        await http.post(`${this.options.kongAdminUrl}/routes`, route)
      } catch (error) {
        log(chalk.red('Route creation failed with message: ' + error.message))
      }
    })

    return this
  }

  async removeService(service) {
    try {
      let response = await http.get(`${this.options.kongAdminUrl}/services/${service}/routes`)
      if (response.data) {
        response.data.data.forEach(async (route)=> {
          await http.delete(`${this.options.kongAdminUrl}/routes/${route.id}`)
        })
      }
      

      response = await http.get(`${this.options.kongAdminUrl}/services/${service}/plugins`)
      if (response.data) {
        response.data.data.forEach(async (plugin)=> {
          await http.delete(`${this.options.kongAdminUrl}/plugins/${plugin.id}`)
        })
      }
       
      await http.delete(`${this.options.kongAdminUrl}/services/${service}`)

    } catch (error) {
      log(chalk.red('Service removal failed with message: ', error.message))
    }

    return this
  }
  

  async removeRoute(route) {
    try {

      await http.delete(`${this.options.kongAdminUrl}/routes/${route}`)

    } catch (error) {
      log(chalk.red('Route removal failed with message: ', error.message))
    }

    return this
  }

  createService(service, cb) {
    http.post(`${this.options.kongAdminUrl}/services`, service)
      .then((response)=> {
        return cb(null, response.data)
      })
      .catch((e)=> cb(e, null))
  }

}


exports.Kong = Kong
