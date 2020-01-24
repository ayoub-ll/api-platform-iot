import React from 'react';
import { Router, Stack } from 'react-native-router-flux';
// Replace "book" with the name of the resource type
import BookRoutes from './routes/book';

const RouterComponent = () => {
  return (
    <Router>
      <Stack key="root">
        {BookRoutes}
      </Stack>
    </Router>
  );
};

export default RouterComponent;
