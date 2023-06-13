enum EventStyle {
  login = 'login',
  roles = 'roles',
  expenses = 'expenses',
  update = 'update',
  report = 'report',
  any = 'any',
}

export function getEventTitle(types: {type: number; title: string}[], eventNumber: number): string {
  return types.filter((item) => item.type === eventNumber)[0]?.title;
}

export const getEventStyle = (type: number) => {
  switch (type) {
    case 0:
      return EventStyle.login;
    case 1:
      return EventStyle.report;
    case 2:
      return EventStyle.update;
    case 3:
      return EventStyle.expenses;
    case 4:
      return EventStyle.roles;
    default:
      return EventStyle.any;
  }
};
