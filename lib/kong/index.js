const http = require('axios')

exports = module.exports = { }


class Kong {

  constructor(options) {
    this.service = { }
    this.options = options
    this.createService = this.createService.bind(this)
    this.createRoute = this.createRoute.bind(this)
  }

  async createService(service) {

    try {
      
      const response = await http.post(`${this.options.kongAdminUrl}/services`, service)

      if (!response.data) throw new Error('Error Creating Service')
    
      this.service = response.data
      
      return this

    } catch (error) {
      console.log('Service creation failed with message: ' + error.message)
      return false
    }
  }

  async createRoute(service, ...route) {
    
    route.forEach( async(route)=>{

      route.service = {
        id: service,
      }
  
      try {
        const response = await http.post(`${this.options.kongAdminUrl}/routes`, route)
      
  
        const data = response.data
        
        this.service = {
          ...this.service,
          routes: { }
        }
    
        this.service.routes[data.id] = data
    
      } catch (error) {
        console.log('Route creation failed with message: ' + error.message)
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
      console.log('Service removal failed with message: ', error.message)
    }

    return this
  }
  

  async removeRoute(route) {
    try {

      await http.delete(`${this.options.kongAdminUrl}/routes/${route}`)

    } catch (error) {
      console.log('Route removal failed with message: ', error.message)
    }

    return this
  }
}


exports.Kong = Kong
