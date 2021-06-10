// +build mage

package main

import (
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"strings"

	"github.com/magefile/mage/mg" // mg contains helpful utility functions, like Deps
	"github.com/magefile/mage/sh"
)

// Default target to run when none is specified
// If not set, running mage will list available targets
// var Default = Build

// Only Command needed to prep for deployment
// Will install packages, run the build for both backend and client and move
// dirs into backend so that your ready to go
func PostBuild() error {
	var err error
	mg.Deps(CheckNVM)
	mg.Deps(BuildBackend)
	fmt.Println("running postBuild step... moving dirs around to prep for deployment...")
	err = sh.Run("cp", "-r", "./backend/graphql/types/", "./backend/dist/graphql/")
	err = sh.Run("cp", "-r", "./client/build", "./backend/")
	return err
}

// runs and displays your node version. insert it without the v for now, will
// stop if it's not a match with the .nvmrc
func CheckNVM() error {
	rescueStdout := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w
	sh.Run("node", "-v") // print node version to console
	w.Close()
	out, _ := ioutil.ReadAll(r)
	os.Stdout = rescueStdout

	input := string(out[1:])                // remove the v
	input = strings.TrimSuffix(input, "\n") // remove the \n so the bytes are a match further down

	b, err := ioutil.ReadFile(".nvmrc")
	if err != nil {
		fmt.Println("err reading .nvmrc", err)
		return err
	}
	str := string(b)
	fmt.Println("Checking Node Version for match with .nvmrc", str+"=="+input+"?")

	if str != input {
		fmt.Println("You need to change your node version before continuing...")
		return errors.New("Cancel!")
	}
	return err
}

// Install packages for backend and frontend
func InstallAll() error {
	var err error
	mg.Deps(InstallClient)
	fmt.Println("Installing packages for backend...")
	os.Chdir("./backend")
	defer os.Chdir("..")
	err = sh.Run("npm", "install")
	fmt.Println("Building...")
	return err
}

// install packages for client only
func InstallClient() error {
	fmt.Println("Installing packages for client...")
	os.Chdir("./client")
	defer os.Chdir("..")
	err := sh.Run("npm", "install")
	return err
}

// build client -> will install first
func BuildClient() error {
	mg.Deps(InstallAll)
	fmt.Println("running npm run build for client...")
	os.Chdir("./client")
	defer os.Chdir("..")
	err := sh.Run("npm", "run", "build")
	return err
}

// build backend -> will install client first and backend
func BuildBackend() error {
	mg.Deps(BuildClient)
	fmt.Println("running npm run build for backend...")
	os.Chdir("./backend")
	defer os.Chdir("..")
	err := sh.Run("npm", "run", "build")
	return err
}

// Remove all node_modules from backend and client and removes build dirs and
// dist dirs
func Clean() error {
	var err error
	fmt.Println("Cleaning...")
	fmt.Println("deleteing all node_modules and build dir from client...")
	os.Chdir("./client")
	err = sh.Run("rm", "-rf", "node_modules")
	err = sh.Run("rm", "-rf", "build")
	os.Chdir("../backend")
	fmt.Println("deleteing all node_modules and dist dir from backend...")
	err = sh.Run("rm", "-rf", "node_modules")
	err = sh.Run("rm", "-rf", "dist")
	err = sh.Run("rm", "-rf", "build")
	defer os.Chdir("..")
	return err
}
