import { cn } from "@/lib/utils/cn";
export function Field({className,...props}:React.HTMLAttributes<HTMLDivElement>){return <div className={cn("space-y-2",className)} {...props} />;}
export function ErrorText({children}:{children?:string}){if(!children) return null; return <p className="text-xs text-bootred">{children}</p>;}
