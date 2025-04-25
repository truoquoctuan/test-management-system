package com.bzcom.bzc_be.repository;

import com.bzcom.bzc_be.dto.UserDTO;
import com.bzcom.bzc_be.dto.response.UserPublicDTO;
import com.bzcom.bzc_be.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @Query(value = """
           SELECT
               ue.ID as userId,
               ue.EMAIL as email,
               ue.EMAIL_CONSTRAINT as emailConstraint,
               ue.EMAIL_VERIFIED as emailVerified,
               ue.ENABLED as enabled,
               ue.FEDERATION_LINK as federationLink,
               ue.FIRST_NAME as firstName,
               ue.LAST_NAME as lastName,
               ue.REALM_ID as realmId,
               ue.USERNAME as userName,
               ue.CREATED_TIMESTAMP as createdTimestamp,
               ue.SERVICE_ACCOUNT_CLIENT_LINK as serviceAccountClientLink,
               ue.NOT_BEFORE as notBefore,
               MAX(CASE WHEN ua.NAME = 'phoneNumber' THEN ua.VALUE END) AS phoneNumber,
               MAX(CASE WHEN ua.NAME = 'address' THEN ua.VALUE END) AS address,
               MAX(CASE WHEN ua.NAME = 'position' THEN ua.VALUE END) AS position,
               MAX(CASE WHEN ua.NAME = 'birthDate' THEN ua.VALUE END) AS birthDate,
               MAX(case WHEN ua.NAME = 'userCode' THEN ua.VALUE end ) as userCode,
               MAX(CASE WHEN ua.NAME = 'gender' THEN ua.VALUE END) AS gender,
               MAX(CASE WHEN ua.NAME = 'startDate' THEN ua.VALUE END) AS startDate
            FROM
                USER_ENTITY ue
            RIGHT JOIN 
                USER_GROUP_MEMBERSHIP ugm ON ue.ID = ugm.USER_ID
            LEFT JOIN
                USER_ATTRIBUTE ua ON ue.ID = ua.USER_ID
            
           WHERE ((:userName IS NULL OR ue.USERNAME LIKE CONCAT('%', :userName, '%'))
           OR (:userName IS NULL
                OR ue.FIRST_NAME LIKE CONCAT('%', :userName, '%')
                OR ue.LAST_NAME LIKE CONCAT('%', :userName, '%')
                OR CONCAT(ue.FIRST_NAME, ' ', ue.LAST_NAME) LIKE CONCAT('%', :userName, '%')))
           AND (:enabled = -1 OR ue.ENABLED = :enabled)
           GROUP BY
                ue.ID, ue.USERNAME, ue.EMAIL
           """, nativeQuery = true)
    Page<Map<String, Object>> getUsers(String groupId, String userName, int enabled, Pageable pageable);

    @Query(value = """
        SELECT ue.*
        FROM USER_ENTITY ue
        LEFT JOIN USER_GROUP_MEMBERSHIP ugm ON ue.ID = ugm.USER_ID
        WHERE ue.EMAIL IS NOT NULL
            AND (:searchName IS NULL OR ue.USERNAME LIKE CONCAT('%', :searchName, '%') OR ue.FIRST_NAME LIKE CONCAT('%' :searchName, '%') OR ue.LAST_NAME LIKE CONCAT('%' :searchName, '%'))
            AND ugm.GROUP_ID IS NULL OR ugm.GROUP_ID != :groupId
    """, nativeQuery = true)
    Page<User> getUsersNotInGroup(String groupId, String searchName, Pageable pageable);

    @Query(value = """
        SELECT
           ue.ID as userId,
           ue.EMAIL as email,
           ue.EMAIL_CONSTRAINT as emailConstraint,
           ue.EMAIL_VERIFIED as emailVerified,
           ue.ENABLED as enabled,
           ue.FEDERATION_LINK as federationLink,
           ue.FIRST_NAME as firstName,
           ue.LAST_NAME as lastName,
           ue.REALM_ID as realmId,
           ue.USERNAME as userName,
           ue.CREATED_TIMESTAMP as createdTimestamp,
           ue.SERVICE_ACCOUNT_CLIENT_LINK as serviceAccountClientLink,
           ue.NOT_BEFORE as notBefore,
           MAX(CASE WHEN ua.NAME = 'phoneNumber' THEN ua.VALUE END) AS phoneNumber,
           MAX(CASE WHEN ua.NAME = 'address' THEN ua.VALUE END) AS address,
           MAX(CASE WHEN ua.NAME = 'position' THEN ua.VALUE END) AS position,
           MAX(CASE WHEN ua.NAME = 'birthDate' THEN ua.VALUE END) AS birthDate,
           MAX(case WHEN ua.NAME = 'userCode' THEN ua.VALUE end ) as userCode,
           MAX(CASE WHEN ua.NAME = 'gender' THEN ua.VALUE END) AS gender,
           MAX(CASE WHEN ua.NAME = 'startDate' THEN ua.VALUE END) AS startDate
       FROM USER_ENTITY ue
       LEFT JOIN
            USER_ATTRIBUTE ua ON ue.ID = ua.USER_ID
       WHERE ue.ID = :userId
    """, nativeQuery = true)
    Map<String, Object> getUserById(String userId);

    @Query(value = """
        SELECT 
            ue.ID as userId,
            ue.USERNAME as userName,
            ue.FIRST_NAME as firstName,
            ue.LAST_NAME as lastName,
            ue.EMAIL as email,
            ue.ENABLED as enabled
        FROM USER_ENTITY ue
        WHERE ue.ID = :userId
    """, nativeQuery = true)
    UserPublicDTO findUserPublicInfoByUserId(String userId);
}
