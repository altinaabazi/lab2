// // middleware/authMiddleware.js
// import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) return res.status(401).json({ message: "Not Authenticated!" });

//   jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
//     if (err) return res.status(403).json({ message: "Token is not valid!" });

//     req.userId = payload.id;
//     req.userRole = payload.role; // ✅ ruajmë edhe rolin
//     next();
//   });
// };

// export const verifyAdmin = (req, res, next) => {
//   if (req.userRole !== "ADMIN") {
//     return res.status(403).json({ message: "Access denied. Admins only!" });
//   }
//   next();
// };
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization")?.split(" ")[1]; // Check both cookie and header for token

  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });

    req.userId = payload.id;
    req.userRole = payload.role; // Store role
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ message: "Access denied. Admins only!" });
  }
  next();
};
