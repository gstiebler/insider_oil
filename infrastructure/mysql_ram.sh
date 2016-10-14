service mysql stop
mount -t tmpfs -o size=256m tmpfs /tmp/ram
cp -pRL /var/lib/mysql /tmp/ram
service apparmor restart
service mysql start
