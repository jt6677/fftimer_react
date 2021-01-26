import React from "react";
import { useField } from "formik";
// import FormError from "./common/FormError";
import Input from "./common/Input";

const FormInput = ({ ariaLabel, name, type, placeholder }) => {
  const [field] = useField(name);
  return (
    <>
      <Input
        field={field}
        ariaLabel={ariaLabel}
        name={field.name}
        type={type}
        placeholder={placeholder}
      />
      {/* {meta.touched && meta.error ? (
        <FormError text={meta.error}></FormError>
      ) : null} */}
    </>
  );
};

export default FormInput;
