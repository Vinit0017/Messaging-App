import bcrypt from "bcryptjs";

export async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
};

export async function matchPassword(password, userPassword /*from database*/) {
    return await bcrypt.compare(password, userPassword);
};