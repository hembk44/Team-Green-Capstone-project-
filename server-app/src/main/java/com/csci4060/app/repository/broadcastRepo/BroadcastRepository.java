package com.csci4060.app.repository.broadcastRepo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csci4060.app.model.broadcast.Broadcast;

public interface BroadcastRepository extends JpaRepository<Broadcast, Long>{

}
