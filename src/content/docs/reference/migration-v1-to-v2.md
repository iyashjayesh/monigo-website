---
title: "Migration: v1 → v2"
description: Breaking changes and migration guide from MoniGo v1 to v2
---

## Breaking Changes

| v1 | v2 |
|---|---|
| `monigo.TraceFunction(fn)` | `monigo.TraceFunction(ctx, fn)` |
| `monigo.TraceFunctionWithArgs(fn, args...)` | `monigo.TraceFunctionWithArgs(ctx, fn, args...)` |
| `monigo.TraceFunctionWithReturn(fn, args...)` | `monigo.TraceFunctionWithReturn(ctx, fn, args...)` |
| `monigo.GetRuningPort()` | `monigo.GetRunningPort()` |
| `api.ViewFunctionMaetrtics` | `api.ViewFunctionMetrics` |
| `Build()` silent on errors | `Build()` panics on invalid config |

## Quick Migration Steps

### 1. Add `context.Context` to All Tracing Calls

All `TraceFunction*` methods now require `context.Context` as the first argument:

```diff
- monigo.TraceFunction(myFunc)
+ monigo.TraceFunction(ctx, myFunc)

- monigo.TraceFunctionWithArgs(myFunc, arg1, arg2)
+ monigo.TraceFunctionWithArgs(ctx, myFunc, arg1, arg2)

- monigo.TraceFunctionWithReturn(myFunc, arg1)
+ monigo.TraceFunctionWithReturn(ctx, myFunc, arg1)
```

### 2. Use `r.Context()` in HTTP Handlers

```go
func handler(w http.ResponseWriter, r *http.Request) {
    monigo.TraceFunction(r.Context(), myFunc)
}
```

### 3. Rename Typo Fixes

```diff
- monigoInstance.GetRuningPort()
+ monigoInstance.GetRunningPort()
```

### 4. Handle `Build()` Panics

`Build()` now panics if `ServiceName` is not set. Ensure your config is valid:

```go
monigoInstance := monigo.NewBuilder().
    WithServiceName("my-service").  // Required!
    Build()
```

## What's New in v2.0.0

- **context.Context support** — All tracing functions accept `context.Context`.
- **OpenTelemetry export** — Send metrics to any OTel Collector via `WithOTelEndpoint()`.
- **Structured logging** — Uses `log/slog` — configure via `WithLogLevel()` or `WithLogger()`.
- **Graceful shutdown** — SIGINT/SIGTERM triggers proper cleanup.
- **Builder validation** — `Build()` validates config at construction time.
- **Decoupled storage types** — Storage interface uses monigo-owned types (no tstorage leak).

See [CHANGELOG.md](https://github.com/iyashjayesh/monigo/blob/main/CHANGELOG.md) for the full list.
