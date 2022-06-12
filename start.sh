if screen -list | grep -q "d12"; then
  echo "d12 already started"
  exit 1
else
  echo "starting d12"
fi

. /mnt/sda1/deployment/ports.sh

# Start node server
screen -dmS 'd12'
screen -S 'd12' -X stuff "cd api && node .\n"

echo "Checking if node started..."
lsof -i:$d12

# Build vue client
# yarn build