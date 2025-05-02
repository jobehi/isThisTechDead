import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

// Apply our custom theme
addons.setConfig({
  theme: themes.dark,
});
