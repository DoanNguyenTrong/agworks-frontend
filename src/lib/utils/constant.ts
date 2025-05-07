const EncryptConstants = {
  publicKey: "",
  RSAPublicKey: "",
  params: {
    version: "1.0",
    signMethod: "sha256",
    format: "json",
    secret: "",
  },
  ivKey: "",
};

const DateFormatType = "yyyyMMddhhmmss";

type TResponseStatusCode = {
  success: number;
  successPost: number;
  expired: number;
  forceExpired: string;
};

const ResponseStatusCode: TResponseStatusCode = {
  success: 200,
  successPost: 201,
  expired: 401,
  forceExpired: "400",
};

const USER_STATUS = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
};

export enum StatusType {
  INPROGRESS = 'InProgress',
  NEW = 'New',
  DRAFT = 'Draft',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  // =============================
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

const URL_DONT_SHOW_MENU = ['login', "404"]

export { DateFormatType, EncryptConstants, ResponseStatusCode, URL_DONT_SHOW_MENU, USER_STATUS };
  