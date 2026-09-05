FROM python:3.12-alpine
WORKDIR /app
COPY s3-stub/server.py /app/server.py
RUN addgroup -g 10001 -S suq && adduser -u 10001 -S -D -H -G suq suq
USER 10001:10001
EXPOSE 9000
CMD ["python", "/app/server.py"]
