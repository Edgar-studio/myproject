import { toast } from "react-toastify";

export const notify = (text, color = "green", autoClose = 1000) => {
    toast(text, {
        position: 'bottom-right',
        autoClose: autoClose,
        style: {
            background: color,
            color: "white",
            borderRadius: "8px",
            padding: "12px 18px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            fontSize: "16px",
        }
    });
};
