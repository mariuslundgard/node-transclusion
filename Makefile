
SRC = $(shell find lib -name "*.js" -type f)
# UGLIFY = $(shell find node_modules -name "uglifyjs" -type f)
# UGLIFY_FLAGS = --no-mangle
REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--ui tdd

test-w:
    @NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--growl \
		--ui tdd \
		--watch

benchmark:
	@node support/benchmark

transclusion.js: $(SRC)
	@node support/compile.js $^

transclusion.min.js: transclusion.js
	@$(UGLIFY) $(UGLIFY_FLAGS) $< > $@ \
		&& du -bh transclusion.js transclusion.min.js

runtime.js: lib/runtime.js
	@cat support/head.js $< support/foot.js > $@

runtime.min.js: runtime.js
	@$(UGLIFY) $(UGLIFY_FLAGS) $< > $@ \
	  && du -bh runtime.js runtime.min.js

clean:
	rm -fr build components

.PHONY: test test-w clean
