import React from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";

interface FormInput {
  url: string;
}

const schema = z.object({
  url: z.string().url({
    message:
      "不正な値が入力されています。Google Slideのurlを入力してください。",
  }),
});

const GoogleSlideForm = (): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<FormInput> = (data) => console.log(data);

  return (
    <>
      <Controller
        name={"url"}
        control={control}
        render={({ field }) => <TextField {...field} />}
      />
      {/* FIXME: asで握り潰すのは良くないので何とかしたい */}
      {errors.url?.message && <p>{errors.url?.message as string}</p>}
      <Button onClick={handleSubmit(onSubmit)}>スライドを変更</Button>
    </>
  );
};

export default GoogleSlideForm;
