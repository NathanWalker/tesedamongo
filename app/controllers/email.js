var postmark = require("postmark")(process.env.POSTMARK_API_KEY);

exports.requestId = function (req, res) {

  var sendEmail = function(){
    // postmark.send({
  //     "From": "leonard@bigbangtheory.com",
  //     "To": "sheldon@bigbangtheory.com",
  //     "Subject": "Hello from Postmark",
  //     "TextBody": "Hello!",
  //     "Tag": "big-bang"
  // }, function(error, success) {
  //     if(error) {
  //         console.error("Unable to send via postmark: " + error.message);
  //        return;
  //     }
  //     console.info("Sent to postmark for delivery")
  // });

    res.redirect('/#!/support?request=1&name=' + req.body.name)

  };


  var failRedirect = function(){

    res.redirect('/#!/support?request=1&invalid=1&name=' + req.body.name + '&email=' + req.body.email + '&phone=' + req.body.phone)
  };

  if(req.body.name && req.body.email && req.body.phone){
    var validEmail = req.body.email.split('@').length == 2;
    if (validEmail){

      sendEmail();

    } else {
      failRedirect();
    }

  } else {
    failRedirect();
  }

}
