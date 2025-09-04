import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Updated apiRequest to handle both signatures
export async function apiRequest(
  urlOrMethodOrOptions: string | RequestInit,
  urlOrOptions?: string | RequestInit,
  data?: unknown | undefined,
): Promise<Response> {
  let url: string;
  let options: RequestInit;

  // Handle new signature: apiRequest(url, { method, body, headers })
  if (typeof urlOrMethodOrOptions === 'string' && typeof urlOrOptions === 'object') {
    url = urlOrMethodOrOptions;
    options = {
      credentials: "include",
      ...urlOrOptions,
    };
  }
  // Handle old signature: apiRequest(method, url, data)
  else if (typeof urlOrMethodOrOptions === 'string' && typeof urlOrOptions === 'string') {
    url = urlOrOptions;
    options = {
      method: urlOrMethodOrOptions,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    };
  } else {
    throw new Error('Invalid apiRequest parameters');
  }

  const res = await fetch(url, options);
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
