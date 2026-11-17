.PHONY: build install clean

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

clean:
	rm -rf published/agentic-pdlc.html published/agentic-pdlc.md published/agentic-pdlc.pdf published/diagrams
