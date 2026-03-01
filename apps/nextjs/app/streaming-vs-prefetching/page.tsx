import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "../prefetching/get-query-client"
import { waitOpt } from "../streaming/rq"
import { PrefetchingClient } from "./prefetching"
import { StreamingClient } from "./streaming"

export default function Page() {
  return <div>
    <h1>Streaming vs. Prefetching</h1>
    <div className="flex gap-3">
      {/* <StreamingClient /> */}
      <PrefetchingServer />
    </div>
  </div>
}

const PrefetchingServer = () => {
    const queryClient = getQueryClient()
  
    void queryClient.prefetchQuery(waitOpt(5001))
    return <HydrationBoundary state={dehydrate(queryClient)}><PrefetchingClient /></HydrationBoundary>
}