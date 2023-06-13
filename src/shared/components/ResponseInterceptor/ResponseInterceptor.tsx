import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import {apiClient} from 'api';
import {refreshTokenResponseInterceptor} from 'api/interceptors/refresh';
import {usePathname} from 'shared/hooks';

export const ResponseInterceptor = () => {
  const navigate = useNavigate();
  const pathname = usePathname();

  const setupInterseptors = async () => {
    const newToken = await refreshTokenResponseInterceptor(apiClient, navigate, pathname);
    return newToken;
  };

  useEffect(() => {
    setupInterseptors();
  }, []);

  return null;
};
