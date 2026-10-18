import styles from '../styles/components/Tag.module.css'

export const Tag = ({text, onClick}) => {
    return (
        <div className={styles.wrap} onClick={onClick}>
            <p>{text}</p>
        </div>
    )
}