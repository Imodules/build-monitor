#!/usr/bin/env bash

version=$1

echo "Version: $version"

mkdir ${version}

mv build-monitor.tar.gz ${version}
cd ${version}

tar -xvf build-monitor.tar.gz
mkdir logs

cd ..

passenger stop
rm current
ln -s ${version} current
passenger start
