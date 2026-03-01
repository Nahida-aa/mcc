"use server"


export  const apiWait = async (wait:number) =>{
  await new Promise((resolve) => setTimeout(resolve, wait))
  return `waited ${wait}ms`
}