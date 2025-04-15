package com.tms_run.repository;

import com.tms_run.dto.AttachFileDTO;
import com.tms_run.entity.AttachFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<AttachFile, Long> {

    List<AttachFile> findFileByGroupId(String groupId);

    @Query(nativeQuery = true, value = "select * from file where file_seq = ?1")
    AttachFile findByFileSeq(Long fileSeq);
}
