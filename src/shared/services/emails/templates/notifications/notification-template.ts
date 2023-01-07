import { INotificationTemplate } from '@notification/interfaces/notification.interface'
import fs from 'fs'
import ejs from 'ejs'

class NotificationTemplate {
  public notificationMessageTemplate(templateParams: INotificationTemplate): string {
    const { username, header, message } = templateParams
    return ejs.render(fs.readFileSync(__dirname + '/notification-template.ejs', 'utf8'), {
      username,
      header,
      message,
      image_url:
        'https://w7.pngwing.com/pngs/30/252/png-transparent-computer-icons-password-strength-padlock-text-technic-symbol.png'
    })
  }
}

export const notificationTemplate: NotificationTemplate = new NotificationTemplate()
