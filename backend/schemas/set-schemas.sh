#!/bin/bash

# Get directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if we're in schemas directory, if not cd into it
if [[ "${PWD##*/}" != "schemas" ]]; then
    cd "$SCRIPT_DIR" || exit 1
fi

# Check if mongosh is installed
if ! command -v mongosh &> /dev/null
then
    echo "mongosh could not be found"
    exit 1
fi

# Check if MongoDB is running
if ! mongosh --eval "db.adminCommand('ping')" &> /dev/null
then
    echo "MongoDB is not running"
    exit 1
fi

# Check if Bookedin database exists
# if mongosh --eval "db = db.getSiblingDB('Bookedin'); db.adminCommand('listCollections')" &> /dev/null
# then
#     echo "Bookedin database already exists"
#     exit 1
# fi

# If all checks pass, proceed with schema creation
mongosh "./user.js" # create user schema / collection
mongosh "./meeting.js" # create meeting schema / collection
mongosh "./poll.js" # create poll schema / collection
mongosh "./request.js" # create request schema / collection
