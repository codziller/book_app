import React from "react";
import Select from "react-select";

export default function AppSelect({
  className,
  options,
  value,
  placeholder,
  handleChange,
  isLoading,
  defaultInputValue,
  showError,
  onFocus,
  errorMessage,
}) {
  return (
    <div className={`react-select-all-container mb-3 ${className}`}>
      <div className="error_message_text" style={{ marginTop: "" }}>
        {showError && <h6 style={{ color: "#F01919" }}>{errorMessage}</h6>}
      </div>

      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        hideSelectedOptions="true"
        // menuIsOpen={true}
        isFocussed={true}
        placeholder={placeholder}
        closeMenuOnSelect={true}
        isSelected={true}
        options={options}
        backspaceRemovesValue
        onChange={handleChange}
        value={value}
        isLoading={isLoading}
        defaultInputValue={defaultInputValue}
        onFocus={onFocus}
      />
    </div>
  );
}
