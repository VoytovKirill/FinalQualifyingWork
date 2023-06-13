import s from './RoleCellContainer.module.scss';

type Props = {
  children: React.ReactNode;
};

export const RoleCellContainer = (props: Props) => {
  return <div className={s.item__role}>{props.children}</div>;
};
