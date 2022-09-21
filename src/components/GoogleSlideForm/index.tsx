import React from "react";
import { useForm } from "react-hook-form";

const GoogleSlideForm = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("url", { required: true })} />
        {errors.url && <span>This field is required</span>}
        <input type="submit" />
      </form>
    </>
  );
};

export default GoogleSlideForm;
