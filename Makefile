# Percolation Atlas — one-command checks and data pipeline.
#
#   make test      all four language suites
#   make bench     C++ raw benchmark -> data/raw_bench.json
#   make analyse   raw record -> data/benchmarks.json
#   make content   manifest, search index, code inventory
#   make site      content + data checks (no bundle step; the site is static)
#   make serve     local preview on :8788
#
# Requirements: Python 3.10+, Node 20+, a C++20 compiler, and Julia 1.9+
# for the Julia suite. The site itself has no build step.

PYTHON ?= python3
NODE   ?= node
JULIA  ?= julia
CXX    ?= c++
PORT   ?= 8788

.PHONY: test test-js test-py test-cpp test-julia parity parity-check parity-alg audit bench analyse content site serve package api clean

test: test-js test-py test-cpp test-julia parity-check parity-alg

test-js:
	$(NODE) --test tests/js/*.test.js

test-py:
	PYTHONPATH=lib/python $(PYTHON) -m unittest discover -s lib/python/tests -v

test-cpp:
	$(MAKE) -C lib/cpp test

test-julia:
	$(JULIA) --startup-file=no --project=lib/julia lib/julia/test/runtests.jl

parity: test-js test-py test-cpp test-julia parity-check parity-alg

parity-check:
	PYTHONPATH=lib/python $(PYTHON) scripts/parity.py

parity-alg:
	$(PYTHON) scripts/parity_algorithms.py

audit:
	$(PYTHON) scripts/verify_references.py

bench:
	mkdir -p build
	$(CXX) -O3 -std=c++20 -Wall -Wextra -o build/bench scripts/bench.cpp
	./build/bench > data/raw_bench.json

analyse:
	PYTHONPATH=lib/python $(PYTHON) scripts/analyse_bench.py

content:
	$(PYTHON) scripts/build_content.py

site: content
	@test -f data/benchmarks.json || echo "note: data/benchmarks.json missing; run 'make bench && make analyse'"

serve:
	$(PYTHON) scripts/serve.py $(PORT)

api:
	PYTHONPATH=lib/python $(PYTHON) -m percolation_atlas serve --port $(PORT)

package:
	cd lib/python && $(PYTHON) -m build --wheel --sdist --outdir ../../dist

clean:
	$(MAKE) -C lib/cpp clean
	rm -rf tmp dist
