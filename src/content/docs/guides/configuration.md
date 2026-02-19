---
title: Configuration
description: Builder configuration options for MoniGo
---

MoniGo uses a **builder pattern** for configuration. All options are chained off `monigo.NewBuilder()` and finalized with `.Build()`.

## Full Builder Example

```go
monigoInstance := monigo.NewBuilder().
    WithServiceName("data-api").        // Required — identifies your service
    WithPort(8080).                     // Dashboard port (default: 8080)
    WithRetentionPeriod("4d").          // How long to keep data points
    WithDataPointsSyncFrequency("5s").  // Sync interval
    WithSamplingRate(100).              // Profile 1 in N calls
    WithStorageType("memory").          // "memory" or "disk"
    WithHeadless(false).                // true = no dashboard UI
    Build()
```

## Option Reference

| Method | Default | Description |
|--------|---------|-------------|
| `WithServiceName(name)` | *required* | Name shown in the dashboard |
| `WithPort(port)` | `8080` | HTTP port for the dashboard |
| `WithRetentionPeriod(dur)` | `"7d"` | Data retention period (e.g. `"4d"`, `"12h"`) |
| `WithDataPointsSyncFrequency(dur)` | `"5s"` | How often metrics are flushed to storage |
| `WithSamplingRate(n)` | `100` | Capture heavy profiles every *n*-th call |
| `WithStorageType(t)` | `"disk"` | `"memory"` (volatile) or `"disk"` (persistent via tstorage) |
| `WithHeadless(b)` | `false` | Run without the dashboard UI |
| `WithTimeZone(tz)` | `"Local"` | Timezone for timestamps |
| `WithCustomBaseAPIPath(p)` | `"/monigo/api/v1"` | Custom base path for API endpoints |

## OpenTelemetry Integration

Send metrics to any OTel Collector:

```go
monigoInstance := monigo.NewBuilder().
    WithServiceName("my-service").
    WithOTelEndpoint("localhost:4317").
    Build()
```

## Custom Logger

MoniGo uses `log/slog` internally. You can control the log level or bring your own logger:

```go
monigoInstance := monigo.NewBuilder().
    WithServiceName("my-service").
    WithLogLevel(slog.LevelDebug).
    // Or bring your own:
    // WithLogger(myCustomSlogLogger).
    Build()
```
