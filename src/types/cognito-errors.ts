// types/cognito-errors.ts
type CognitoAuthErrorCode =
  | "UserNotConfirmedException"
  | "NotAuthorizedException"
  | "UserNotFoundException"
  | "CodeMismatchException"
  | "InvalidParameterException"
  | "UsernameExistsException"
  | "ExpiredCodeException"
  | "EnableSoftwareTokenMFAException";

export type CognitoAuthError = {
  message: string;
  code: CognitoAuthErrorCode;
  name?: string;
};

export const isCognitoAuthError = (error: unknown): error is CognitoAuthError =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  "message" in error;

export const isInvalidCognitoParameterError = (error: unknown) => {
  if (isCognitoAuthError(error)) {
    return error.code === "InvalidParameterException";
  }
  return false;
};

export const isCognitoUserNotConfirmedError = (error: unknown) => {
  if (isCognitoAuthError(error)) {
    return error.code === "UserNotConfirmedException";
  }
  return false;
};

export const isUserDisabledError = (error: unknown) => {
  if (isCognitoAuthError(error)) {
    return (
      error.code === "NotAuthorizedException" &&
      error.message === "User is disabled."
    );
  }
  return false;
};

export const isNotAuthorizedError = (error: unknown) => {
  if (isCognitoAuthError(error)) {
    return error.code === "NotAuthorizedException";
  }
  return false;
};

export const isCognitoUserNotFoundError = (error: unknown) => {
  if (isCognitoAuthError(error)) {
    return error.code === "UserNotFoundException";
  }
  return false;
};

export const isCognitoUsernameExistsError = (error: unknown) => {
  if (isCognitoAuthError(error)) {
    return error.code === "UsernameExistsException";
  }
  return false;
};

export const isCognitoCodeMismatchError = (error: unknown) => {
  if (isCognitoAuthError(error)) {
    return error.code === "CodeMismatchException";
  }
  return false;
};

export const isExpiredCodeError = (error: unknown) => {
  if (isCognitoAuthError(error)) {
    return (
      error.code === "ExpiredCodeException" ||
      error.name === "ExpiredCodeException" ||
      error.message?.includes("already been used")
    );
  }
  return false;
};

export const isEnableSoftwareTokenMFAError = (error: unknown) => {
  if (isCognitoAuthError(error)) {
    return (
      error.code === "EnableSoftwareTokenMFAException" ||
      error.name === "EnableSoftwareTokenMFAException"
    );
  }
  return false;
};
