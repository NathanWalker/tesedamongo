var postmark = require("postmark")(process.env.POSTMARK_API_KEY || "ee7b5224-49fb-4c33-be06-30b65570889a");
var nodeEnv = process.env.NODE_ENV || 'development';

exports.requestId = function (req, res) {

  var sendEmail = function(){

      var sendTo = nodeEnv == 'development' ? req.body.email : "info@teseda.com";
      // postmark.send({
      //     "From": "info@teseda.com",
      //     "To": sendTo,
      //     "Subject": "Client ID Request from " + req.body.email,
      //     "TextBody": "Name: " + req.body.name + "\n\nEmail: " + req.body.email + "\n\nPhone: " + req.body.phone
      // }, function(error, success) {
      //     if(error) {
      //         failRedirect();
      //         console.error("Unable to send via postmark: " + error.message);
      //        return;
      //     }
      //     res.redirect('/#!/support?request=1&name=' + req.body.name);
      //     // console.info("Sent to postmark for delivery")
      // });


      var messages = [
          {
              "From": "info@teseda.com",
              "To": sendTo,
              "Subject": "Client ID Request from " + req.body.email,
              "TextBody": "Name: " + req.body.name + "\n\nEmail: " + req.body.email + "\n\nPhone: " + req.body.phone
          }
      ];

      if (nodeEnv != 'development') {
        var emailReceipt = {
          "From": "info@teseda.com",
          "To": req.body.email,
          "Subject": "Thank you for requesting your Client ID from Teseda",
          "TextBody": "Hi " + req.body.name + ",\n\nWe will be sending your Client ID to you soon. Once you receive it, you will be able to register with it in order to gain access to software downloads and other exclusive content.\n\nThank You,\nThe Teseda Team."
        };
        messages.push(emailReceipt);
      }

      postmark.batch(messages, function (error, success) {
          if (error) {
              failRedirect();
              console.error("Unable to send via postmark: " + error.message);
              return;
          }
          res.redirect('/#!/support?request=1&name=' + req.body.name);
      });

  };


  var failRedirect = function(invalidType){
    invalidType = invalidType || "1";
    res.redirect('/#!/support?request=1&invalid=' + invalidType + '&name=' + req.body.name + '&email=' + req.body.email + '&phone=' + req.body.phone)
  };

  if(req.body.name && req.body.email && req.body.phone){
    if (/[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/.test(req.body.email)){
      var emailParts = req.body.email.split('@');
      var domainPart = emailParts[1];
      if (domainPart.indexOf('hotmail') == -1 && domainPart.indexOf('yahoo') == -1 && domainPart.indexOf('gmail') == -1 && domainPart.indexOf('aol') == -1) {
        sendEmail();
      } else {
        // personal emails are not accepted
        failRedirect('2');
      }
    } else {
        // invalid email address
        failRedirect('3');
    }
  } else {
    // incomplete data
    failRedirect();
  }

}
