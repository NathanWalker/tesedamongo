
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      postmarkKey: 'ee7b5224-49fb-4c33-be06-30b65570889a',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    }

module.exports = {
  development: {
    db: 'mongodb://localhost/teseda-dev',
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
    db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/teseda-dev',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Teseda - Production'
    }
  }
}
