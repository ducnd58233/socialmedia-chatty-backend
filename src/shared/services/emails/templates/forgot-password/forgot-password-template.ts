import fs from 'fs'
import ejs from 'ejs'

class ForgotPasswordTemplate {
  public passwordResetTemplate(username: string, resetLink: string): string {
    return ejs.render(fs.readFileSync(__dirname + '/forgot-password-template.ejs', 'utf8'), {
      username,
      resetLink,
      image_url:
        'https://w7.pngwing.com/pngs/30/252/png-transparent-computer-icons-password-strength-padlock-text-technic-symbol.png'
    })
  }
}

export const forgotPasswordTemplate: ForgotPasswordTemplate = new ForgotPasswordTemplate()
