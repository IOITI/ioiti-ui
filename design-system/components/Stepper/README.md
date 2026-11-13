# Stepper

A task in steps, with `StepPanels` showing the current one; a step done can be gone back to.

**You provide** `steps` (`[{ title, description }]`), `current`, `onStepChange`; `StepPanels` with one child per step and the same `current`.

```tsx
<Stepper steps={STEPS} current={step} onStepChange={setStep} />
<StepPanels current={step}>{STEPS.map((s) => <StepForm key={s.title} step={s} />)}</StepPanels>
```

- Back and Next are buttons under the panels; the last step reviews before anything is sent.
