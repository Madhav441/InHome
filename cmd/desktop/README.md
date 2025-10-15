# Desktop Agent CLI

The `cmd/desktop` directory will host the Go command-line entrypoint that wraps the reusable Windows agent library. It will eventually provide flag-based configuration for enrollment, transport selection, and command execution. For now the `agents/desktop` package demonstrates the polling and fact-reporting flow in a single binary.
