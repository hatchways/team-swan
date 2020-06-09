import React from "react";
import { CheckBoxOutlineBlankOutlined, CheckBox } from "@material-ui/icons";
import {
  makeStyles,
  InputAdornment,
  Container,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  OutlinedInput,
  InputLabel,
} from "@material-ui/core";

const CustomRadioGroup = ({
  unCheckedIcon,
  checkedIcon,
  value,
  handleChange,
  fields,
  title,
  className,
  showTitle = false,
}) => {
  return (
    <FormControl component="fieldset" className={className}>
      {showTitle && <FormLabel component="legend">{title}</FormLabel>}
      <RadioGroup name={title} value={value} onChange={handleChange}>
        {fields.map((field) => {
          return Object.keys(field).map((key) => {
            return (
              <FormControlLabel
                value={key}
                control={
                  <Radio icon={unCheckedIcon} checkedIcon={checkedIcon} />
                }
                label={field[key]}
              />
            );
          });
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default CustomRadioGroup;
