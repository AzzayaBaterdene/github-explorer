type RepoCardProps = {
    name : string,
    description : string,
    language : string,
    stars : number,
    forks?: number
}

export function RepoCard({ name, description, language, stars, forks }: RepoCardProps) {
    return (
        <div className="repo-card">
            <h2 className="repo-card__name">{name}</h2>
            <p className="repo-card__description">{description}</p>
            <div className="repo-card__stats">
                <span className="repo-card__language">{language}</span>
                <span className="repo-card__stars">⭐ {stars}</span>
                {forks !== undefined && (
                    <span className="repo-card__forks">🍴 {forks}</span>
                )}
            </div>
        </div>
    )
}