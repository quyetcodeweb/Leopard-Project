import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "DEFAULT_SECRET";

// Kiểm tra token
export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // userId, role
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token không hợp lệ." });
  }
};

// Kiểm tra role
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: "Không có quyền truy cập" 
            });
        }
        next();
    };
};