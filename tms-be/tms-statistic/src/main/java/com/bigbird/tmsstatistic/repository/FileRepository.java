package com.tms_statistic.repository;

import com.tms_statistic.entity.AttachFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<AttachFile, Long> {

    @Query(nativeQuery = true, value = "select * from file f where f.group_id = :groupId")
    List<AttachFile> getFilesByGroupId(String groupId);
}
