// Role-Based Access Control (RBAC): each role is allowed a fixed set of
// actions. Components check this map instead of hard-coding "if role is X".

export const PERMISSIONS = {
  admin: ["create", "edit", "delete", "view"],
  editor: ["create", "edit", "view"],
  viewer: ["view"],
};

// Returns true/false — does this role include this permission?
export function hasPermission(role, permission) {
  return PERMISSIONS[role]?.includes(permission) ?? false;
}
