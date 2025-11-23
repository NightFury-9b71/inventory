#!/bin/bash
docker build -t inventory-backend .
sudo docker run --network host inventory-backend