const AWS_BUCKET_PREFIX = "ba";
const AWS_CDN_ENDPOINT = import.meta.env.VITE_AWS_CDN_ENDPOINT;

export const getFile = (key) => {
  return `${AWS_CDN_ENDPOINT}/${AWS_BUCKET_PREFIX}/${key}`;
};
