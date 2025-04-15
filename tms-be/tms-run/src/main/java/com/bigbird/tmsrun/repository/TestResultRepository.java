package com.tms_run.repository;

import com.tms_run.entity.TestResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {

    @Query(nativeQuery = true, value = "select * from test_result where test_case_id = ?1 order by test_result_id desc")
    Page<TestResult> findTestResultById(Long testCaseId, Pageable pageable);
}
