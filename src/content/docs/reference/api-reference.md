---
title: API Reference
description: REST API endpoints and available reports
---

## API Endpoints

Access the MoniGo API at `http://localhost:8080/monigo/api/v1/<endpoint>` (or your custom base path).

| Endpoint | Description | Method | Request | Response |
|----------|-------------|--------|---------|----------|
| `/monigo/api/v1/metrics` | Get all metrics | GET | None | JSON |
| `/monigo/api/v1/go-routines-stats` | Get goroutine stats | GET | None | JSON |
| `/monigo/api/v1/service-info` | Get service info | GET | None | JSON |
| `/monigo/api/v1/service-metrics` | Get service metrics | POST | JSON | JSON |
| `/monigo/api/v1/reports` | Get history data | POST | JSON | JSON |

:::tip
When using router integration, the API path can be customized using the `CustomBaseAPIPath` field or by passing a custom path to the registration functions.
:::

## Available Reports

All reports are downloadable in Excel format from the dashboard.

### 1. Load Statistics

| Field | Type |
|-------|------|
| `overall_load_of_service` | `float64` |
| `service_cpu_load` | `float64` |
| `service_memory_load` | `float64` |
| `system_cpu_load` | `float64` |
| `system_memory_load` | `float64` |

### 2. CPU Statistics

| Field | Type |
|-------|------|
| `total_cores` | `int` |
| `cores_used_by_service` | `int` |
| `cores_used_by_system` | `int` |

### 3. Memory Statistics

| Field | Type |
|-------|------|
| `total_system_memory` | `float64` |
| `memory_used_by_system` | `float64` |
| `memory_used_by_service` | `float64` |
| `available_memory` | `float64` |
| `gc_pause_duration` | `float64` |
| `stack_memory_usage` | `float64` |

### 4. Memory Profile

| Field | Type |
|-------|------|
| `heap_alloc_by_service` | `float64` |
| `heap_alloc_by_system` | `float64` |
| `total_alloc_by_service` | `float64` |
| `total_memory_by_os` | `float64` |

### 5. Network IO

| Field | Type |
|-------|------|
| `bytes_sent` | `float64` |
| `bytes_received` | `float64` |

### 6. Health Metrics

| Field | Type |
|-------|------|
| `service_health_percent` | `float64` |
| `system_health_percent` | `float64` |
