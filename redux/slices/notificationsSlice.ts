import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {INotificationProps} from "../../components/Notification";

const initialState: { value: Array<INotificationProps> } = {
    value: []
}

export const notificationsSlice = createSlice({
    initialState,
    name: 'notifications',
    reducers: {
        addNotification: (state, action: PayloadAction<INotificationProps>) => {
            state.value.push(action.payload);
        }
    }
});
export const {addNotification} = notificationsSlice.actions;
export default notificationsSlice.reducer;
