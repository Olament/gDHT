# gDHT
A distributed self-host DHT torrent search suite

demo site: [guo.sh](https://www.guo.sh)

## Introduction
gDHT is a search engine suite that allows user to host their own torrent search engine. There are   four major components of the suite: `crawler`, `server`, `ElasticSearch`, and `web`. The distributed `crawler` will monitor the traffic on DHT network to collect meta information of the torrent and then sent collected information to `server` via gRPC. Upon on receiving the information, the `server` will push them into Redis message queue and asynchronously process (Ex. filter unwanted torrent) and index them into `ElasticSearch`. Finally, you can search the torrent information at the React web interface.

![](https://github.com/Olament/gDHT/blob/master/doc/architecture.jpg)

## Getting Started

### Nginx

The nginx server is bound to `YOURDOMAIN.COM` by default. If you want to host your own torrent search engine, your can change Nginx's environment variable `URL` in `docker-compose.yml`.

### Golang Crawler

You can leave the setting in `docker-compose.yml` unchanged if you run the suite with only one crawler. However, to add additional crawler to the system, change environment variable `address` under `crawler` to `master-server-ip-address:50051`.

### ElasticSearch Security

The security features of the `ElasticSearch` is enabled by default. To ensure that `crawler` and `web` function normally, you need to create two user: *web* and *crawler*. Notice that *crawler* must have permission to write and read index and *web* must have permission to read index. Once you created those two users, you can pass the username and password to Golang `crawler` and Nodejs `web` via the environment variables in `docker-compose.yml`. For more information on how to set up ElasticSearch, check those two articles [Configuring security in Elasticsearchedit](https://www.elastic.co/guide/en/elasticsearch/reference/current/configuring-security.html) and [Getting started with Elasticsearch security](https://www.elastic.co/blog/getting-started-with-elasticsearch-security).

Then, start the server by

``` bash
docker-compose build
docker-compose up
```

## Acknowledge

DHT crawler from [shiyanhui](https://github.com/shiyanhui/dht)

Web CSS theme from [Tania Rascia](https://github.com/taniarascia/taniarascia.com/)

