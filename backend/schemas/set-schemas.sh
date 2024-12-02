#!/bin/bash

if ! command -v mongosh &> /dev/null
then
    echo "mongosh could not be found"
    exit
fi

mongosh "./user.js" # create user schema / collection
mongosh "./meeting.js" # create meeting schema / collection
mongosh "./poll.js" # create poll schema / collection
mongosh "./request.js" # create request schema / collection
