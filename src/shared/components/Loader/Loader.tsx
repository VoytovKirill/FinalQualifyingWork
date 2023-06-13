import s from './Loader.module.scss';

const Loader = () => {
  return (
    <div className={s.loader}>
      <div className={s.loader__item1}></div>
      <div className={s.loader__item2}></div>
      <div className={s.loader__item3}></div>
      <div className={s.loader__item4}></div>
      <div className={s.circle}>
        <div className={s.circle__item1}></div>
        <div className={s.circle__item2}></div>
        <div className={s.circle__item3}></div>
        <div className={s.circle__item4}></div>
      </div>
    </div>
  );
};

export {Loader};
