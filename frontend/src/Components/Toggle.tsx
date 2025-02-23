import React, { useState } from "react";
import { changevisibility } from "../api";

type togglestate = {
  tstate: boolean;
};

const Toggleopt: React.FC<togglestate> = ({ tstate }) => {
  const [togglestate, setTogglestate] = useState<boolean>(tstate);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const togglechange: boolean = event.target.checked;
    await changevisibility(togglechange).then(() => {
      setTogglestate(togglechange);
    });
  };

  return (
    <label className="switch">
      <input type="checkbox" checked={togglestate} onChange={handleChange} />
      <span className="slider round">{togglestate ? "Private" : "Public"}</span>
    </label>
  );
};

export default Toggleopt;
