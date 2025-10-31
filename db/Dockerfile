FROM mysql:8.0

COPY 01_schema.sql /docker-entrypoint-initdb.d/
COPY 02_dump.sql /docker-entrypoint-initdb.d/ 