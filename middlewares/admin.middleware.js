export const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "אין הרשאה – משתמש לא מחובר",
    });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({
      message: "אין הרשאה – אדמין בלבד",
    });
  }

  next();
};
