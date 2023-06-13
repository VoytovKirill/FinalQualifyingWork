const ATTANTION_ROLE = 'роль не указана';

export const getAttentionStyle = (info: any) => {
  if (info.row.original.role === ATTANTION_ROLE) {
    return true;
  }
  return false;
};

export const getCurrentId = (info: any) => {
  return info.row.original.id;
};
