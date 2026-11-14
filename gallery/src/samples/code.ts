// The code category's sample files: a rule in TOML, a configuration in YAML, a Python job, a job's output.

/** A rule of the order checks, as it is saved. */
export const RULE = `[metadata]
created = "2026/10/02"
maturity = "production"

[rule]
name = "Large order from a new customer"
risk_score = 47
severity = "medium"
tags = ["Domain: Orders", "Check: Payment"]
query = '''
order.total > 2000 and customer.orders == 0
'''
`

/** The same rule, edited: a higher score, a tag more. */
export const RULE_EDITED = RULE.replace('risk_score = 47', 'risk_score = 73')
  .replace('severity = "medium"', 'severity = "high"')
  .replace('"Check: Payment"]', '"Check: Payment", "Check: Address"]')

/** A customer's environments. */
export const ENVIRONMENTS = `# The customer's environments
customer: "1024"
name: Alpha Industries
environments:
  - &sandbox sandbox
  - production
spaces:
  sandbox: *sandbox
  production: analyst
note: |
  Deployed by the platform team;
  production needs a maintainer.
`

/** What the edit changed, as a unified diff. */
export const RULE_DIFF = `diff --git a/rules/large_order.toml b/rules/large_order.toml
--- a/rules/large_order.toml
+++ b/rules/large_order.toml
@@ -6,3 +6,3 @@ [rule]
 name = "Large order from a new customer"
-risk_score = 47
-severity = "medium"
+risk_score = 73
+severity = "high"`

/** A job that runs every working morning. */
export const LATE_ORDERS_JOB = `# Reminds each customer whose order is two days late, once.
from datetime import timedelta

from . import Order, mailer, register_job


@register_job(
    id="0ea98fa0-6f1e-4a3b-9c51-0d1f6b2a7c11",
    name="late_order_reminders",
    schedule="0 9 * * 1-5",
    retries=3,
)
def main(now):
    """Send each late order's customer one reminder."""
    late = Order.where(promised_at__lt=now - timedelta(days=2), reminded=False)
    for order in late:
        mailer.send(order.customer.email, template="late-order", order=order)
        order.update(reminded=True)
    return len(late)


def preview(now):
    """The orders main() would remind, without sending anything."""
    return [order.id for order in Order.where(promised_at__lt=now - timedelta(days=2), reminded=False)]
`

/** A deploy's output, a line at a time. */
export const DEPLOY_OUTPUT = [
  'INFO  Loading rules and configurations …',
  'INFO  Parsed 4133 TOML files in 3.17s',
  'step  build customer 1024 (sandbox)',
  'WARN  rule 7f2c… is deprecated: kept out of the package',
  'step  writing dist/1024-sandbox/rules.ndjson',
  'step  upload to https://api.example.test/s/sandbox',
  'ERROR the API answered 409: rule 0b9e… exists with another version',
  'step  retrying with overwrite',
  'INFO  Uploaded 214 rules, 3 exception lists',
  'done  in 41 s',
]
