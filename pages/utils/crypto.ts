import { genSalt, hash} from "bcrypt"

export async function hashPassword(password:String) {
    const cantSaltos = await genSalt(10);
    const passwordHash = await hash(password, cantSaltos);

    return passwordHash;
    
}