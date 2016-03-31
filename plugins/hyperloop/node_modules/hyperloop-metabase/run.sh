#!/bin/bash

xcode_select=`xcode-select -p`
export DYLD_LIBRARY_PATH="${xcode_select}/Toolchains/XcodeDefault.xctoolchain/usr/lib"

current_dir=pwd
working_dir="$(cd "$(dirname "$0")" && pwd)"

cd $working_dir

if [ ! -f bin/metabase ];
    then ./build.sh
fi

bin/metabase $@

cd $pwd

