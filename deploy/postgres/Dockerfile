FROM postgres:16-alpine
USER root
RUN rm -f /usr/local/bin/gosu \
    && install -d -o postgres -g postgres /var/lib/postgresql/data
USER postgres
