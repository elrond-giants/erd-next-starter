import {configureStore} from '@reduxjs/toolkit';
import notificationsSlice from "./slices/notificationsSlice";


const store =  configureStore({
    reducer: {
        notifications: notificationsSlice
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
