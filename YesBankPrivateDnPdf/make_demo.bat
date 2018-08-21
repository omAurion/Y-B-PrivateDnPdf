@echo off
pushd .
cd bin
ContentEncoderUtil.exe -t ..\..\build\template.html -u qwe -p qweqwe -i ..\sample_data.json -o ..\..\build\YPrivate.html
popd