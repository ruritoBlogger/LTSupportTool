import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  url: z.string().url({
    message:
      "不正な値が入力されています。Google Slideのurlを入力してください。",
  }),
});

const GoogleSlideForm = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = (data) => console.log(data);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("url")} />
        {/* FIXME: asで握り潰すのは良くないので何とかしたい */}
        {errors.url?.message && <p>{errors.url?.message as string}</p>}
        <input type="submit" />
      </form>
    </>
  );
};

export default GoogleSlideForm;
