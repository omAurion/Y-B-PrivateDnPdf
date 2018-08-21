#!/usr/bin/env bash

pushd .
cd bin
mono ContentEncoderUtil.exe -t ../../build/template.html -u qwe -p qweqwe -i ../sample_data.json -o ../../build/index.html
popd