package main

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	rnt "runtime"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) SaveAs(text string) (path string, err error) {
	result, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title: "Save your file",
	})

	if err != nil {
		return "", err
	}

	if result == "" {
		return "", fmt.Errorf("no folder selected")
	}

	err = os.WriteFile(result, []byte(text), 0644)
	if err != nil {
		return "", err
	}

	// Save the text to a file or perform any other action
	fmt.Println("Saving text:", text)

	return result, nil
}

func (a *App) Save(text string, path string) (string, error) {
	_, err := os.Stat(path)
	if err != nil {
		return a.SaveAs(text)
	}

	err = os.WriteFile(path, []byte(text), 0644)
	if err != nil {
		return "", err
	}

	return path, nil
}

type FileData struct {
	Text string `json:"text"`
	Path string `json:"path"`
}

func (a *App) Open() (data *FileData, err error) {
	result, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Open your file",
	})

	if err != nil {
		return nil, err
	}

	if result == "" {
		return nil, fmt.Errorf("no folder selected")
	}

	info, err := os.ReadFile(result)
	if err != nil {
		return nil, err
	}

	return &FileData{
		Text: string(info),
		Path: result,
	}, nil
}

func (a *App) OpenFolder(path string) error {
	path = strings.ReplaceAll(path, "\\", "/")
	folder := filepath.Dir(path)

	fmt.Println("Opening folder:", folder)

	switch rnt.GOOS {
	case "windows":
		folder = strings.ReplaceAll(folder, "/", "\\")
		cmd := exec.Command("explorer", folder)
		return cmd.Start()
	case "darwin":
		cmd := exec.Command("open", folder)
		return cmd.Start()
	case "linux":
		cmd := exec.Command("xdg-open", folder)
		return cmd.Start()
	default:
		return fmt.Errorf("unsupported platform")
	}
}
