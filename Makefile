install-client:
	cd ./client && npm install

install-backend:
	cd ./backend && npm install

postBuild:
	cp -r ./backend/graphql/types/ ./backend/dist/graphql/
	cp -r ./client/build/ ./backend/
