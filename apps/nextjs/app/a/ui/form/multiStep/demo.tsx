"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, FormProvider, useFormContext } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useMemo, useState } from "react";
import { FileInput } from "@/components/ui/file-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  fileFieldBbf04f3a: z
    .array(z.instanceof(File))
    .min(1, "File Field must be at least 1 file"),
  selectField1a0db135: z
    .string()
    .refine(
      (val) => ["option1", "option2"].includes(val),
      "Select Field must be a valid option",
    ),
  textFieldB19823c8: z.string().max(255, "Text Field must be at most 255 characters"),
});

type FormSchema = z.infer<typeof formSchema>;
const renderCurrentStepContent = (step: number, control: any) => {
  // const { control } = useFormContext();
  switch (step) {
    case 0: {
      return (
        <FieldGroup>
          <Controller
            name="fileFieldBbf04f3a"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fileFieldBbf04f3a">File Field</FieldLabel>
                <FieldDescription></FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                <FileInput
                  {...field}
                  id="fileFieldBbf04f3a"
                  aria-invalid={fieldState.invalid}
                  maxFiles={1}
                  maxSize={5242880}
                  variant="default"
                  previewSize="md"
                  multiple={false}
                  showPreview={true}
                  accept="image/*"
                  disabled={false}
                />
              </Field>
            )}
          />
        </FieldGroup>
      );
    }

    case 1: {
      return (
        <FieldGroup>
          <Controller
            name="selectField1a0db135"
            control={control}
            render={({ field, fieldState }) => {
              const options = [
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
              ];

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="selectField1a0db135">Select Field</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={false}
                  >
                    <SelectTrigger
                      id="selectField1a0db135"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select an option</SelectLabel>
                          {options.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                  <FieldDescription></FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />

          <Controller
            name="textFieldB19823c8"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="textFieldB19823c8">Text Field</FieldLabel>
                <Input
                  {...field}
                  id="textFieldB19823c8"
                  aria-invalid={fieldState.invalid}
                  placeholder=""
                  autoComplete="off"
                  disabled={false}
                />
                <FieldDescription></FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      );
    }

    default: {
      return null;
    }
  }
};
export const MultiForm = () => {
  const steps = [
    {
      title: "Step 1",
      description: "",
      fields: ["fileFieldBbf04f3a"],
    },
    {
      title: "Step 2",
      description: "",
      fields: ["selectField1a0db135", "textFieldB19823c8"],
    },
  ] as const;

  const [step, setStep] = useState(0);

  const currentForm = steps[step];

  const isLastStep = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileFieldBbf04f3a: [],
      selectField1a0db135: "",
      textFieldB19823c8: "",
    },
    shouldUnregister: true,
    mode: "onChange",
  });
  // 升级：用 getFieldState 检查 isValid（包括初始/required）
  const currentStepInvalid = useMemo(() => {
    const currentFields = steps[step].fields;
    return currentFields.every((field) => {
      const formState = form.getFieldState(field as keyof FormSchema);
      console.log(field, formState);
      return formState.invalid;
    });
  }, [step, form, steps[step]]); // 依赖 form（内部 formState）

  const handleNextButton = async () => {
    const currentFields = steps[step].fields;

    const isValid = await form.trigger(currentFields);

    if (isValid && !isLastStep) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBackButton = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (values: FormSchema) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Form successfully submitted");

    console.log(values);
  };

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle>{currentForm.title}</CardTitle>
            <p className="text-muted-foreground text-xs">
              Step {step + 1} of {steps.length}
            </p>
          </div>
          <CardDescription>{currentForm.description}</CardDescription>
        </div>
        <Progress value={progress} />
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form id="multi-form" onSubmit={form.handleSubmit(onSubmit)}>
            {renderCurrentStepContent(step, form.control)}
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter>
        <Field className="justify-between" orientation="horizontal">
          {step > 0 && (
            <Button type="button" variant="ghost" onClick={handleBackButton}>
              <ChevronLeft /> Back
            </Button>
          )}
          {!isLastStep && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleNextButton}
              disabled={currentStepInvalid}
              // disabled
            >
              Next
              <ChevronRight />
            </Button>
          )}
          {isLastStep && (
            <Button
              type="submit"
              form="multi-form"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner /> : "Submit"}
            </Button>
          )}
        </Field>
      </CardFooter>
    </Card>
  );
};
