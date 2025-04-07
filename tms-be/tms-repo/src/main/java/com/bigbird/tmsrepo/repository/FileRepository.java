package com.bigbird.tmsrepo.repository;

import com.bigbird.tmsrepo.entity.AttachFile;
import com.tmsbe.tms_repo.tms_repo.dto.AttachFileDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<AttachFile, Long> {

    List<AttachFileDTO> findByGroupId(String groupId);

    List<AttachFile> findFileByGroupId(String groupId);

    @Query(nativeQuery = true, value = "select * from file where file_seq = ?1")
    AttachFile findByFileSeq(Long fileSeq);
}
