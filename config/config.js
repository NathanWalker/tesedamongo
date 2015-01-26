
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      postmarkKey: process.env.POSTMARK_API_KEY,
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    }

module.exports = {
  development: {
    db: 'mongodb://localhost/heroku_app18212749',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Teseda - Development'
    }
  },
  test: {
    db: 'mongodb://localhost/teseda-test',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Teseda - Test'
    }
  },
  production: {
    db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/heroku_app18212749',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Teseda - Production'
    }
  }
}
