import style from "../styles/components/Header.module.css";
import { Link } from "react-router-dom";

export const Header = ({ className = "" }) => {
  return (
    <div className={`${style.header} ${className}`}>
      <Link to="/" className={style.title}>vibe.lab</Link>
    </div>
  );
};
