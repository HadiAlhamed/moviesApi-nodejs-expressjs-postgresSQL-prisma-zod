//a specific schema for each route that specifies the types that we want to get back from the body

import { StatusCodes } from 'http-status-codes';

const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formatted = result.error.format();
      const flatErrors = Object.values(formatted)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();
      const error = flatErrors.join(', ');
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
    next();
  };
};

export default validateRequest;
