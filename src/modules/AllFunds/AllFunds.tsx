import {FC} from 'react';

import {Funds} from 'shared/components/Funds';

interface AllFundsProps {
  profit?: boolean;
}

export const AllFunds: FC<AllFundsProps> = ({profit = false}) => {
  return <Funds title="Фонды" pageName="fonds" />;
};
