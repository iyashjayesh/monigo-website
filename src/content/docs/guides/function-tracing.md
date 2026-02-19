---
title: Function Tracing
description: Trace any Go function with adaptive sampling and zero-overhead profiling
---

MoniGo provides powerful function tracing capabilities to monitor the performance of your application functions. You can trace functions with any signature, including those with parameters and return values.

## Available Tracing Methods

### 1. TraceFunction (No Parameters)

The simplest method for tracing functions without parameters:

```go
func apiHandler(w http.ResponseWriter, r *http.Request) {
    monigo.TraceFunction(r.Context(), highMemoryUsage)
    w.Write([]byte("API1 response"))
}

func highMemoryUsage() {
    largeSlice := make([]float64, 1e8)
    for i := 0; i < len(largeSlice); i++ {
        largeSlice[i] = float64(i)
    }
}
```

### 2. TraceFunctionWithArgs (With Parameters)

Trace functions that take parameters:

```go
func processUser(userID string, userName string) {
    time.Sleep(100 * time.Millisecond)
    _ = make([]byte, 1024*1024)
}

func userHandler(w http.ResponseWriter, r *http.Request) {
    userID := r.URL.Query().Get("id")
    userName := r.URL.Query().Get("name")

    monigo.TraceFunctionWithArgs(r.Context(), processUser, userID, userName)
    w.Write([]byte("User processed"))
}
```

### 3. TraceFunctionWithReturn (Single Return Value)

Trace functions that return a single value:

```go
func calculateTotal(items []Item) float64 {
    var total float64
    for _, item := range items {
        total += item.Price
    }
    return total
}

func calculateHandler(w http.ResponseWriter, r *http.Request) {
    items := []Item{
        {Name: "Laptop", Price: 999.99},
        {Name: "Mouse", Price: 29.99},
    }

    total := monigo.TraceFunctionWithReturn(r.Context(), calculateTotal, items).(float64)
    w.Write([]byte(fmt.Sprintf("Total: $%.2f", total)))
}
```

### 4. TraceFunctionWithReturns (Multiple Return Values)

Trace functions that return multiple values:

```go
func processData(data string) (Result, error) {
    if data == "error" {
        return Result{}, fmt.Errorf("processing error")
    }
    return Result{Success: true, Message: "OK"}, nil
}

func processHandler(w http.ResponseWriter, r *http.Request) {
    results := monigo.TraceFunctionWithReturns(r.Context(), processData, "test-data")

    if len(results) >= 2 {
        result := results[0].(Result)
        err := results[1].(error)

        if err != nil {
            w.WriteHeader(http.StatusInternalServerError)
            w.Write([]byte(fmt.Sprintf("Error: %v", err)))
            return
        }
        w.Write([]byte(fmt.Sprintf("Result: %+v", result)))
    }
}
```

## Adaptive Sampling

MoniGo implements **Adaptive Sampling** to ensure production-grade performance. By default, heavy profiling (CPU and Heap profiles) is only performed for **1 in every 100 calls**. Lightweight metrics (duration and concurrency) are still captured for every call.

Configure the sampling rate via the builder:

```go
monigoInstance := monigo.NewBuilder().
    WithSamplingRate(10). // Profile 1 in 10 calls
    Build()
```

Or globally at runtime:

```go
monigo.SetSamplingRate(1000)
```

## Function Name Generation

The enhanced tracing methods automatically generate descriptive function names that include:

- **Function name**
- **Parameter types**: `functionName(string,int)`
- **Return types**: `functionName(string,int)->(float64,error)`

This makes it easier to identify and analyze specific function calls in the dashboard.

## Handling Multiple Return Values

| Approach | Method | Description |
|----------|--------|-------------|
| All values | `TraceFunctionWithReturns` | Returns `[]interface{}` with all return values |
| First only | `TraceFunctionWithReturn` | Returns only the first return value |

### Example: Switch on Return Count

```go
results := monigo.TraceFunctionWithReturns(ctx, myFunction, args...)

switch len(results) {
case 0:
    // Function returns nothing
case 1:
    value := results[0]
case 2:
    value := results[0]
    err := results[1].(error)
default:
    // Handle many returns
}
```

## Benefits

- **Zero Overhead in Hot Paths** — Non-sampled calls have sub-millisecond overhead.
- **Cleaner Code** — No need to wrap functions in anonymous functions.
- **Better Function Identification** — Actual function names appear in metrics.
- **Type Safety** — Compile-time checking of function signatures.
- **Backward Compatibility** — Existing code continues to work without changes.
