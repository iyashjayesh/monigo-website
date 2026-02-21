---
title: Security
description: Protect your MoniGo dashboard and API endpoints with built-in middleware
---

MoniGo includes comprehensive security features to protect your dashboard and API endpoints in production environments.

## Built-in Middleware

### Basic Authentication

```go
monigo.BasicAuthMiddleware("username", "password")
```

### API Key Authentication

```go
monigo.APIKeyMiddleware("your-secret-api-key")
```

### IP Whitelist

```go
monigo.IPWhitelistMiddleware([]string{
    "127.0.0.1",      // IPv4 localhost
    "::1",            // IPv6 localhost
    "192.168.1.0/24", // Local network
    "10.0.0.0/8",     // Private network
})
```

### Rate Limiting

`RateLimitMiddleware` returns a middleware and a `stop` function that should be called on shutdown to release the cleanup goroutine:

```go
mw, stop := monigo.RateLimitMiddleware(100, time.Minute) // 100 requests per minute
defer stop()
```

### Request Logging

```go
monigo.LoggingMiddleware()
```

## Configuring Security

### Using Built-in Middleware

```go
mw, stop := monigo.RateLimitMiddleware(100, time.Minute)
defer stop()

monigoInstance := monigo.NewBuilder().
    WithServiceName("my-service").

    // Dashboard security (for static files)
    WithDashboardMiddleware(
        monigo.BasicAuthMiddleware("admin", "password"),
        monigo.LoggingMiddleware(),
    ).

    // API security (for API endpoints)
    WithAPIMiddleware(
        monigo.APIKeyMiddleware("api-key"),
        mw,
    ).
    Build()
```

### Using Custom Authentication

```go
monigoInstance := monigo.NewBuilder().
    WithServiceName("my-service").
    WithAuthFunction(func(r *http.Request) bool {
        return r.Header.Get("X-API-Key") == "secret-key"
    }).
    Build()
```

## Secured Handler Functions

| Function | Description |
|----------|-------------|
| `GetSecuredUnifiedHandler(m, customPath)` | Get unified handler with middleware |
| `GetSecuredAPIHandlers(m, customPath)` | Get API handlers with middleware |
| `GetSecuredStaticHandler(m)` | Get static handler with middleware |
| `StartSecuredDashboard(m)` | Start dashboard with middleware |
| `RegisterSecuredDashboardHandlers(mux, m, customPath)` | Register secured dashboard handlers |
| `RegisterSecuredAPIHandlers(mux, m, customPath)` | Register secured API handlers |
| `RegisterSecuredStaticHandlers(mux, m)` | Register secured static handlers |

## Router-Specific Handlers

```go
// Any framework supporting http.Handler
unifiedHandler := monigo.GetUnifiedHandler("/monigo/api/v1")

// Fiber Framework
fiberHandler := monigo.GetFiberHandler("/monigo/api/v1")

// Gin / Echo / Chi — use the handler map
apiHandlers := monigo.GetSecuredAPIHandlers(monigoInstance, "/monigo/api/v1")
for path, handler := range apiHandlers {
    router.Any(path, wrapFunc(handler))
}
```

## Static File Handling

MoniGo automatically bypasses authentication for static files (CSS, JS, images, etc.) to ensure the dashboard UI loads correctly.

## Quick Start with Security

```go
package main

import (
    "log"
    "time"
    "github.com/iyashjayesh/monigo"
)

func main() {
    mw, stop := monigo.RateLimitMiddleware(100, time.Minute)
    defer stop()

    monigoInstance := monigo.NewBuilder().
        WithServiceName("secure-service").
        WithDashboardMiddleware(
            monigo.BasicAuthMiddleware("admin", "secure-password"),
            monigo.LoggingMiddleware(),
        ).
        WithAPIMiddleware(mw).
        Build()

    if err := monigoInstance.Initialize(); err != nil {
        log.Fatal("Failed to initialize MoniGo:", err)
    }

    if err := monigo.StartSecuredDashboard(monigoInstance); err != nil {
        log.Fatal("Failed to start secured dashboard:", err)
    }
}
```

## Production Best Practices

1. **Use Strong Credentials** — Always use strong, unique passwords and API keys.
2. **Enable HTTPS** — Always use HTTPS in production environments.
3. **Implement Rate Limiting** — Prevent abuse with rate limiting.
4. **IP Restrictions** — Use IP whitelisting for internal networks.
5. **Request Logging** — Enable logging to monitor access patterns.
6. **Regular Rotation** — Regularly rotate API keys and passwords.
7. **Environment Variables** — Store credentials in environment variables.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Dashboard loads but CSS/JS show 401 | Static files should bypass auth automatically. Check `isStaticFile()`. |
| IP Whitelist blocking localhost | Add both `127.0.0.1` and `::1` to your whitelist. |
| API calls failing with auth errors | Ensure JavaScript is including authentication credentials. |
| Router integration not working | Use `GetUnifiedHandler`, `GetFiberHandler`, or `GetAPIHandlers` map for your framework. |
| Rate limiting too restrictive | Adjust parameters: `RateLimitMiddleware(requests, timeWindow)`. |
