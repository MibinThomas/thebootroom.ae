import { cn } from "@/lib/utils/cn";
export function Input({className,...props}:React.InputHTMLAttributes<HTMLInputElement>){return <input className={cn("w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-bootred/50 focus:ring-2 focus:ring-bootred/10",className)} {...props} />;}
