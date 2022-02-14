import { DynamoDB } from "@aws-sdk/client-dynamodb";

const DELIM = "#_#_#";

export const dynamodb = new DynamoDB({ region: "us-east-2" });

export const getInt = (field: any) => {
  return field ? parseInt(field.N, 10) : -1;
};

export const getFloat = (field: any) => {
  return field ? parseFloat(field.N) : -1.0;
};

export const getStringArray = (field: any) => {
  return field ? field.S.split(DELIM) : [];
};

export const getStringArrayFromList = (field: any) => {
  return field && field.L ? field.L.map((item: any) => item.S) : [];
};

export const getString = (field: any) => {
  return field ? field.S : undefined;
};

export const getObjectArray = (field: any) => {
  return field ? field.L.map((single: any) => single.M) : [];
};
