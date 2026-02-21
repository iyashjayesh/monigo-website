---
title: Installation & Quick Start
description: How to install MoniGo and get started in minutes
---

## Installation

```bash
go get github.com/iyashjayesh/monigo@latest
```

:::tip
**Recommended Initialization**: The `monigo.NewBuilder()` pattern is the recommended way to initialize MoniGo. If you encounter `undefined: monigo.NewBuilder`, ensure you have upgraded to the latest version using the command above.
:::

## Quick Start

```go
package main

import (
    "log"
    "math"
    "net/http"

    "github.com/iyashjayesh/monigo"
)

func main() {
    monigoInstance := monigo.NewBuilder().
        WithServiceName("data-api").
        WithPort(8080).
        WithRetentionPeriod("4d").
        WithDataPointsSyncFrequency("5s").
        WithSamplingRate(100).
        WithStorageType("memory").
        WithHeadless(false).
        Build()

    go func() {
        if err := monigoInstance.Start(); err != nil {
            log.Fatalf("Failed to start MoniGo: %v", err)
        }
    }()
    log.Printf("Monigo dashboard started at port %d\n", monigoInstance.GetRunningPort())

    http.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
        monigo.TraceFunction(r.Context(), highCPUUsage)
        w.Write([]byte("done"))
    })

    log.Fatal(http.ListenAndServe(":8000", nil))
}

func highCPUUsage() {
    var sum float64
    for i := 0; i < 1e8; i++ {
        sum += math.Sqrt(float64(i))
    }
}
```

By default, the dashboard will be available at `http://localhost:8080/` (or the port you configured).

## Graceful Shutdown

MoniGo automatically handles SIGINT/SIGTERM when you use `Start()`. For manual control over shutdown (e.g. in tests or custom orchestration), use `Shutdown`:

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

if err := monigoInstance.Shutdown(ctx); err != nil {
    log.Printf("MoniGo shutdown error: %v", err)
}
```
