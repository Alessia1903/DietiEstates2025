import React from "react";

const hhmmToSeconds = (hhmm) => {
  const [hh, mm] = hhmm.split(":").map(Number);
  return hh * 3600 + mm * 60;
};
const secondsToHhmm = (sec) => {
  const hh = Math.floor(sec / 3600);
  const mm = Math.floor((sec % 3600) / 60);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}`;
};

const generateTimeOptions = (min = "07:00", max = "21:00", stepMinutes = 30) => {
  const start = hhmmToSeconds(min);
  const end = hhmmToSeconds(max);
  const step = stepMinutes * 60;
  const opts = [];
  for (let s = start; s <= end; s += step) {
    opts.push(secondsToHhmm(s));
  }
  return opts;
};

const TimeSelect = ({ value, onChange, id = "visit-time", className = "" }) => {
  const options = generateTimeOptions("07:00", "21:00", 30);

  return (
    <div className="pvm-time-row">
      <label htmlFor={id} className="pvm-label">Orario:</label>
      <select
        id={id}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`pvm-time-input ${className}`}
        aria-label="Seleziona orario"
      >
        <option value="">Seleziona orario</option>
        {options.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeSelect;