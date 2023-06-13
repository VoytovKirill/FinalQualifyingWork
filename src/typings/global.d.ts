export type LisnernerObject = Window | Document | HTMLElement | EventTarget;

export type Role =
  | 'супер-админ'
  | 'администратор'
  | 'аккаунт-менеджер'
  | 'роль не указана'
  | 'неверефицированный пользователь';

export type SearchListItem = {
  text: string;
  id: number;
};
