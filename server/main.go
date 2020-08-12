package main

import (
	"context"
	"encoding/json"
	"fmt"
	pb "github.com/Olament/gDHT/service"
	"github.com/go-redis/redis"
	"google.golang.org/grpc"
	"log"
	"net"
	"github.com/olivere/elastic/v7"
	"time"
)

type server struct {
	pb.UnimplementedBitTorrentServer
}

type file struct {
	Path   string `json:"path"`
	Length int    `json:"length"`
}

type bitdata struct {
	InfoHash string `json:"infohash"`
	Name     string `json:"name"`
	Files    []file `json:"files,omitempty"`
	Length   int    `json:"length,omitempty"`
}

var ctx = context.Background()
var rdb = redis.NewClient(&redis.Options{
	Addr:     "localhost:6379",
	Password: "",
	DB:       0,
})

func (s *server) Send(ctx context.Context, in *pb.BitTorrent) (*pb.Empty, error) {
	/* map gRPC struct to bittorrent data */
	files := make([]file, len(in.Files))
	for i, v := range in.Files {
		files[i] = file{
			Path:   v.Path,
			Length: int(v.Length),
		}
	}
	data := bitdata{
		InfoHash: in.Infohash,
		Name:     in.Name,
		Files:    files,
		Length:   int(in.Length),
	}

	value, err := json.Marshal(data)
	if err != nil {
		return &pb.Empty{}, err
	}
	fmt.Printf("%s\n\n", value)
	err = rdb.LPush("queue", value).Err()
	if err != nil {
		log.Fatal(err)
	}

	return &pb.Empty{}, nil
}

// process data from redis message queue by indexing them to elastic search
func Process(client *elastic.Client, value string) {

	// TODO: filter the value

	client.Index().Index("torrent").BodyString(value).Do(ctx)
}

func main() {
	/* setup gRPC service */
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterBitTorrentServer(s, &server{})
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}

	/* setup elastic search */
	es, err := elastic.NewClient()
	if err != nil {
		log.Fatalf("Error creating the client: %s", err)
	}

	for {
		value, err := rdb.BLPop(0*time.Second, "queue").Result()
		if err != nil {
			log.Fatal(err)
		}

		Process(es, value[1])
	}
}
