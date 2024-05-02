#!/bin/sh
cd hass || exit
rm ./reference.tar.gz
tar -czvf ./reference.tar.gz ./config
