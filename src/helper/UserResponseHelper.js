// src/helper/UserResponseHelper.js

const formatUser = (user) => {
  if (!user) return null;

  const mediaBase = process.env.MEDIA_BASE_URL || '';

  return {
    id: user.id,
    uuid: user.uuid,
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    image: user.image ? `${mediaBase}${user.image}` : '',
    site_logo: user.site_logo ? `${mediaBase}${user.site_logo}` : '',
    status: user.status,
    language: user.language ? user.language.name : null,
    phone_number: user.phone_number,
    address: user.address,
    email_verified: user.email_verified,
    role: user.role
      ? {
          id: user.role.id,
          code: user.role.code,
          translations: user.role.translations || [],
        }
      : null,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

const formatUserList = (rows = []) => {
  return rows.map(formatUser);
};

module.exports = {
  user: formatUser,
  formatUser,
  formatUserList,
};