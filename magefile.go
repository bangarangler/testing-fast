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

// Docker build backend
func DockerBuildBackendDev() error {
	mg.Deps(DockerBuildClientDev)
	fmt.Println("docker build backend")
	os.Chdir("./backend")
	defer os.Chdir("..")
	err := sh.Run("docker", "build", "-t", "fastify-backend", ".")
	return err
}

// Docker build backend
func DockerBuildClientDev() error {
	fmt.Println("docker build client")
	os.Chdir("./client")
	defer os.Chdir("..")
	err := sh.Run("docker", "build", "-t", "fastify-client", ".")
	return err
}

// Docker Compose Up
func UpDev() error {
	fmt.Println("Spinning up project local...")
	err := sh.Run("ENV=local", "docker-compose", "-f", "docker-compose-dev.yml", "up", "-d")
	return err
}

// Docker Compose Up Prod
func UpProd() error {
	fmt.Println("Spinning up project prod...")
	err := sh.Run("ENV=prod", "docker-compose", "-f", "docker-compose-prod.yml", "up", "-d")
	return err
}

// Docker Compose Up Local
func UpLocal() error {
	fmt.Println("Spinning up project local...")
	err := sh.Run("ENV=local docker-compose", "-f", "docker-compose-prod.yml", "up", "-d")
	return err
}

// Docker Compose Down Local
func Down() error {
	fmt.Println("Spinning down project...")
	err := sh.Run("docker-compose", "down")
	return err
}

// Docker Compose Down Local
func DownLocal() error {
	fmt.Println("Spinning down project local...")
	err := sh.Run("docker-compose", "-f", "docker-compose-prod.yml", "down")
	return err
}

// Docker build backend production
func DockerBuildBackendProd() error {
	mg.Deps(DockerBuildClientProd)
	fmt.Println("docker build backend production...")
	os.Chdir("./backend")
	defer os.Chdir("..")
	err := sh.Run("docker", "build", "-t", "fastify-backend-prod:prod", "-f", "Dockerfile.prod", ".")
	return err
}

// Docker build client production
func DockerBuildClientProd() error {
	fmt.Println("docker build client production...")
	os.Chdir("./client")
	defer os.Chdir("..")
	err := sh.Run("docker", "build", "-t", "fastify-frontend-prod:prod", "--build-arg", "CADDYFILE=./client/CADDYFILE.prod", "--build-arg", "BASE_URL=https://hydra.nowigence.ai/api", "-f", "Dockerfile.prod", ".")
	return err
}

// Docker build client production:local
func LocalDockerBuildClientProd() error {
	fmt.Println("docker build client production:local...")
	os.Chdir("./client")
	defer os.Chdir("..")
	err := sh.Run("docker", "build", "-t", "bangarangler/fastify-frontend-prod:local", "--build-arg", "CADDYFILE=Caddyfile.local", "--build-arg", "BASE_URL=http://localhost:5000/api", "-f", "Dockerfile.prod", ".")
	return err
}

// Docker build backend production:local
func LocalDockerBuildBackendProd() error {
	mg.Deps(LocalDockerBuildClientProd)
	fmt.Println("docker build backend production:local...")
	os.Chdir("./backend")
	defer os.Chdir("..")
	err := sh.Run("docker", "build", "-t", "bangarangler/fastify-backend-prod:local", "-f", "Dockerfile.prod", ".")
	return err
}
