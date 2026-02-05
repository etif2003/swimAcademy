import mongoose from "mongoose";
import { MESSAGES } from "../utils/constants/messages.js";

export const validateObjectId = (id, message = MESSAGES.COMMON.INVALID_ID) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(message);
  }
};

export const validateRequiredFields = (fieldsObj) => {
  const missing = Object.entries(fieldsObj)
    .filter(([_, value]) => value === undefined || value === null)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(MESSAGES.COMMON.MISSING_FIELDS);
  }
};

export const validateNonEmptyUpdate = (data) => {
  if (!data || Object.keys(data).length === 0) {
    throw new Error(MESSAGES.COMMON.NO_DATA_TO_UPDATE);
  }
};

export const validateEnum = (value, allowed, message) => {
  if (!allowed.includes(value)) {
    throw new Error(message);
  }
};
