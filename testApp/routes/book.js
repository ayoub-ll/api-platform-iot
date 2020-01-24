import React from 'react';
import { Scene, Actions } from 'react-native-router-flux';
import List from '../components/book/List';
import Create from '../components/book/Create';
import Show from '../components/book/Show';
import Update from '../components/book/Update';
import {delayRefresh} from '../utils/helpers';

export default [
          <Scene
              rightTitle="Add"
              onRight={() => Actions.bookCreate()}
              key="bookList" component={List}
              title="List of Books"
              initial
          />,
          <Scene key="bookCreate" component={Create}
                 title="Add a new book"/>,
          <Scene key="bookShow" component={Show}
                 title="Book"
                 leftTitle="< List of Books"
                 onLeft={() => {
                   Actions.pop();
                   delayRefresh();
                 }}/>,
          <Scene key="bookUpdate" component={Update}
                 title="Update Book"/>,
];
