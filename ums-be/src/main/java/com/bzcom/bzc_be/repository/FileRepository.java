package com.bzcom.bzc_be.repository;

import com.bzcom.bzc_be.entity.AttachFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<AttachFile, Long> {

    List<AttachFile> findByGroupId(String groupId);
}
