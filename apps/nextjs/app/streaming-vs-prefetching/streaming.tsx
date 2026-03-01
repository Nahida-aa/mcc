"use client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { waitOpt } from "../streaming/rq"
import { Suspense } from "react"

function MyComponent(props: { wait: number }) {
  const { data } = useSuspenseQuery(waitOpt(props.wait))

  return <div>result: {data}</div>
}

export function StreamingClient() {
  return <Suspense fallback={<div>waiting</div>}>
    <MyComponent wait={5002} />
  </Suspense>
}