import toast from 'react-hot-toast';

export const notify = (
    message: string, 
    type: "error" | "success" | "info", 
    time: number = 1750, 
    position: "bottom-right" 
        | "top-center" 
        | "top-right" = "top-center"
    ) => {
    if(type === "error") toast.error(message, {duration: time, style: {maxWidth: "400px"}});
    else if (type === "success") toast.success(message, {duration: time, style: {maxWidth: "400px"}, position: position});
    else if (type === "info") toast(message, {duration: time, style: {maxWidth: "400px"}, position: position});
};