# StatusBadge

The state of something running, as a health check reports it: always a word beside its colour.

**You provide** `status` (`ok` · `warning` · `down` · `unknown` · `disabled`); `label` to say it in other words.

```tsx
<StatusBadge status={service.health} />
```

- The words are Up, Degraded, Down, Unknown, Disabled, in IoitiProvider's language (`useMessages().status`; `HEALTH_STATUS_LABEL`, English's, is deprecated). A live state has its dot; disabled has none.
