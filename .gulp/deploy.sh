#!/usr/bin/env bash

version=$1

echo "Version: $version"

mkdir ${version}
cd ${version}

mv build-monitor.tar.gz ${version}
cd ${version}

tar -xvf build-monitor.tar.gz

cd ..

passenger stop
rm current
ln -s ${version} current
passenger start
