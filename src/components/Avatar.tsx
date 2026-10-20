type AvatarProps = {
    src: string,
    alt: string,
    size?: number,
}

export function Avatar({ src, alt, size = 100 }: AvatarProps) {
    return (
        <img
            src={src}
            alt={alt}
            width={size}
            height={size}
            style={{ borderRadius: '50%' }}
        />
    )
}

