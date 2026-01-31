#!/bin/bash
# Script to run backend tests

cd backend
python -m unittest discover tests
