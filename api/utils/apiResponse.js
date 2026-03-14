export const success = (res, data = null, status = 200) =>
  res.status(status).json({ success: true, data });

export const error = (res, message = "Something went wrong", code = "ERROR", status = 500) =>
  res.status(status).json({ success: false, error: { message, code } });

export default { success, error };
