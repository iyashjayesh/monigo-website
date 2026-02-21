---
title: Router Integration
description: Integrate MoniGo with your existing HTTP router — standard mux, Gin, Echo, and more
---

MoniGo supports integration with your existing HTTP server, allowing you to use your own router and authorization system.

## Integration Options

### 1. Full Integration (Recommended)

Register all MoniGo handlers (API + static files) to your existing mux:

```go
package main

import (
    "log"
    "net/http"
    "github.com/iyashjayesh/monigo"
)

func main() {
    monigoInstance := monigo.NewBuilder().
        WithServiceName("my-service").
        WithDataPointsSyncFrequency("5m").
        WithRetentionPeriod("7d").
        WithTimeZone("Local").
        WithCustomBaseAPIPath("/monitoring/api/v1").
        Build()

    if err := monigoInstance.Initialize(); err != nil {
        log.Fatalf("Failed to initialize MoniGo: %v", err)
    }

    mux := http.NewServeMux()

    // Register all MoniGo handlers
    monigo.RegisterDashboardHandlers(mux, "/monitoring/api/v1")

    // Add your own routes
    mux.HandleFunc("/api/users", usersHandler)
    mux.HandleFunc("/health", healthHandler)

    log.Println("Server starting on :8080")
    log.Println("MoniGo dashboard: http://localhost:8080/")

    http.ListenAndServe(":8080", mux)
}
```

### 2. API-Only Integration

Register only API endpoints (handle static files yourself):

```go
monigo.RegisterAPIHandlers(mux, "/monitoring/api/v1")

mux.Handle("/static/", http.StripPrefix("/static/",
    http.FileServer(http.Dir("./static/"))))
```

### 3. Static-Only Integration

Register only static file handlers:

```go
monigo.RegisterStaticHandlers(mux)

mux.HandleFunc("/api/metrics", customMetricsHandler)
```

### 4. Maximum Flexibility

Get handlers as a map for integration with any HTTP router:

```go
apiHandlers := monigo.GetAPIHandlers("/monitoring/api/v1")
staticHandler := monigo.GetStaticHandler()

for path, handler := range apiHandlers {
    router.Any(path, gin.WrapF(handler))
}
```

## Gin Framework

```go
package main

import (
    "log"

    "github.com/gin-gonic/gin"
    "github.com/iyashjayesh/monigo"
)

func main() {
    m := monigo.NewBuilder().
        WithServiceName("gin-service").
        WithStorageType("memory").
        Build()

    if err := m.Initialize(); err != nil {
        log.Fatalf("Failed to initialize MoniGo: %v", err)
    }

    r := gin.Default()

    apiHandlers := monigo.GetAPIHandlers("/monigo/api/v1")
    for path, handler := range apiHandlers {
        r.Any(path, gin.WrapF(handler))
    }

    staticHandler := monigo.GetStaticHandler()
    r.Any("/", gin.WrapF(staticHandler))

    r.Run(":8080")
}
```

## Echo Framework

```go
package main

import (
    "log"
    "net/http"

    "github.com/labstack/echo/v4"
    "github.com/iyashjayesh/monigo"
)

func main() {
    m := monigo.NewBuilder().
        WithServiceName("echo-service").
        WithStorageType("memory").
        Build()

    if err := m.Initialize(); err != nil {
        log.Fatalf("Failed to initialize MoniGo: %v", err)
    }

    e := echo.New()

    apiHandlers := monigo.GetAPIHandlers("/monigo/api/v1")
    for path, handler := range apiHandlers {
        e.Any(path, echo.WrapHandler(http.HandlerFunc(handler)))
    }

    staticHandler := monigo.GetStaticHandler()
    e.Any("/", echo.WrapHandler(http.HandlerFunc(staticHandler)))

    e.Start(":8080")
}
```

## Fiber Framework

```go
package main

import (
    "log"

    "github.com/gofiber/fiber/v2"
    "github.com/iyashjayesh/monigo"
)

func main() {
    m := monigo.NewBuilder().
        WithServiceName("fiber-service").
        WithStorageType("memory").
        Build()

    if err := m.Initialize(); err != nil {
        log.Fatalf("Failed to initialize MoniGo: %v", err)
    }

    app := fiber.New()
    app.All("/monigo/*", monigo.GetFiberHandler("/monigo/api/v1"))

    log.Fatal(app.Listen(":8080"))
}
```

## Unified Handler

For any framework that supports `http.Handler`, use the unified handler which combines API and static routes into a single handler:

```go
mux := http.NewServeMux()
mux.HandleFunc("/monigo/", monigo.GetUnifiedHandler("/monigo/api/v1"))
```

## Available Functions

| Function | Description |
|----------|-------------|
| `RegisterDashboardHandlers(mux, customPath)` | Register all handlers (API + static) |
| `RegisterAPIHandlers(mux, customPath)` | Register only API handlers |
| `RegisterStaticHandlers(mux)` | Register only static handlers |
| `GetAPIHandlers(customPath)` | Get API handlers as a map |
| `GetStaticHandler()` | Get static handler function |
| `GetUnifiedHandler(customPath)` | Get a single handler for all MoniGo routes |
| `GetFiberHandler(customPath)` | Get a Fiber-compatible handler |
| `Initialize()` | Initialize MoniGo without starting dashboard |
| `Shutdown(ctx)` | Graceful shutdown of MoniGo |

## Benefits

- **Unified Server** — Run MoniGo on the same port as your application.
- **Custom Authorization** — Use your existing auth system to protect MoniGo endpoints.
- **Framework Compatibility** — Works with any HTTP router (Gin, Echo, Chi, Fiber, etc.).
- **Flexible Configuration** — Choose which parts of MoniGo to integrate.
- **Graceful Shutdown** — Call `Shutdown(ctx)` for proper cleanup on exit.
