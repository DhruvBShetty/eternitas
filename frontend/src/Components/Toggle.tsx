import React, { useState } from "react";

type togglestate = {
  tstate: boolean;
};

const Toggleopt: React.FC<togglestate> = ({ tstate }) => {
  const [togglestate, setTogglestate] = useState<boolean>(tstate);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTogglestate(event.target.checked);
  };

  return (
    <label className="switch">
      <input type="checkbox" checked={togglestate} onChange={handleChange} />
      <span className="slider round">{togglestate ? "Private" : "Public"}</span>
    </label>
  );
};

export default Toggleopt;
