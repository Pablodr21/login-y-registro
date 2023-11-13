

import { emailRegex, passwordRegex } from "@/pages/utils/regex";
import {PrismaClient} from "@prisma/client"
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient()

export async function POST(req: Request){
    const usuario = await req.json();

    if(!usuario.email.match(emailRegex))
    return new Response("email invlido",{status:400});

    if(!usuario.password.match(passwordRegex))
    return new Response("Contraseña invalida", {status:400})

    const cuentaExiste = await prisma.usuario.findUnique({
        where:{
            email: usuario.email
        }
    })

    if(!cuentaExiste) new Response("Cuenta invalida!",{status:403})

    //si la contraseña coincide con la base de datos
    const contrasenaValida = await compare(
        usuario.password,
        cuentaExiste.password);

        if(!contrasenaValida)
        return new Response("Contraseña invalida", {status:401});
        
        const token = sign(cuentaExiste, process.env.TOKEN_SECRET as string, {expiresIn:"7dias"})


}