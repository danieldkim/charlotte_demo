#!/bin/sh

cp ../node/views/boot.js ./www/
if [ ! -d ./www/lib ] ; then
  mkdir ./www/lib
fi
cp ../node/views/lib/{underscore.js,async.js,zepto.js}  ./www/lib/; 
if [ ! -d ./www/lib/charlotte ] ; then
  mkdir ./www/lib/charlotte
fi
cp ../node/views/lib/charlotte/*  ./www/lib/charlotte/