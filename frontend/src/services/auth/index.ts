import { PATH_NAMES } from '@/constants/routes.constant';

export const redirectToHome = async () => {
  if (typeof window !== 'undefined') {
    if (location.pathname !== PATH_NAMES.HOME) {
      window.location.href = `${PATH_NAMES.HOME}`;
    }
  }
};
