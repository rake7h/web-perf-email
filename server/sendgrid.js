const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API);

const sendMail = (html, emaiTo)=>{
  const msg = {
    to: emaiTo,
    from: {
      name: "Web Performance",
      email: process.env.EMAIL_FROM // Use the email address or domain you verified above
    },
    subject: 'Web Performance Mail',
    html: html,
  };

  sgMail
  .send(msg)
  .then(() => {
    console.log('email sent');
  }, error => {
    console.error(error);
    if (error.response) {
      console.error(error.response.body)
    }
  });
}

module.exports = {sendMail}
