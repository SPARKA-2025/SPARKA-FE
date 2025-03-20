import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function Dropdown({
  name,
  defaultValue,
  options = [],
  className = "",
}) {
  return (
    <>
      <FormControl className={className} fullWidth>
        <InputLabel id="demo-simple-select-label" className="bg-white px-2">
          {name}
        </InputLabel>
        <Select
          //   labelId="demo-simple-select-label"
          id={name}
            defaultValue={defaultValue}
          //   label={name}
          //   onChange={handleChange}
        >
          {options.map((opt, index) => (
            <MenuItem key={index} value={opt?.value || "Null"}>
              {opt?.label || opt?.value || "null"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
