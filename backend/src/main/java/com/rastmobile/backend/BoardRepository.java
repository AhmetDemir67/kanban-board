package com.rastmobile.backend;

// MongoRepository'den miras alarak save(), findById(), findAll(), deleteById()
// gibi metodları hiç kod yazmadan otomatik olarak kazanıyoruz.
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BoardRepository extends MongoRepository<Board, String> {
}