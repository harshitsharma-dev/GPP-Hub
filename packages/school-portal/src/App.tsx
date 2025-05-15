import React from 'react';
import { t } from 'shared';

const API_URL = 'http://3.7.65.128:4000/api';

const App: React.FC = () => (
  <div>
    <h1>{t('welcome', 'en-IN')}</h1>
    <p>{t('textbooks', 'en-IN')}</p>
  </div>
);

export default App;
