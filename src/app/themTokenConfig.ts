import { IAelfdThemeProviderProps } from 'aelf-design';
import { ThemeConfig } from 'antd';

export const AELFD_THEME_CONFIG: IAelfdThemeProviderProps['theme'] = {
  components: {
    Descriptions: {
      itemPaddingBottom: 0,
    },
  },
};

export const ANTD_THEME_CONFIG: ThemeConfig = {
  components: {
    Descriptions: {
      itemPaddingBottom: 0,
    },
  },
};
