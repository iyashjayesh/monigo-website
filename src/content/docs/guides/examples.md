---
title: Examples
description: Example applications demonstrating MoniGo usage
---

Check out the complete examples in the [`example/`](https://github.com/iyashjayesh/monigo/tree/main/example) directory of the MoniGo repository.

## Router Integration Examples

- [`example/router-integration/`](https://github.com/iyashjayesh/monigo/tree/main/example/router-integration/) — Standard HTTP mux integration
- [`example/api-only-integration/`](https://github.com/iyashjayesh/monigo/tree/main/example/api-only-integration/) — API-only integration

## Framework Integration Examples

- [`example/gin-integration/`](https://github.com/iyashjayesh/monigo/tree/main/example/gin-integration/) — Gin framework integration
- [`example/echo-integration/`](https://github.com/iyashjayesh/monigo/tree/main/example/echo-integration/) — Echo framework integration

## Security Examples

Located in [`example/security-examples/`](https://github.com/iyashjayesh/monigo/tree/main/example/security-examples/):

### Core Security

- **Basic Authentication** (`basic-auth/`) — HTTP Basic Auth with rate limiting
- **API Key Authentication** (`api-key/`) — API key via header or query parameter
- **IP Whitelist** (`ip-whitelist-example/`) — IP-based access control with debug logging
- **Custom Authentication** (`custom-auth/`) — Custom auth function with headers / query params

### Framework Security

- **Gin** (`gin/`) — Gin framework with security middleware
- **Echo** (`echo/`) — Echo framework with security middleware
- **Fiber** (`fiber/`) — Fiber framework with security middleware
- **Chi** (`chi/`) — Chi router with security middleware

## Running Examples

Each example has its own `go.mod` file and can be run independently:

```bash
# Basic example
cd example/router-integration
go run .

# Security example
cd example/security-examples/basic-auth
go run .

# Framework example
cd example/security-examples/gin
go run .
```

## Example Access URLs

| Example | URL | Credentials |
|---------|-----|-------------|
| Basic Auth | `http://localhost:8080/` | `admin` / `monigo-secure-2024` |
| API Key | `http://localhost:8080/?api_key=monigo-secret-key-2024` | — |
| IP Whitelist | `http://localhost:8080/` | localhost only |
| Custom Auth | `http://localhost:8080/?secret=monigo-admin-secret` | — |
