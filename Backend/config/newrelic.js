'use strict'
exports.config = {
  app_name: ['ProyectNube25'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info',
    filepath: 'stdout'
  },
  allow_all_headers: true,
  application_logging: {
    forwarding: {
      enabled: true
    }
  },
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization'
    ]
  }
}