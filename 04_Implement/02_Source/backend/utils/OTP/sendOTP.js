const nodemailer = require('nodemailer')

const sendOTPCode = (email, fullName, otpCode, typeVerify) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		// host: 'smtp.gmail.com',
		auth: {
			user: 'eightbank2406@gmail.com',
			pass: 'EIGHTbank2406',
		},
	})

	let html, subject

	switch (typeVerify) {
	case 'transfer':
		subject = `${otpCode} is your transaction confirm code at Eight bank`
		html = `
    <div
    style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      width: 100%;
    "
  >
    <div
      style="
        max-width: 450px;
        max-height: 570px;
        padding: 36px 24px;
        background: linear-gradient(180deg, #2b2e34 0%, #16181c 100%);
        color: #fff;
        border-radius: 16px;
        margin: auto;
      "
    >
    <img src="https://i.ibb.co/w0CNFNB/Logo.png" alt="" border="0">
    <div style="height:16px"></div>
      <p style="margin: 0; padding-top: 16px; font-size: 16px;border-top: 1px solid #7C7F87;">
        Hi, ${fullName}
      </p>
      <p
        style="
          margin: 0;
          padding-top: 16px;
          padding-bottom: 16px;
          font-size: 16px;
        "
      >
      We received a request to confirm your Eight transaction. Enter the
      following transaction confirm code:
      </p>
      <p
        style="
          font-size: 16px;
          margin: 0;
          background-color: #111111;
          padding: 16px 24px;
          width: fit-content;
          border-bottom: 1px solid #7c7f87;
        "
      >
        ${otpCode}
      </p>
    </div>
  </div>`
		break
	case 'forgotPassword':
		subject = `${otpCode} is your Eight account recovery code`
		html = `
    <div
      style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        width: 100%;
      "
    >
      <div
        style="
          max-width: 450px;
          max-height: 570px;
          padding: 36px 24px;
          background: linear-gradient(180deg, #2b2e34 0%, #16181c 100%);
          color: #fff;
          border-radius: 16px;
          margin: auto;
        "
      >
      <img src="https://i.ibb.co/w0CNFNB/Logo.png" alt="Logo" border="0">
      <div style="height:16px"></div>
        <p style="margin: 0; padding-top: 16px; font-size: 16px;border-top: 1px solid #7C7F87;">
          Hi, ${fullName}
        </p>
        <p
          style="
            margin: 0;
            padding-top: 16px;
            padding-bottom: 16px;
            font-size: 16px;
          "
        >
          We received a request to reset your Eight password. Enter the
          following password reset code:
        </p>
        <p
          style="
            font-size: 16px;
            margin: 0;
            background-color: #111111;
            padding: 16px 24px;
            width: fit-content;
            border-bottom: 1px solid #7c7f87;
          "
        >
          ${otpCode}
        </p>
      </div>
    </div>`
		break
	default:
		break
	}

	const mailOptions = {
		from: 'Eight Bank. <eightbank2406@gmail.com>',
		to: email,
		subject,
		html,
	}

	transporter.sendMail(mailOptions, (err) => {
		if (err) {
			console.log(err)
		}
	})
}

module.exports = { sendOTPCode }
