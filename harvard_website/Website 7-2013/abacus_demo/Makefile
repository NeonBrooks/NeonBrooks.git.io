DEPLOY_DIR = $(WEBDOCS)/SILC/demo/neon/abacus

.PHONY: build deploy

SOURCES := $(wildcard src/*.coffee)

build: $(SOURCES)
	coffee -co lib/ src/
	@echo "coffee sources were compiled"

FILES = index.html abacus.js

deploy: $(FILES)
	rsync -r --exclude=.git $(FILES) $(DEPLOY_DIR)
	@echo "files copied to $(DEPLOY_DIR)"
