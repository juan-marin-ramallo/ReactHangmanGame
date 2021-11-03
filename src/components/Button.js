export const Button = (props) => {
  //Logica del Button
  return (
    <>
      <button
        className="button"
        disabled={props.disabled}
        onClick={() => props.onClick(props.caption)}
      >
        {props.caption}
      </button>
    </>
  );
};
