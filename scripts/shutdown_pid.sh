#!/bin/bash

# Script: clean_rails_pids.sh
# Purpose: Stop Rails processes on specified ports and delete Rails PID files

APP_DIR="/Users/johnnsonkp/projects/rails-projects/quiz-lms" 
PID_DIR="$APP_DIR/tmp/pids"
SERVER_PID_FILE="$PID_DIR/server.pid"
PORTS=("3000" "3100")

echo "=== Rails PID Cleanup Script ==="

# Step 1: Handle Rails server PID file
if [ -f "$SERVER_PID_FILE" ]; then
    SERVER_PID=$(cat "$SERVER_PID_FILE")
    echo "Found Rails server PID file with PID: $SERVER_PID"

    if ps -p $SERVER_PID > /dev/null; then
        echo "Rails server process is running (from PID file). Stopping..."
        kill -TERM $SERVER_PID
        sleep 2

        if ps -p $SERVER_PID > /dev/null; then
            echo "Process still alive. Force killing..."
            kill -9 $SERVER_PID
        fi
    else
        echo "No active process found for PID $SERVER_PID."
    fi

    echo "Removing PID file..."
    rm -f "$SERVER_PID_FILE"
else
    echo "No Rails server PID file found."
fi

# Step 2: Stop Rails processes by port
for PORT in "${PORTS[@]}"; do
    PID=$(lsof -ti tcp:"$PORT" -sTCP:LISTEN)
    if [ -n "$PID" ]; then
        echo "Found Rails process on port $PORT (PID: $PID). Stopping..."
        kill -TERM $PID
        sleep 2

        if ps -p $PID > /dev/null; then
            echo "Process still alive. Force killing..."
            kill -9 $PID
        fi
    else
        echo "No Rails process found on port $PORT."
    fi
done

# Step 3: Show any remaining Rails processes
echo "Remaining Rails processes:"
ps aux | grep '[r]ails'

echo "✅ Rails cleanup complete."
