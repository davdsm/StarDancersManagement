#!/bin/bash

echo "Backup or Restore?"
read VAR

if [ "$VAR" == "Backup" ]; then
    docker exec star_dancers_db /usr/bin/mysqldump -u root --password=StarDance2k22! StarDance > ./sql/dump.sql
fi

if [ "$VAR" == "Restore" ]; then
    cat backup.sql | docker exec -i star_dancers_db /usr/bin/mysql -u root --password=StarDance2k22 StarDance
fi
