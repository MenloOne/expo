#!/usr/bin/env bash
solidity_flattener --solc-paths=menlo-token=$(pwd)/node_modules/menlo-token contracts.src/Forum.sol --out contracts/Forum.sol

