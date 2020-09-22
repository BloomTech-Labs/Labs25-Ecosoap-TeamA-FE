import { combineReducers } from 'redux';

import { recordsReducer as rr } from './recordsReducer';
import { typesReducer as tr } from './typesReducer';

export default combineReducers({
  rr,
  tr,
});
