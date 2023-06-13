import s from './NoteFoundPage.module.scss';

export function NotFoundPage() {
  return (
    <div className={s['not-found-page']}>
      <h1 className={s['not-found-page__title']}>404</h1>
      <p className={s['not-found-page__subtitle']}>Страница не найдена</p>
    </div>
  );
}
