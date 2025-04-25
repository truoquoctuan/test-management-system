package com.bzcom.bzc_be.cmmn.util;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Constant {

    public static final String cmdCreatedUserEN = "A new account was successfully created for this user.";

    public static final String cmdUpdatedUserEN = "The member details have been updated.";

    public static final String cmdActivatedUserEN = "The member has been activated.";

    public static final String cmdDeactivatedEN = "The member has been deactivated.";
}
