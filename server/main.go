package main

import (
	"context"
	"fmt"
	"log"
	"net"

	"google.golang.org/grpc"
	pb "../service"
)

type server struct {
	pb.UnimplementedBitTorrentServer
}

func (s *server) Send(ctx context.Context, in *pb.BitTorrent) (*pb.Status, error) {
	fmt.Println(in.Infohash)

	return nil, nil
}

func main() {
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