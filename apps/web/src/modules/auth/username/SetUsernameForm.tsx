"use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
// import { useDebounceCallback } from "usehooks-ts";
import z from "zod";
// import { SaveButton } from "@/app/a/ui/form/Button";
// import { FormField, Input } from "@/app/a/ui/form/FormField";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { useAppForm } from "@/hooks/useAppForm";
import type { AuthUser } from "@/modules/auth/auth";
import { authClient } from "@/modules/auth/client";
import { maskPhone, usernameSchema } from "@/modules/auth/type";
import { updateUser } from "@/modules/user/action";

const formSchema = z.object({
  username: usernameSchema,
});
export default function SetUsernameForm({
  onSuccess,
  user,
}: {
  onSuccess?: () => void;
  user: AuthUser;
}) {
  // const { session, mutateSession } = useSession();
  // const { user, mutateUser } = useUser(session!.user.id);
  const form = useAppForm({
    validators: {
      onChange: formSchema,
    },
    defaultValues: { username: user.username },
    onSubmit: async ({ value }) => {
      await updateUser(value);
      toast.success("修改成功");
      // mutateSession();
      onSuccess?.();
    },
  });

  const checkUsernameAvailability = async (username: string) => {
    // 先通过基础验证
    const basicValidation = formSchema.shape.username.safeParse(username);
    if (!basicValidation.success) {
      // setUsernameValidation("idle");
      return;
    }

    // setUsernameValidation("checking");
    // setUsernameError(null);
    const { data, error } = await authClient.isUsernameAvailable({
      username,
    });

    if (error || !data) {
      // setUsernameValidation("idle");
      // setUsernameError("检查失败，请稍后重试");
      return;
    }
    if (data.available) {
      // setUsernameValidation("available");
      // setUsernameError(null);
    } else {
      // setUsernameValidation("taken");
      // setUsernameError(data.message || "用户名已被占用");
      form.setErrorMap({
        onChange: {},
      });
      return "用户名已被占用";
      // setError("username", {
      //   type: "manual",
      //   message: "用户名已被占用",
      // });
    }
  };
  // const debounced = useDebounceCallback(checkUsernameAvailability, 500);
  // const handleUsernameChange = (value: string) => {
  //   if (value !== user.username) {
  //     debounced(value);
  //   }
  // };

  return (
    <form.AppForm>
      <form.Form onSubmit={form.handleSubmit}>
        <form.AppField
          asyncDebounceMs={600}
          validators={{
            onChangeAsync: async ({ value }) =>
              checkUsernameAvailability(value),
          }}
          name="username"
        >
          {(field) => (
            <field.FieldInput description="您的唯一标识符，请谨慎修改" />
          )}
        </form.AppField>
        <Field orientation="horizontal" className="justify-end">
          <form.SubmitButton label="保存" />
        </Field>
        {/* <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="username"
            description="您的唯一标识符，请谨慎修改"
            render={({ field, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  handleUsernameChange(e.target.value);
                }}
                invalid={invalid}
              />
            )}
          />
          <Field orientation="horizontal" className="justify-end">
            <SaveButton
              pending={formState.isLoading}
              disabled={!formState.isDirty || !formState.isValid}
            />
          </Field>
        </form> */}
      </form.Form>
    </form.AppForm>
  );
}
