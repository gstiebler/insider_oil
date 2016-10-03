service mysql stop
mount -t tmpfs -o size=512m tmpfs /tmp/ram
cp -pRL /var/lib/mysql /tmp/ram
service apparmor restart
service mysql start
