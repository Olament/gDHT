package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis"
	"log"
	"net"

	pb "github.com/Olament/gDHT/service"
	"google.golang.org/grpc"
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
	err = rdb.LPush(ctx, "queue", value).Err()
	if err != nil {
		log.Fatal(err)
	}

	return &pb.Empty{}, nil
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

}
