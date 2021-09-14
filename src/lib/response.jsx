import { toast } from 'react-toastify'

export const responseHelper = (res, callback) => {
    if(res.status !== "0"){
        toast.success(res.msg);
        callback()
    }else toast.error(res.msg)
}
