package main

import (
	"github.com/Olament/gDHT/crawler/dht"
	pb "github.com/Olament/gDHT/service"
	"context"
	"encoding/hex"
	"google.golang.org/grpc"
	"log"
	"net/http"
	_ "net/http/pprof"
	"os"
	"strings"
)

type file struct {
	Path   string `json:"path"`
	Length int           `json:"length"`
}

type bitTorrent struct {
	InfoHash string `json:"infohash"`
	Name     string `json:"name"`
	Files    []file `json:"files,omitempty"`
	Length   int    `json:"length,omitempty"`
}

func main() {
	go func() {
		http.ListenAndServe(":6060", nil)
	}()

	conn, err := grpc.Dial(os.Getenv("address"), grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	//defer conn.Close()
	c := pb.NewBitTorrentClient(conn)

	ctx := context.Background()

	w := dht.NewWire(65536, 1024, 256)
	go func() {
		for resp := range w.Response() {
			metadata, err := dht.Decode(resp.MetadataInfo)
			if err != nil {
				continue
			}
			info := metadata.(map[string]interface{})

			if _, ok := info["name"]; !ok {
				continue
			}

			bt := bitTorrent{
				InfoHash: hex.EncodeToString(resp.InfoHash),
				Name:     info["name"].(string),
			}

			if v, ok := info["files"]; ok {
				files := v.([]interface{})
				bt.Files = make([]file, len(files))

				for i, item := range files {
					f := item.(map[string]interface{})

					pathInterface := f["path"].([]interface{})
					pathString := make([]string, len(pathInterface))

					for index, value := range pathInterface {
						pathString[index] = value.(string)
					}

					bt.Files[i] = file{
						Path:   strings.Join(pathString, ""),
						Length: f["length"].(int),
					}
				}
			} else if _, ok := info["length"]; ok {
				bt.Length = info["length"].(int)
			}

			files := make([]*pb.File, len(bt.Files))
			for _, value := range bt.Files {
				f := &pb.File{
					Path:   value.Path,
					Length: int32(value.Length),
				}
				files = append(files, f)
			}
			log.Println(bt.InfoHash)
			_, err = c.Send(ctx, &pb.BitTorrent{
				Infohash: bt.InfoHash,
				Name:     bt.Name,
				Files:    files,
				Length:   int32(bt.Length),
			})
		}
	}()
	go w.Run()

	config := dht.NewCrawlConfig()
	config.OnAnnouncePeer = func(infoHash, ip string, port int) {
		w.Request([]byte(infoHash), ip, port)
	}
	d := dht.New(config)

	d.Run()
}
