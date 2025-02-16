// src/store/reducers/rootReducer.ts

import { combineReducers } from 'redux';
import { authenticationReducer } from './authentication/reducers';
// import { productReducer } from './product/reducer';
// import exampleReducer from './exampleReducer';

const rootReducer = combineReducers({
    // example: exampleReducer,
    auth: authenticationReducer,
    // products: productReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
