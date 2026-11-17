.PHONY: build install clean help

# Diagram source: excalidraw (default; Mermaid for diagrams with no Excalidraw version) or mermaid
DIAGRAMS ?= excalidraw

# One command: install dependencies if needed, then build published/agentic-pdlc.pdf
build: node_modules
	npm run build -- --diagrams=$(DIAGRAMS)

node_modules: package.json
	npm install
	npx playwright install chromium
	@touch node_modules

install: node_modules

help:
	@node tools/build-pdf.mjs --help

# Removes the per-run build folders (the latest PDFs in published/ stay)
clean:
	rm -rf published/builds
