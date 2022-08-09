# ...
.PHONY: deploy
deploy:
	cargo +nightly contract build

.PHONY: test
test:
	cargo +nightly test

.PHONY: run-js
run-js:
	yarn build
