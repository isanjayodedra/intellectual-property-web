// src/helper/RoleResponseHelper.js

const formatRole = (role) => ({
  id: role.id,
  code: role.code,
  translations: (role.translations || []).map((t) => ({
    language_code: t.language_code,
    name: t.name,
    description: t.description,
  })),
  created_at: role.created_at,
  updated_at: role.updated_at,
});

const formatRoleList = (roles) => roles.map(formatRole);

module.exports = {
  formatRole,
  formatRoleList
};
