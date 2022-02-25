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
        },
        upsertNotification: (state, action: PayloadAction<INotificationProps>) => {
            const idx = state.value.findIndex(notification => notification.id === action.payload.id);
            if (idx > -1) {
                state.value.splice(idx, 1, action.payload);
            } else {
                state.value.push(action.payload);
            }
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            const idx = state.value.findIndex(notification => notification.id === action.payload);
            if (idx > -1) {
                state.value.splice(idx, 1);
            }
        }
    }
});
export const {addNotification, upsertNotification, removeNotification} = notificationsSlice.actions;
export default notificationsSlice.reducer;
