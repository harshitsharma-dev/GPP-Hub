import React from 'react';
import { t } from 'shared';

const App: React.FC = () => (
  <div>
    <h1>{t('welcome', 'en-IN')}</h1>
    <p>{t('textbooks', 'en-IN')}</p>
  </div>
);

export default App;
