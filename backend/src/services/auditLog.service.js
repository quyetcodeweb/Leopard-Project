import db from "../config/db.js";

export const createAuditLog = ({
  userId,
  username,
  role,
  action,
  entity,
  entityId,
  oldValue,
  newValue,
  req
}) => {
  const sql = `
    INSERT INTO audit_logs
    (user_id, username, role, action, entity, entity_id,
     old_value, new_value, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    userId || null,
    username || null,
    role || null,
    action,
    entity,
    entityId || null,
    oldValue ? JSON.stringify(oldValue) : null,
    newValue ? JSON.stringify(newValue) : null,
    req.ip,
    req.headers["user-agent"]
  ]);
};
