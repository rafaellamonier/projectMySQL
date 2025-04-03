#!/bin/bash

cd ../../images
 
for filename in *.png; do
  rm "$filename"
done

for filename_2 in *.jpg; do
  rm "$filename_2"
done
