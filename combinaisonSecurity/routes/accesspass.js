import React from 'react';
import { Scene, Actions } from 'react-native-router-flux';
import List from '../components/accesspass/List';
import Create from '../components/accesspass/Create';
import Show from '../components/accesspass/Show';
import Update from '../components/accesspass/Update';
import {delayRefresh} from '../utils/helpers';

export default [
          <Scene
              rightTitle="Add"
              onRight={() => Actions.accesspassCreate()}
              key="accesspassList" component={List}
              title="List of AccessPass"
              initial
          />,
          <Scene key="accesspassCreate" component={Create}
                 title="Add a new accesspass"/>,
          <Scene key="accesspassShow" component={Show}
                 title="AccessPass"
                 leftTitle="< List of AccessPass"
                 onLeft={() => {
                   Actions.pop();
                   delayRefresh();
                 }}/>,
          <Scene key="accesspassUpdate" component={Update}
                 title="Update AccessPass"/>,
];
