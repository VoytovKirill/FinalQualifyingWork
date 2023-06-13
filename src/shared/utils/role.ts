import {Roles} from 'shared/constants/roles';
import {Role} from 'typings/global';

export function translateRole(role: string | null): Role | '–' {
  switch (role) {
    case Roles.guest:
      return 'неверефицированный пользователь';
    case Roles.user:
      return 'роль не указана';
    case Roles.manager:
      return 'аккаунт-менеджер';
    case Roles.admin:
      return 'администратор';
    case Roles.superAdmin:
      return 'супер-админ';
    default:
      return '–';
  }
}

export function changeRoleToDTO(role: string): Roles {
  switch (role.toLocaleLowerCase()) {
    case 'супер-админ':
      return Roles.superAdmin;
    case 'администратор':
      return Roles.admin;
    case 'аккаунт-менеджер':
      return Roles.manager;
    case 'роль не указана':
      return Roles.user;
    default:
      return Roles.user;
  }
}
