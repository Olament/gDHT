package com.github.olament.gdhtweb.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Document(indexName = "torrent")
public class Torrent {
    @Id
    private String id;

    private String infohash;

    private String name;

    @Field(type = FieldType.Nested)
    private List<File> files;

    public String getId() {
        return this.id;
    }

    public String getInfohash() {
        return this.infohash;
    }

    public String getName() {
        return this.name;
    }

    public List<File> getFiles() {
        return this.files;
    }
}
