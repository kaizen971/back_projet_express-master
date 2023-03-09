import bcrypt from "bcrypt";

export function hashPassword(password) {
   return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password,hash) {
    return  bcrypt.compareSync(password, hash);
}

export const manipulateDate = (date) => {
    const dateForm = new Date(date);
    const formattedDate = dateForm.toISOString().substr(0, 10);
    return formattedDate;
}