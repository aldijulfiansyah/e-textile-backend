import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()



export const getUsers = async(req, res) =>{
    try {
        const response = await prisma.users.findMany()
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
        
    }
}

export const getUserById = async(req, res) =>{
    try {
        const response = await prisma.users.findUnique({
            where: {
                id: Number(req.params.id)
            }
        })
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({msg: error.message})
        
    }
}



export const createUser = async(req, res) =>{

}



export const updateUser = async(req, res) =>{

}

export const deleteUser = async(req, res) =>{

}