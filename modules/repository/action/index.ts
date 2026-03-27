
"use server"
import prisma from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { createWebhook, getRepositories } from "@/modules/github/lib/github"
import { create } from "domain"



export const fetchRepositories = async( page: number=1 ,  perPage : number = 10)=>{

    const session = await auth.api.getSession({
        headers : await headers()
    })

    if( !session){
        throw new  Error("Unauthorized")  ;
    }

    const gitHubRepos = await getRepositories( page , perPage)

    const dbRepos = await prisma.repository.findMany({
        where : {
            userId : session.user.id
        }

    })

const connetedRepoIds = new Set(dbRepos.map((repo => repo.githubId)))

return gitHubRepos.map((repo: any)=>({
    ...repo,
    isConnected : connetedRepoIds.has(BigInt(repo.id))
}))


}


export const connectRepository = async(  owner : string, repo : string, githubId : number )=>{

    const session = await auth.api.getSession({
        headers : await headers()
    })

    if( !session){
        throw new  Error("Unauthorized")  ;
    }   

    // check if user can connect to more repositories
    
    const webhook =  await createWebhook(owner , repo)

    if( webhook){
        await prisma.repository.create({
        data : {
            githubId : BigInt(githubId) ,
            name : repo ,
            owner ,
            fullName : `${owner}/${repo}`,
            url : `https://github.com/${owner}/${repo}`,
            userId : session.user.id

        }
        
        })

    }

    // increment repository count for user
    // triger repository  indexingfro rag



    return webhook ;


}


   