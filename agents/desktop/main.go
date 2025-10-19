package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type DeviceFacts struct {
	Hostname string            `json:"hostname"`
	OS       string            `json:"os"`
	Version  string            `json:"version"`
	Facts    map[string]string `json:"facts"`
}

type Command struct {
	ID      string                 `json:"id"`
	Name    string                 `json:"name"`
	Payload map[string]interface{} `json:"payload"`
}

func pollCommands(endpoint string) ([]Command, error) {
	resp, err := http.Get(fmt.Sprintf("%s/agent/commands", endpoint))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status: %s", resp.Status)
	}

	var commands []Command
	if err := json.NewDecoder(resp.Body).Decode(&commands); err != nil {
		return nil, err
	}
	return commands, nil
}

func reportFacts(endpoint string, facts DeviceFacts) error {
	body, err := json.Marshal(facts)
	if err != nil {
		return err
	}
	resp, err := http.Post(fmt.Sprintf("%s/agent/facts", endpoint), "application/json", bytes.NewReader(body))
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 300 {
		return fmt.Errorf("unexpected status: %s", resp.Status)
	}
	return nil
}

func main() {
	endpoint := "http://localhost:8080"
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	facts := DeviceFacts{
		Hostname: "inhome-desktop",
		OS:       "linux",
		Version:  "0.1.0",
		Facts: map[string]string{
			"arch": "amd64",
		},
	}

	if err := reportFacts(endpoint, facts); err != nil {
		fmt.Printf("failed to report facts: %v\n", err)
	}

	// Tick loop: poll command endpoint on each tick
	for range ticker.C {
		commands, err := pollCommands(endpoint)
		if err != nil {
			fmt.Printf("poll error: %v\n", err)
			continue
		}
		for _, command := range commands {
			fmt.Printf("received command %s (%s)\n", command.ID, command.Name)
		}
	}
}
