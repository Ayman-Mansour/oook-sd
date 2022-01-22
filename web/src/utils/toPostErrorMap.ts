import { FieldError, PostFieldError } from "../generated/graphql";

export const toPostErrorMap = (errors: PostFieldError[]) => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
};
