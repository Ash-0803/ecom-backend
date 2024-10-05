export function isAuth(req, res, next) {
  if (req.user) {
    return next();
  }
  res.status(401).send("Unauthorized");
}

export const sanitizeUser = (user) => {
  return {
    id: user.id,
    role: user.role,
  };
};
