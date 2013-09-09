
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      postmarkKey: 'POSTMARK_KEY',
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
    db: 'mongodb://localhost/teseda',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Teseda - Production'
    }
  }
}
