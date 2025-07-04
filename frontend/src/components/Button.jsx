import styles from "./Button.module.css";

function Button({ children, onClick, type = "button", disabled = false }) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${styles.btn} ${styles[type]}`}
    >
      {children}
    </button>
  );
}

export default Button;
