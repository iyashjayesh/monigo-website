---
title: Upgrading
description: What changed between older MoniGo releases and the current one, and what you need to edit.
---

If you are on a MoniGo release older than v1.3.0, the API has moved underneath
you. This page lists what changed and what you have to edit.

:::note[There is no v2]
Earlier versions of these docs described the changes below as a "v2.0.0"
release. That version was tagged but never published — the tag is missing the
`/v2` module path Go requires, so `go get` cannot resolve it. Everything here
shipped in the **v1** line instead, and `@latest` gives you all of it.

See the [changelog](/monigo-website/reference/changelog/) for what landed in
which release.
:::

```bash
go get github.com/iyashjayesh/monigo@latest
```

## Breaking changes

| Older releases | Current |
|---|---|
| `monigo.TraceFunction(fn)` | `monigo.TraceFunction(ctx, fn)` |
| `monigo.TraceFunctionWithArgs(fn, args...)` | `monigo.TraceFunctionWithArgs(ctx, fn, args...)` |
| `monigo.TraceFunctionWithReturn(fn, args...)` | `monigo.TraceFunctionWithReturn(ctx, fn, args...)` |
| `monigo.TraceFunctionWithReturns(fn, args...)` | `monigo.TraceFunctionWithReturns(ctx, fn, args...)` |
| `monigo.GetRuningPort()` | `monigo.GetRunningPort()` |
| `api.ViewFunctionMaetrtics` | `api.ViewFunctionMetrics` |
| `Build()` silent on errors | `Build()` panics on invalid config |
| API accepts any HTTP method | API enforces GET/POST - wrong method returns 405 |
| `log.Printf` logging | Structured logging via `log/slog` |
| Data purged on startup | Historical data preserved across restarts |
| `http.DefaultServeMux` used internally | Dedicated `http.ServeMux` per instance |

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

`Build()` now panics if `ServiceName` is not set or config is invalid (bad port, invalid storage type). Ensure your config is valid:

```go
monigoInstance := monigo.NewBuilder().
    WithServiceName("my-service").  // Required!
    Build()
```

### 5. Update Logging Configuration

Replace any `log.Printf` tuning with structured logging:

```go
monigoInstance := monigo.NewBuilder().
    WithServiceName("my-service").
    WithLogLevel(slog.LevelInfo).   // or slog.LevelDebug, slog.LevelWarn
    Build()
```

### 6. Add Graceful Shutdown

Current releases handle SIGINT/SIGTERM automatically when using `Start()`. For manual control:

```go
if err := monigoInstance.Shutdown(ctx); err != nil {
    log.Printf("shutdown error: %v", err)
}
```

## Everything that changed

The per-release detail lives on the [changelog](/monigo-website/reference/changelog/),
generated from the library's own `CHANGELOG.md` so it cannot drift from what
was actually released.
