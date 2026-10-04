# UMBREL shared numerical budget

User-approved first umbrella stage. Original 35-child order/algorithms retained, now sequentially pass remaining iterations and elapsed-duration allowance. Stop launching children after global cap; aggregation includes executed parts only. Exhaustion reports DEAD/max-iterations or time-limit and unexecuted child count. durationMs is whole UMBREL elapsed time, not sum of child timings. Partial numerical output retained, completed=false on cap. Input sequence copied for children.

Finite positive iteration budget and finite nonnegative time budget required; zero time yields no child execution. These are best-effort synchronous Date.now checks, not hard process timeout/OS sandbox. Budget validation occurs after blocked-status handling; direct runtime still normalizes/floors fractional values. No upper input/sequence limits added to direct API; future dispatcher schema required. Numeric accuracy/overflow unchanged.

Intentional behavior change: maxIterations is total across children, not per child. Existing test that expected NIK warning after FOR consumed cap now asserts only one child ran and no fabricated NIK warning. All other runner tests retained. New tests cover caps1/2/3/10/100, zero-time, invalid budgets and blocked state. Full platform build/CI/Preview/JVM unverified.

DURMITOR embeds changed UMBREL but still creates separate own guard; its whole nested budget not fixed here. UMBREL/DURMITOR remain disabled in VRH profiles; no blanket enablement. Human review and consumer review needed for changed trace count/timing/aggregate under small caps. Rollback restores old per-child multiplication risk. No route, dependency/config/workflow, production or payment operations.
