export type validateResult = {
    type: string;
    message: string | undefined;
}
export function validateName(name: string): validateResult{
    let result: validateResult = {
        type: "success",
        message: undefined
    }
    if(name.length < 2){
        result.type = "error";
        result.message = "Name error";
    }
    return result;
}
export function validatePrice(num: number): validateResult{
    let result: validateResult = {
        type: "success",
        message: undefined
    }
    if(num < 1){
        result.type = "error";
        result.message = "Price must be more then 0";
    }
    return result;
}