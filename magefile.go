// +build mage

package main

import (
	"fmt"
	"os"

	"github.com/magefile/mage/mg" // mg contains helpful utility functions, like Deps
	"github.com/magefile/mage/sh"
)

// Default target to run when none is specified
// If not set, running mage will list available targets
// var Default = Build

// A build step that requires additional params, or platform specific steps for example
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

// Manage your deps, or running package managers.
func InstallClient() error {
	fmt.Println("Installing packages for client...")
	os.Chdir("./client")
	defer os.Chdir("..")
	err := sh.Run("npm", "install")
	return err
}

func BuildClient() error {
	mg.Deps(InstallAll)
	fmt.Println("running npm run build for client...")
	os.Chdir("./client")
	defer os.Chdir("..")
	err := sh.Run("npm", "run", "build")
	return err
}

func BuildBackend() error {
	mg.Deps(BuildClient)
	fmt.Println("running npm run build for backend...")
	os.Chdir("./backend")
	defer os.Chdir("..")
	err := sh.Run("npm", "run", "build")
	return err
}

func PostBuild() error {
	var err error
	mg.Deps(BuildBackend)
	fmt.Println("running postBuild step... moving dirs around to prep for deployment...")
	err = sh.Run("cp", "-r", "./backend/graphql/types/", "./backend/dist/graphql/")
	err = sh.Run("cp", "-r", "./client/build", "./backend/")
	return err
}

// Clean up after yourself
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
