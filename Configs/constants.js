"use strict";
module.exports = {
    codes: {
        HTTP_SUCCESS: 200,
        DB_CREATE: 201,
        DB_FAILURE: 500,
        DB_CREATED: 201,
        NOT_FOUND: 404,
        NOT_AUTHERIZED: 401,
        FORBIDDEN: 403,
        BAD_REQUEST: 400
    },
    messages: {
        "INVALID_EMAIL": "Invalid email",
        "INVALID_PASSWORD": "Invalid password",
        "NOT_letIFIED": "Not letified",
        "ACCOUNT_NOT_VERIFIED": "Your account is not verified",
        "CASE_ID_MISSING": 'caseId missing in the request',
        "HTTP_SUCCESS": "Success",
        "DB_FAILURE": "Database Failure",
        "NO_RECORDS": "No Records Found",
        "NOT_FOUND": "Not Found",
        "NOT_AUTHERIZED": "Not Authorized",
        "LOGOUT_SUCCESS": "Successfully logged out",
        "PASSWORDENCRYPTION_FAILED": "Password encryption failed",
        "FORBIDDEN": "Forbidden",
        "ACCOUNT_EXISTS": "Account already exists",
        "UNABLE_TO_GENERATE_TOKEN": "Failed to generate token",
        "INVALID_VERIFICATION_CODE": "Invalid VERIFICATION code",
        "VERIFICATION_CODE_EXPIRED": "VERIFICATION code expird",
        "VERIFICATION_CODE_SENT": "VERIFICATION code ",
        "BAD_REQUEST": "Bad Request",
        "TOKEN_NOT_FOUND": "No token found",
        "IMAGE_UPLOADED": "Image uploaded successfully",
        "NOTIFICATION_DELETED": "Notification deleted",
        "ALL_NOTIFICATION_DELETED": "All notifications cleared"
    }
}
