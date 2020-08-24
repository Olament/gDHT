# gDHT
A distributed self-host DHT torrent search suite

demo site: [guo.sh](https://www.guo.sh)

## Introduction
gDHT is a search engine suite that allows user to host their own torrent search engine. There are   four major components of the suite: `crawler`, `server`, `ElasticSearch`, and `web`. The distributed `crawler` will monitor the traffic on DHT network to collect meta information of the torrent and then sent collected information to `server` via gRPC. Upon on receiving the information, the `server` will push them into Redis message queue and asynchronously process (Ex. filter unwanted torrent) and index them into `ElasticSearch`. Finally, you can search the torrent information at the React web interface.

![](https://github.com/Olament/gDHT/blob/master/doc/architecture.jpg)

## Getting Started

The nginx server is bound to `YOURDOMAIN.COM` by default. If you want to host your own torrent search engine, your can change Nginx's environment variable `URL` in `docker-compose.yml`.

The security features of the `ElasticSearch` is enabled by default. To ensure that `crawler` and `web` function normally, you need to create two user: *web* and *crawler*. Notice that *crawler* must have permission to write and read index and *web* must have permission to read index. Once you created those two users, you can pass the username and password to Golang `crawler` via the environment variables in `docker-compose.yml`. For user *web*, the password is hard-coded as *password* in the source code.

Then, start the server by

``` bash
docker-compose build
docker-compose up
```

## Acknowledge

DHT crawler from [shiyanhui](https://github.com/shiyanhui/dht)

Web CSS theme from [Tania Rascia](https://github.com/taniarascia/taniarascia.com/)

