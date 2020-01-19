import React from 'react';
import { Router, Stack } from 'react-native-router-flux';
// Replace "book" with the name of the resource type
import AccessPassRoutes from './routes/accesspass';
import DeviceRoutes from './routes/device';
import GreetingRoutes from './routes/greeting';

const RouterComponent = () => {
  return (
    <Router>
      <Stack key="root">
        {AccessPassRoutes}
        {DeviceRoutes}
        {GreetingRoutes}
      </Stack>
    </Router>
  );
};

export default RouterComponent;
