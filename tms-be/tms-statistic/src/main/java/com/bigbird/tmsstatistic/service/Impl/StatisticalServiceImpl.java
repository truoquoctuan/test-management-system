package com.tms_statistic.service.Impl;

import com.tms_statistic.cmmn.base.BaseEntity;
import com.tms_statistic.cmmn.base.PageInfo;
import com.tms_statistic.cmmn.config.RabbitConfig.IssuesCauseSolutionSender;
import com.tms_statistic.cmmn.exception.ResourceNotFoundException;
import com.tms_statistic.cmmn.util.Base64Util;
import com.tms_statistic.cmmn.util.FileUtil;
import com.tms_statistic.dto.*;
import com.tms_statistic.entity.AttachFile;
import com.tms_statistic.entity.Folder;
import com.tms_statistic.entity.Issues;
import com.tms_statistic.entity.Users;
import com.tms_statistic.repository.AssignRepository;
import com.tms_statistic.repository.FileRepository;
import com.tms_statistic.repository.FolderRepository;
import com.tms_statistic.repository.IssuesRepository;
import com.tms_statistic.repository.LabelRepository;
import com.tms_statistic.repository.TestCaseIssuesRepository;
import com.tms_statistic.repository.TestCaseRepository;
import com.tms_statistic.repository.TestPlanRepository;
import com.tms_statistic.service.CommentService;
import com.tms_statistic.service.FileService;
import com.tms_statistic.service.LabelService;
import com.tms_statistic.service.StatisticalService;
import com.tms_statistic.service.TestResultService;
import com.tms_statistic.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.QuoteMode;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticalServiceImpl implements StatisticalService {
    private final FolderRepository folderRepository;
    private final TestCaseRepository testCaseRepository;
    private final ModelMapper modelMapper;
    private final FileRepository fileRepository;
    private final TestPlanRepository testPlanRepository;
    private final UsersService usersService;
    private final LabelService labelService;
    private final TestResultService testResultService;
    private final CommentService commentService;
    private final IssuesRepository issuesRepository;
    private final TestCaseIssuesRepository testCaseIssuesRepository;
    private final AssignRepository assignRepository;
    private final FileService fileService;
    private final LabelRepository labelRepository;
    private final IssuesCauseSolutionSender issuesCauseSolutionSender;

    @Override
    public TotalElementDTO getTotalElementByTestPlanId(Long testPlanId) {
        try {
            TotalElementDTO totalElement = new TotalElementDTO();
            Long totalFolder = folderRepository.countFolderByTestPlanId(testPlanId);
            Long totalTestCase = testCaseRepository.countTestCaseByTestPlanId(testPlanId);
            Long totalTesCaseWithRS = testCaseRepository.countTestCaseWithResultsByTestPlanId(testPlanId);
            Long totalTesCaseWithoutRS = testCaseRepository.countTestCaseWithoutResultsByTestPlanId(testPlanId);
            totalElement.setTotalFolders(totalFolder);
            totalElement.setTotalTestCases(totalTestCase);
            totalElement.setTestCasesWithResults(totalTesCaseWithRS);
            totalElement.setTestCasesWithoutResults(totalTesCaseWithoutRS);
            return totalElement;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Can not get total element by test_plan_id: ", testPlanId);
        }
    }

    @Override
    public List<TestCaseStatusDTO> getTestCaseStatusByTestPlanId(Long testPlanId) {
        try {
            List<TestCaseStatusDTO> tmp = new ArrayList<>();
            List<Object[]> results = testCaseRepository.getTestCaseStatus(testPlanId);
            results.forEach(x -> tmp.add(new TestCaseStatusDTO((Integer) x[0], (Long) x[1])));
            Map<Integer, Long> statusMap = new HashMap<>();
            for (TestCaseStatusDTO dto : tmp) {
                statusMap.put(dto.getStatus(), dto.getCount());
            }
//            kiểm tra status đã đủ 4 chưa, nếu chưa thì thêm vào với giá trị 0
            List<TestCaseStatusDTO> rs = new ArrayList<>();
            for (int i = 1; i <= 4; i++) {
                rs.add(new TestCaseStatusDTO(i, statusMap.getOrDefault(i, 0L)));
            }
            Long totalTesCaseWithoutRS = testCaseRepository.countTestCaseWithoutResultsByTestPlanId(testPlanId);
            rs.add(new TestCaseStatusDTO(5, totalTesCaseWithoutRS));
            return rs;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Can not get test case test_plan_id: ", testPlanId);
        }
    }

    @Override
    public List<TestCasePriorityDTO> getTestCasePriorityByTestPlanId(Long testPlanId) {
        try {
            List<TestCasePriorityDTO> tmp = new ArrayList<>();
            List<Object[]> results = testCaseRepository.getTestCasePriority(testPlanId);
            results.forEach(x -> tmp.add(new TestCasePriorityDTO((Integer) x[0], (Long) x[1])));
            Map<Integer, Long> statusMap = new HashMap<>();
            for (TestCasePriorityDTO dto : tmp) {
                statusMap.put(dto.getPriority(), dto.getCount());
            }
//            kiểm tra priority đã đủ 3 chưa, nếu chưa thì thêm vào với giá trị 0
            List<TestCasePriorityDTO> rs = new ArrayList<>();
            for (int i = 1; i <= 3; i++) {
                rs.add(new TestCasePriorityDTO(i, statusMap.getOrDefault(i, 0L)));
            }
            return rs;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Can not get test case test_plan_id: ", testPlanId);
        }
    }

    @Override
    public TestCasePage getAllTestCaseByFolderId(Long folderId, String name, List<Integer> status, String sorted, Integer page, Integer size) {
        try {
            Pageable pageable = PageRequest.of(page, size, parseSortString(sorted));
            Page<TestCaseDTO> testCases = testCaseRepository.getAllTestCaseByFolderId(folderId, name, status, pageable);
            PageInfo pageInfo = new PageInfo(testCases.getTotalPages(), (int) testCases.getTotalElements(), testCases.getNumber(), testCases.getSize());
            return new TestCasePage(testCases.getContent(), pageInfo);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Can not get test case folderId: ", folderId);
        }
    }

    @Override
    public List<FolderDTO> getAllFolderHasTestCaseResultByTestPlanId(Long testPlanId) {
        try {
            List<Long> folderIds = folderRepository.getAllFolderIdHasTestCaseResultByTestPlanId(testPlanId);
            List<FolderDTO> rs = new ArrayList<>();
            folderIds.forEach(folderId -> {
                Folder folder = folderRepository.getFolderById(folderId).get();
                FolderDTO folderDTO = modelMapper.map(folder, FolderDTO.class);
                List<TestCaseDTO> testCases = testCaseRepository.getAllTestCaseResultByFolderId(folderId);
                testCases.forEach(testCase -> {
                    Users users = usersService.findUserById(testCase.getCreatedBy());
                    if (users != null) {
                        testCase.setUsers(users);
                    }
                    List<LabelDTO> labelDTOS = labelService.getLabelsByTestCaseId(testCase.getTestCaseId());
                    testCase.setLabelsInfo(labelDTOS);
                });
                folderDTO.setTestCases(testCases);
                rs.add(folderDTO);
            });
            return rs;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Can not get all folder info by testPlanId: ", testPlanId);
        }
    }

    @Override
    public AttachFile generateCSV(Long testPlanId, String uploadKey, String name, Integer chunk, Integer chunks) {
        try {
            String uploadDir = FileUtil.getUploadPath();
            String middleDir = DateFormatUtils.format(new Date(), "/yyyy/MM/");
            String base64Name = Base64Util.encodeString(name) + ".csv";
            String destName = uploadDir + middleDir + base64Name;
            File destFile = new File(destName);

            if (!destFile.getParentFile().exists()) {
                destFile.getParentFile().mkdirs();
            }

            if (chunk == 0 && destFile.exists()) {
                FileUtil.deleteFile(destFile);
                destFile = new File(destName);
            }

            List<FolderDTO> folders = getAllFolderHasTestCaseResultByTestPlanId(testPlanId);

//            ghi dữ liệu vào file
            FileWriter fileWriter = new FileWriter(destFile, StandardCharsets.UTF_8);
            CSVFormat csvFormat = CSVFormat.DEFAULT
                    .withHeader("FolderId", "FolderName", "Status", "TestCaseId", "TestCaseName", "Priority", "Result", "CreatedAt", "UpdateAt")
                    .withQuoteMode(QuoteMode.MINIMAL)
                    .withIgnoreEmptyLines()  // Bỏ qua các dòng trống
                    .withNullString("N/A");
            CSVPrinter csvPrinter = new CSVPrinter(fileWriter, csvFormat);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            for (FolderDTO folder : folders) {
                Long folderId = folder.getFolderId();
                String folderName = folder.getFolderName();
                String folderStatus = folder.getStatus() != null ? getFolderStatus(folder.getStatus()) : "Unknown";
                List<TestCaseDTO> testCases = folder.getTestCases();
                for (TestCaseDTO testCase : testCases) {
                    Long testCaseId = testCase.getTestCaseId();
                    String testCaseName = testCase.getTestCaseName();
                    String priority = testCase.getPriority() != null ? getPriorityString(testCase.getPriority()) : "Unknown";
                    String result = testCase.getResultStatus() != null ? getResultString(testCase.getResultStatus()) : "Unknown";
                    String createdAt = testCase.getCreatedAt().format(formatter);
                    String updatedAt = testCase.getUpdatedAt().format(formatter);
                    csvPrinter.printRecord(folderId, folderName, folderStatus, testCaseId, testCaseName, priority, result, createdAt, updatedAt);
                }
            }
//            lưư file
            csvPrinter.flush();
            fileWriter.close();

//            ghi thông tin file vào database và server
            if (chunk == chunks - 1 || (chunk == 0 && chunks == 0)) {
                long size = destFile.length();
                String saveName = middleDir + UUID.randomUUID().toString() + ".csv";
                File saveFile = new File(uploadDir + saveName);

                if (saveFile.exists()) {
                    FileUtils.forceDelete(saveFile);
                }

                // Delete file cũ nếu có
                FileUtils.moveFile(destFile, saveFile);
                if (destFile.exists()) {
                    FileUtils.forceDelete(destFile);
                }

                AttachFile attachFile = new AttachFile();
                attachFile.setGroupId(uploadKey);
                if (!name.contains(".csv")) {
                    name += ".csv";
                }
                attachFile.setFileName(name);
                attachFile.setFileSize(size);
                attachFile.setSaveNm(saveName);
                attachFile.setSaveDt(LocalDateTime.now());
                return fileRepository.save(attachFile);
            }
            return null;

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    @Override
    public TotalFolderDashboardDTO getTotalFolderDashboard(String userId) {
        try {
            Long total = folderRepository.countFolder(userId);
            Long stopped = folderRepository.countFolderStatus(userId, 1);
            Long ran = folderRepository.countFolderStatus(userId, 2);
            return new TotalFolderDashboardDTO(total, stopped, ran);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    @Override
    public TotalTestCaseDashboardDTO getTotalTestCaseDashboard(String userId) {
        try {
            List<Long> testPlanIds = testPlanRepository.getAllTestPlanIdByUserId(userId);
            Long total = testCaseRepository.countTestCase(testPlanIds);
            Long execute = testCaseRepository.countTestCaseWithResults(testPlanIds);
            Long pend = testCaseRepository.countTestCaseWithoutResults(testPlanIds);
            return new TotalTestCaseDashboardDTO(total, execute, pend);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    @Override
    public List<TestCaseStatusDTO> getTestCaseStatusDashboard(String userId) {
        try {
            List<TestCaseStatusDTO> tmp = new ArrayList<>();
            List<Long> testPlanIds = testPlanRepository.getAllTestPlanIdByUserId(userId);
            List<Object[]> results = testCaseRepository.getTestCaseStatusDashBoard(testPlanIds);
            results.forEach(x -> tmp.add(new TestCaseStatusDTO((Integer) x[0], (Long) x[1])));
            Map<Integer, Long> statusMap = new HashMap<>();
            for (TestCaseStatusDTO dto : tmp) {
                statusMap.put(dto.getStatus(), dto.getCount());
            }
//            kiểm tra status đã đủ 4 chưa, nếu chưa thì thêm vào với giá trị 0
            List<TestCaseStatusDTO> rs = new ArrayList<>();
            for (int i = 1; i <= 4; i++) {
                rs.add(new TestCaseStatusDTO(i, statusMap.getOrDefault(i, 0L)));
            }
            Long pend = testCaseRepository.countTestCaseWithoutResults(testPlanIds);
            rs.add(new TestCaseStatusDTO(5, pend));
            return rs;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    @Override
    public List<TestCasePriorityDTO> getTestCasePriorityDashboard(String userId) {
        try {
            List<TestCasePriorityDTO> tmp = new ArrayList<>();
            List<Long> testPlanIds = testPlanRepository.getAllTestPlanIdByUserId(userId);
            List<Object[]> results = testCaseRepository.getTestCasePriorityDashBoard(testPlanIds);
            results.forEach(x -> tmp.add(new TestCasePriorityDTO((Integer) x[0], (Long) x[1])));
            Map<Integer, Long> statusMap = new HashMap<>();
            for (TestCasePriorityDTO dto : tmp) {
                statusMap.put(dto.getPriority(), dto.getCount());
            }
//            kiểm tra priority đã đủ 3 chưa, nếu chưa thì thêm vào với giá trị 0
            List<TestCasePriorityDTO> rs = new ArrayList<>();
            for (int i = 1; i <= 3; i++) {
                rs.add(new TestCasePriorityDTO(i, statusMap.getOrDefault(i, 0L)));
            }
            return rs;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    @Override
    public ToTalTestPlanDashboardDTO getTotalTestPlanDashboard(String userId) {
        try {
            Long total = testPlanRepository.countTestPlan(userId);
            Long active = testPlanRepository.countTestPlanStatus(userId, 1);
            Long archive = testPlanRepository.countTestPlanStatus(userId, 0);
            return new ToTalTestPlanDashboardDTO(total, active, archive);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    @Override
    public List<TestCaseDTO> getAllTestCaseDetail(List<Long> testCaseIds) {
        try {
            List<TestCaseDTO> rs = new ArrayList<>();
            testCaseIds.forEach(testCaseId -> {
                TestCaseDTO testCaseDTO = testCaseRepository.getTestCaseDetail(testCaseId);
                Users users = usersService.findUserById(testCaseDTO.getCreatedBy());
                if (users != null) {
                    testCaseDTO.setUsers(users);
                }
                List<LabelDTO> labelDTOS = labelService.getLabelsByTestCaseId(testCaseDTO.getTestCaseId());
                testCaseDTO.setLabelsInfo(labelDTOS);
                rs.add(testCaseDTO);
            });
            return rs;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    @Override
    public List<ResponseResultDTO> getAllResultInTestCase(List<Long> testCaseIds) {
        try {
            List<ResponseResultDTO> rs = new ArrayList<>();
            testCaseIds.forEach(testCaseId -> {
                List<TestResultDTO> testResultDTOS = testResultService.getTestResultByTestCaseId(testCaseId);
                rs.add(new ResponseResultDTO(testCaseId, testResultDTOS));
            });
            return rs;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    @Override
    public List<ResponseCommentDTO> getAllCommentInTestCase(List<Long> testCaseIds) {
        try {
            List<ResponseCommentDTO> rs = new ArrayList<>();
            testCaseIds.forEach(testCaseId -> {
                List<CommentDTO> commentDTOS = commentService.getAllCommentByTestCaseId(testCaseId);
                rs.add(new ResponseCommentDTO(testCaseId, commentDTOS));
            });
            return rs;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    @Override
    public TestCasePage getTestCaseInTestPlan(Long testPlanId, Integer page, Integer size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Long> testCaseIdPage = testCaseRepository.getTestCaseIdByTestPlanId(testPlanId, pageable);
            List<Long> testCaseIds = testCaseIdPage.getContent();
            List<TestCaseDTO> testCaseDTOS = getAllTestCaseDetail(testCaseIds);
            testCaseDTOS.forEach(testCaseDTO -> {
                testCaseDTO.setLastTestResult(testResultService.getLastTestResultByTestCaseId(testCaseDTO.getTestCaseId()));
            });
            PageInfo pageInfo = new PageInfo(testCaseIdPage.getTotalPages(), (int) testCaseIdPage.getTotalElements(), testCaseIdPage.getNumber(), testCaseIdPage.getSize());
            return new TestCasePage(testCaseDTOS, pageInfo);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private List<IssuesDTO> getAllIssues(Long testPlanId) {
        List<Long> issuesIds = issuesRepository.getAllIssuesId(testPlanId);
        List<IssuesDTO> issuesDTOS = new ArrayList<>();
        issuesIds.forEach(issuesId -> {
            Issues issues = issuesRepository.getIssuesById(issuesId);
            IssuesDTO issuesDTO = modelMapper.map(issues, IssuesDTO.class);

            List<Long> testCases = testCaseIssuesRepository.getTestCaseIdByIssuesId(issuesId);
            if (testCases.isEmpty()) {
                issuesDTO.setTestCaseSelection("-");
            } else {
                String testCaseIds = testCaseIssuesRepository.getTestCaseIdByIssuesId(issuesId).stream()
                        .map(String::valueOf)
                        .collect(Collectors.joining(", "));
                issuesDTO.setTestCaseSelection(String.format("%s", testCaseIds));
            }

            List<String> assignUserIds = assignRepository.getUserIdByEntityIdAndType(issuesId, 2);
            String assignUserNames = assignUserIds.stream()
                    .map(userId -> {
                        Users users = usersService.findUserById(userId);
                        if (users != null) {
                            return users.getFullName();
                        }
                        return "-";
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.joining(", "));
            issuesDTO.setAssignUsers(assignUserNames);


            List<Long> labels = labelRepository.finAllLabelIdsByLabelTypeAndEntityId(2, issuesId);
            if (labels.isEmpty()) {
                issuesDTO.setLabels("-");
            } else {
                String labelsId = labels.stream()
                        .map(id -> labelRepository.getLabelNameByLabelId(id))
                        .collect(Collectors.joining(", "));
                issuesDTO.setLabels(labelsId);
            }

            String groupId = String.format("%s-%s-cs", issues.getClass().getSimpleName(), ((BaseEntity) issues).getSeq());
            String cause = null, solution = null, causeFilePath, solutionFilePath;

            List<AttachFile> files = fileRepository.getFilesByGroupId(groupId);
            if (files != null && !files.isEmpty()) {
                for (AttachFile file : files) {
                    if (file.getFileName().contains("c.txt")) {
                        causeFilePath = FileUtil.getUploadPath() + file.getSaveNm();
                        cause = fileService.readFromFile(causeFilePath);
                    } else if (file.getFileName().contains("s.txt")) {
                        solutionFilePath = FileUtil.getUploadPath() + file.getSaveNm();
                        solution = fileService.readFromFile(solutionFilePath);
                    }
                }
            }

            issuesDTO.setCause(cause);
            issuesDTO.setSolution(solution);

            issuesDTOS.add(issuesDTO);
        });

        return issuesDTOS;
    }

    @Override
    public AttachFile generateCSVIssues(Long testPlanId, String uploadKey, String name, Integer chunk, Integer chunks) {
        try {
            String uploadDir = FileUtil.getUploadPath();
            String middleDir = DateFormatUtils.format(new Date(), "/yyyy/MM/");
            String base64Name = Base64Util.encodeString(name) + ".csv";
            String destName = uploadDir + middleDir + base64Name;
            File destFile = new File(destName);

            if (!destFile.getParentFile().exists()) {
                destFile.getParentFile().mkdirs();
            }

            if (chunk == 0 && destFile.exists()) {
                FileUtil.deleteFile(destFile);
                destFile = new File(destName);
            }

            List<IssuesDTO> issuesList = getAllIssues(testPlanId);

            FileWriter fileWriter = new FileWriter(destFile, StandardCharsets.UTF_8);
            CSVFormat csvFormat = CSVFormat.DEFAULT
                    .withHeader("Issues Id", "Issues Name", "Test Cases Id", "Priority", "Tag", "Assign To", "End Date", "Status", "Scope Of Impact", "Description", "Note", "Cause", "Solution")
                    .withQuoteMode(QuoteMode.MINIMAL)
                    .withIgnoreEmptyLines()
                    .withNullString("-");
            CSVPrinter csvPrinter = new CSVPrinter(fileWriter, csvFormat);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            for (IssuesDTO issues : issuesList) {
                String issuesId = issues.getIssuesId().toString();
                String issuesName = issues.getIssuesName();
                String testCasesId = issues.getTestCaseSelection() != null ? issues.getTestCaseSelection() : "-";
                String priority = issues.getPriority() != null ? getPriorityIssuesString(issues.getPriority()) : "-";
                String labels = issues.getLabels();
                String assignTo = issues.getAssignUsers() != null ? issues.getAssignUsers() : "-";
                String endDate = issues.getEndDate() != null ? issues.getEndDate().format(formatter) : "-";
                String status = issues.getStatus() != null ? getStatusIssuesString(issues.getStatus()) : "-";
                String scope = issues.getScope();
                String description = issues.getDescription();
                String note = issues.getNote();
                Map<String, String> causeSolutionMap = issuesCauseSolutionSender.getCauseSolution(issues.getIssuesId());
                String cause = causeSolutionMap.getOrDefault("cause", "-");
                String solution = causeSolutionMap.getOrDefault("solution", "-");

                csvPrinter.printRecord(issuesId, issuesName, testCasesId, priority, labels, assignTo, endDate, status, scope, description, note, cause, solution);
            }
//            lưư file
            csvPrinter.flush();
            fileWriter.close();

//            ghi thông tin file vào database và server
            if (chunk == chunks - 1 || (chunk == 0 && chunks == 0)) {
                long size = destFile.length();
                String saveName = middleDir + UUID.randomUUID().toString() + ".csv";
                File saveFile = new File(uploadDir + saveName);

                if (saveFile.exists()) {
                    FileUtils.forceDelete(saveFile);
                }

                // Delete file cũ nếu có
                FileUtils.moveFile(destFile, saveFile);
                if (destFile.exists()) {
                    FileUtils.forceDelete(destFile);
                }

                AttachFile attachFile = new AttachFile();
                attachFile.setGroupId(uploadKey);
                if (!name.contains(".csv")) {
                    name += ".csv";
                }
                attachFile.setFileName(name);
                attachFile.setFileSize(size);
                attachFile.setSaveNm(saveName);
                attachFile.setSaveDt(LocalDateTime.now());
                return fileRepository.save(attachFile);
            }
            return null;

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }


    //    hàm convert sort_by + direction
    private Sort parseSortString(String sort) {
        if (sort == null || sort.isEmpty()) {
            return Sort.unsorted();
        }
        String[] sortParams = sort.split("\\+");
        String fieldName = sortParams[0];
        String direction = sortParams.length > 1 ? sortParams[1].toUpperCase() : "ASC";

        if (!direction.equals("ASC") && !direction.equals("DESC")) {
            direction = "ASC";  // Default to asc
        }
        return Sort.by(Sort.Direction.valueOf(direction), fieldName);
    }

    private String getPriorityIssuesString(Integer priority) {
        switch (priority) {
            case 1:
                return "Low";
            case 2:
                return "Medium";
            case 3:
                return "High";
            default:
                return "Unknown";
        }
    }

    private String getStatusIssuesString(Integer status) {
        switch (status) {
            case 1:
                return "Unresolved";
            case 2:
                return "Resolved";
            case 3:
                return "Non-issue";
            default:
                return "Unknown";
        }
    }

    private String getFolderStatus(Integer result) {
        switch (result) {
            case 1:
                return "Run";
            case 2:
                return "Stop";
            default:
                return "Unknown";
        }
    }

    private String getPriorityString(Integer priority) {
        switch (priority) {
            case 1:
                return "High";
            case 2:
                return "Medium";
            case 3:
                return "Low";
            default:
                return "Unknown";
        }
    }

    private String getResultString(Integer result) {
        switch (result) {
            case 1:
                return "Passed";
            case 2:
                return "Failed";
            case 3:
                return "Retest";
            case 4:
                return "Skipped";
            default:
                return "Unknown";
        }
    }

}
