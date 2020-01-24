import React from 'react';
import { Scene, Actions } from 'react-native-router-flux';
import List from '../components/greeting/List';
import Create from '../components/greeting/Create';
import Show from '../components/greeting/Show';
import Update from '../components/greeting/Update';
import {delayRefresh} from '../utils/helpers';

export default [
          <Scene
              rightTitle="Add"
              onRight={() => Actions.greetingCreate()}
              key="greetingList" component={List}
              title="List of Greetings"
              initial
          />,
          <Scene key="greetingCreate" component={Create}
                 title="Add a new greeting"/>,
          <Scene key="greetingShow" component={Show}
                 title="Greeting"
                 leftTitle="< List of Greetings"
                 onLeft={() => {
                   Actions.pop();
                   delayRefresh();
                 }}/>,
          <Scene key="greetingUpdate" component={Update}
                 title="Update Greeting"/>,
];
