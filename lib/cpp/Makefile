# C++ edition of atlas-percolation.
#
#   make test   build and run the self-contained test harness
#   make bench  build and run the benchmark (JSON on stdout)
#   make clean  remove build artefacts
#
# Header-only library: the only translation units are the test and the bench.

CXX      ?= c++
CXXFLAGS ?= -O2 -std=c++20 -Wall -Wextra -Wpedantic
CPPFLAGS ?= -Iinclude
BUILD    := build

HEADERS := $(wildcard include/percolation_atlas/*.hpp)

.PHONY: all test bench clean

all: test bench

$(BUILD):
	mkdir -p $(BUILD)

$(BUILD)/test_main: tests/test_main.cpp $(HEADERS) | $(BUILD)
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) -o $@ tests/test_main.cpp

$(BUILD)/bench: src/bench.cpp $(HEADERS) | $(BUILD)
	$(CXX) $(CPPFLAGS) $(CXXFLAGS) -o $@ src/bench.cpp

test: $(BUILD)/test_main
	./$(BUILD)/test_main

bench: $(BUILD)/bench
	./$(BUILD)/bench

clean:
	rm -rf $(BUILD)
