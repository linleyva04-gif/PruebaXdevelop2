const ROLES_STORAGE_KEY = "custom_user_roles";

export const saveUserRole = (email: string, role: string) => {
  const savedRoles = JSON.parse(localStorage.getItem(ROLES_STORAGE_KEY) || "{}");
  savedRoles[email] = role;
  localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(savedRoles));
};

export const attachRoles = (users: any[]) => {
  const savedRoles = JSON.parse(localStorage.getItem(ROLES_STORAGE_KEY) || "{}");

  return users.map((user, index) => ({
    ...user,
    role: savedRoles[user.email] || (index % 2 === 0 ? "admin" : "user"),
  }));
};