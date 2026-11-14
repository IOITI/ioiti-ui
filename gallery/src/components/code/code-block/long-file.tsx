import { CodeBlock } from 'ioiti-ui'

import { LATE_ORDERS_JOB } from '../../../samples/code'

const EXCERPT = `    late = Order.where(promised_at__lt=now - timedelta(days=2), reminded=False)
    for order in late:
        mailer.send(order.customer.email, template="late-order", order=order)
        order.update(reminded=True)`

export default function CodeBlockLongFile() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Taller than its room: it scrolls inside. */}
      <CodeBlock label="jobs/late_orders.py" language="python" lineNumbers maxHeight={260} code={LATE_ORDERS_JOB} />
      {/* A part of a file, numbered from where it starts; the line marked is the file's 17. */}
      <CodeBlock label="jobs/late_orders.py, lines 15 to 18" language="python" lineNumbers={15} highlightLines={[17]} code={EXCERPT} />
    </div>
  )
}
