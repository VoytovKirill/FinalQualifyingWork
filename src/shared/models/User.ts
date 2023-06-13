import {UserDto} from 'api/dto/User';
import {Roles} from 'shared/constants/roles';

export interface User extends UserDto {
  fullName: string | null;
  role: Roles;
  clientField: string;
  isAuthorizedUser?: boolean;
}

export function mapUserToDto(user: User): UserDto {
  // eslint-disable-next-line no-unused-vars
  const {clientField, ...fields} = user;
  return fields;
}
export function mapUserDtoToModel(user: UserDto): User {
  return {...user, clientField: '', fullName: null, role: Roles.none};
}
