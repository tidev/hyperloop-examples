#!/bin/bash

xcode_select=`xcode-select -p`
export DYLD_LIBRARY_PATH="${xcode_select}/Toolchains/XcodeDefault.xctoolchain/usr/lib"

clear

echo ""
echo "Building Hyperloop Metabase Generator"

xcodebuild clean
rm -rf build
xcodebuild -configuration Release
rm -rf bin
mkdir bin
cp build/Release/hyperloop-metabase bin/metabase
chmod a+x bin/metabase
echo ""
echo "Executable copied to the bin folder"
exit 0
