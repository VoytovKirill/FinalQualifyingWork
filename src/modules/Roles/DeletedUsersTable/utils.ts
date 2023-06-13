const ATTANTION_ROLE = 'роль не указана';

export const getAttentionStyle = (info: any) => {
  return info.row.original.role === ATTANTION_ROLE;
};

export const getCurrentId = (info: any) => {
  return info.row.original.id;
};
