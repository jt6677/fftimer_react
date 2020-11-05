package main

import (
	"fmt"
	"regexp"
)

func main() {
	r := regexp.MustCompile(`^(202[0-9])+(0[1-9]|1[0-2])+(0[1-9]|1[0-9]|2[0-9]|3[0-1])$`)

	xx := "2020011"

	if !r.MatchString(xx) {
		fmt.Println("Failed")
	}
	// fmt.Println("NIGGER")
}
