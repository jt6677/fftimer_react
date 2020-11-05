package views

import (
	"bytes"
	"fmt"
	"html/template"
	"io"
	"net/http"
	"path/filepath"

	"github.com/jt6677/htmlTimer/timerGit/context"
)

var (
	LayoutDir   string = "views/layouts/"
	TemplateDir string = "views/"
	TemplateExt string = ".html"
)

type View struct {
	Template *template.Template
	Layout   string
}

func NewView(layout string, files ...string) *View {
	//layout is the main template to be rendered
	addTemplatePathandEtx(files)
	files = append(files, layoutGlob()...)
	t, err := template.ParseFiles(files...)
	if err != nil {
		fmt.Println(err)
	}
	layout = layout + TemplateExt
	return &View{
		Template: t,
		Layout:   layout,
	}
}
func (v *View) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	v.Render(w, r, nil)
}
func (v *View) Render(w http.ResponseWriter, r *http.Request, data interface{}) {
	w.Header().Set("Content-Type", "text/html")
	// return v.Template.ExecuteTemplate(w, v.Layout, data)

	var vd Data

	switch d := data.(type) {
	case Data:
		vd = d
		// do nothing
	default:
		vd = Data{
			Yield: data,
		}
	}
	vd.User = context.User(r.Context())
	var buf bytes.Buffer
	if err := v.Template.ExecuteTemplate(&buf, v.Layout, vd); err != nil {
		// http.Error(w, "cannot Parse template, try again", http.StatusInternalServerError)
		fmt.Println(err)
		return
	}
	io.Copy(w, &buf)

}
func layoutGlob() []string {
	files, err := (filepath.Glob(LayoutDir + "*" + TemplateExt))
	if err != nil {
		fmt.Printf("Failed to Locate layoutDir")
	}
	for _, f := range files {
		f = filepath.ToSlash(f)
	}
	return files
}

func addTemplatePathandEtx(files []string) {
	for i, f := range files {
		files[i] = filepath.ToSlash(TemplateDir + f + TemplateExt)
	}
}
