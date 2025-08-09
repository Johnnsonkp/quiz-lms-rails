#!/bin/bash

# Script: clean_rails_pids.sh
# Purpose: Check and delete Rails PID files after safely stopping the server

APP_DIR="/path/to/your/rails/app"
PID_DIR="$APP_DIR/tmp/pids"
SERVER_PID_FILE="$PID_DIR/server.pid"

echo "=== Rails PID Cleanup Script ==="

# Step 1: Check if Rails server PID file exists
if [ -f "$SERVER_PID_FILE" ]; then
    SERVER_PID=$(cat "$SERVER_PID_FILE")
    echo "Found Rails server PID file with PID: $SERVER_PID"

    # Step 2: Check if process is running
    if ps -p $SERVER_PID > /dev/null; then
        echo "Rails server process is running. Stopping..."
        kill -TERM $SERVER_PID
        sleep 2

        if ps -p $SERVER_PID > /dev/null; then
            echo "Process still alive. Force killing..."
            kill -9 $SERVER_PID
        fi
    else
        echo "No active process found for PID $SERVER_PID."
    fi

    # Step 3: Delete PID file
    echo "Removing PID file..."
    rm -f "$SERVER_PID_FILE"
else
    echo "No Rails server PID file found."
fi

# Step 4: Show remaining Rails-related processes (optional)
echo "Remaining Rails processes:"
ps aux | grep '[r]ails'

echo "✅ PID cleanup complete."
