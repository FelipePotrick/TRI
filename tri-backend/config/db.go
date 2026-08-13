package config

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client
var DB *mongo.Database

// ConnectDB estabelece a conexão com o MongoDB usando as variáveis de ambiente.
func ConnectDB() {
	uri := os.Getenv("MONGO_URI")
	dbName := os.Getenv("MONGO_DB")
	if uri == "" || dbName == "" {
		log.Fatal("MONGO_URI e MONGO_DB precisam estar definidos no .env")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("erro ao conectar no MongoDB: %v", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("não foi possível pingar o MongoDB: %v", err)
	}

	Client = client
	DB = client.Database(dbName)
	log.Println("Conectado ao MongoDB:", dbName)

	ensureIndexes(ctx)
}

// ensureIndexes garante índices únicos para email e username.
func ensureIndexes(ctx context.Context) {
	usersCol := DB.Collection("users")
	_, err := usersCol.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    map[string]int{"email": 1},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys:    map[string]int{"username": 1},
			Options: options.Index().SetUnique(true),
		},
	})
	if err != nil {
		log.Printf("aviso ao criar índices: %v", err)
	}
}

func GetCollection(name string) *mongo.Collection {
	return DB.Collection(name)
}
