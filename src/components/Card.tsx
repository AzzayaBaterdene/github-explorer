import type { ReactNode } from "react"

type CardProps = {
    title: string, 
    action?: ReactNode,   //optional slot, e.g. a "View on GitHub" link
    children: ReactNode
}

export function Card({title, action, children}: CardProps){
    return(
        <section className="card">
            <header className="card-header">
                <h2>{title}</h2>
                {action && <div className="card-action">{action}</div>}
            </header>
            {children}
        </section>
    )
}