if ! screen -list | grep -q 'd12'; then
  echo 'd12 already killed'
  exit 1
else
  echo "killing d12"
fi
. /mnt/sda1/deployment/ports.sh
screen -S 'd12' -X quit
echo "Checking if d12 still alive..."
lsof -i:$d12