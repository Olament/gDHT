package com.github.olament.gdhtweb.data;

import com.github.olament.gdhtweb.model.Torrent;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ResultRepository extends CrudRepository<Torrent, Long> {
    List<Torrent> findTorrentByName(String name);
    Torrent findTorrentById(String id);
}
