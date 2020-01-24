import React from 'react';
import { Scene, Actions } from 'react-native-router-flux';
import List from '../components/device/List';
import Create from '../components/device/Create';
import Show from '../components/device/Show';
import Update from '../components/device/Update';
import {delayRefresh} from '../utils/helpers';

export default [
          <Scene
              rightTitle="Add"
              onRight={() => Actions.deviceCreate()}
              key="deviceList" component={List}
              title="List of Devices"
              initial
          />,
          <Scene key="deviceCreate" component={Create}
                 title="Add a new device"/>,
          <Scene key="deviceShow" component={Show}
                 title="Device"
                 leftTitle="< List of Devices"
                 onLeft={() => {
                   Actions.pop();
                   delayRefresh();
                 }}/>,
          <Scene key="deviceUpdate" component={Update}
                 title="Update Device"/>,
];
