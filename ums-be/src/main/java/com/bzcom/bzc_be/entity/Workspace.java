package com.bzcom.bzc_be.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "KEYCLOAK_GROUP")
public class Workspace {

    @Id
    @Column(name = "ID", length = 36)
    public String workspaceId;

    @Column(name = "NAME", length = 255)
    public String name;

    @Column(name = "PARENT_GROUP", length = 36)
    public String parentGroup;

    @Column(name = "REALM_ID", length = 36)
    public String realmId;

    @Column(name = "TYPE")
    public int type;
}
