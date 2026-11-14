import { LogViewer } from 'ioiti-ui'

// A line's level is read from its words: an error, a warning, info, a traceback.
const OUTPUT = `2026-10-28 09:30:01 INFO  late_order_reminders started (schedule 0 9 * * 1-5)
2026-10-28 09:30:01 INFO  42 orders are two days late or more
2026-10-28 09:30:02 WARN  order IT-0988 has no email address: skipped, and listed for the support team to call the customer instead
2026-10-28 09:30:04 INFO  sent 40 reminders
2026-10-28 09:30:05 ERROR mailer answered 503 for IT-1017
Traceback (most recent call last):
  File "jobs/late_orders.py", line 17, in main
    mailer.send(order.customer.email, template="late-order", order=order)
  File "mail/client.py", line 88, in send
    raise MailerUnavailable(response.status)
mail.client.MailerUnavailable: 503
2026-10-28 09:30:05 INFO  retrying IT-1017 in 60 s (1 of 3)
2026-10-28 09:31:05 INFO  sent IT-1017
2026-10-28 09:31:05 INFO  done: 41 reminders, 1 skipped`

export default function LogViewerLevels() {
  // The whole text at once (a finished job), its long lines wrapped from the start.
  return <LogViewer label="late_order_reminders, 28 October" text={OUTPUT} height={300} defaultWrap downloadName="late-orders-2026-10-28.log" />
}
