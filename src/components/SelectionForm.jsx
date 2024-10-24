// React Library Import
import { useController } from "react-hook-form";

// MUI Import
import {InputLabel, MenuItem, FormControl, Select, FormHelperText} from "@mui/material";

// Custom Import
import theme from "../assets/themes";

/**
 * A reusable SelectForm component for use with react-hook-form.
 *
 * @param {string} name - The name of the form field. It should match the key in the form data.
 * @param {Object} control - The react-hook-form control object used to manage form state.
 * @param {Array} options - An array of option objects for the select input. Each object should have `value` and `label` properties.
 * @param {string} label - The label for the select input field.
 * @param {boolean} required - A boolean indicating if the field is required.
 * @param {Function} onChange - A function for getting value to email
 * @returns {JSX.Element} A styled Select input component integrated with react-hook-form.
 *
 * @example
 * const options = [
 *   { id: 1, value: 'option1', label: 'Option 1' },
 *   { id: 2, value: 'option2', label: 'Option 2' },
 *   { id: 3, value: 'option3', label: 'Option 3' },
 * ];
 *
 * <SelectForm
 *   name="exampleSelect"
 *   control={control}
 *   options={options}
 *   label="Choose an option"
 *   required={true}
 *   onChange={(value) => console.log(value)}
 * />
 */

// =========== Start SelectForm ===========
const SelectForm = ({ name, control, options, label, required, onChange }) => {
    const validationEmailRules = { required: required ? `${label} is required` : false };
    const {
        field,
        fieldState: { error },
    } = useController({ name, control, rules: validationEmailRules });

    // Handle the change event and update the value in react-hook-form
    const handleChange = (event) => {
        // Update form state
        field.onChange(event.target.value);
        if (onChange) onChange(event.target.value);
    };

    return (
        <FormControl fullWidth error={!!error}>
            <InputLabel id={`${name}-label`}>{label}</InputLabel>
            <Select
                required={required}
                sx={{
                    borderRadius: theme.customShape.input,
                }}
                labelId={`${name}-label`}
                id={`${name}-select`}
                value={field.value || ""}
                label={label}
                onChange={handleChange}
                onBlur={field.onBlur}
                inputProps={{ "aria-required": required }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            borderRadius: theme.customShape.input,
                        },
                    },
                }}
            >
                {/* Render options for the select input */}
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            {/* Display validation error message if any */}
            {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
    );
};

export default SelectForm;
// =========== End SelectForm ===========