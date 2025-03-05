import { configureStore } from "@reduxjs/toolkit";
import FormSlice from "./feature/Api.Slice"
export const store = configureStore({
    reducer: {
            formData:FormSlice,
            
        }
})