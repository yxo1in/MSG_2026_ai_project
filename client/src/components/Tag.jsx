import styles from '../styles/components/Tag.module.css'

export const Tag = ({text}) => {
    return (
        <div className={styles.wrap}>
            <p>{text}</p>
        </div>
    )
}