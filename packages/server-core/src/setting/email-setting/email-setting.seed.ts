export const emailSeed = {
  path: 'email-setting',
  templates: [
    {
      smtp: JSON.stringify({
        host: process.env.SMTP_HOST || 'test',
        port: parseInt(process.env.SMTP_PORT!) || 'test',
        secure: process.env.SMTP_SECURE === 'true' || true,
        auth: JSON.stringify({
          user: process.env.SMTP_USER || 'test',
          pass: process.env.SMTP_PASS || 'test'
        })
      }),
      // Name and email of default sender (for login emails, etc)
      from: `${process.env.SMTP_FROM_NAME}` + ` <${process.env.SMTP_FROM_EMAIL}>` || 'test',
      subject: JSON.stringify({
        // Subject of the Login Link email
        login: 'Ethereal Engine login link',
        friend: 'Ethereal Engine friend request',
        group: 'Ethereal Engine group invitation',
        party: 'Ethereal Engine party invitation'
      }),
      smsNameCharacterLimit: 20
    }
  ]
}
