import style from "../styles/components/Header.module.css";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className={style.header}>
      <Link to="/" className={style.title}>vibe.lab</Link>
    </div>
  );
};
