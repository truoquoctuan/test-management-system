package com.tms_file.repository;

import com.tms_file.entity.AttachFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<AttachFile, Long> {

    List<AttachFile> findByGroupId(String groupId);

    @Query(nativeQuery = true, value = "select * from file where file_seq = ?1")
    AttachFile findFileBySeq(Long seq);
}
