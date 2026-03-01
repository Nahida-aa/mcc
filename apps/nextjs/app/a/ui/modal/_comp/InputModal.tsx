"use client";

import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { MessageSquare, Loader2, SquarePen, SquarePenIcon } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";

type InputModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  placeholder?: string;
  onSubmit?: (value: string) => void | Promise<void>;
  defaultValue?: string;
  inputSchema?: z.ZodString;
  confirmText?: string;
  cancelText?: string;
};

export function InputModal({
  isOpen,
  onClose,
  title,
  placeholder = "请输入...",
  onSubmit,
  defaultValue = "",
  inputSchema = z.string(),
  confirmText = "确定",
  cancelText = "取消",
}: InputModalProps) {
  const formSchema = z.object({
    value: inputSchema,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // 关键：实时验证，修复 Dialog 中错误不显示
    defaultValues: {
      value: defaultValue,
    },
  });

  const _onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!onSubmit) return;

    try {
      await onSubmit(data.value);
      onClose();
    } catch (err) {
      console.error("Prompt submit failed:", err);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      _onSubmit(form.getValues());
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SquarePenIcon className="w-5 h-5 text-blue-500" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(_onSubmit)}>
          <Controller
            name="value"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {/* <FieldLabel>输入内容</FieldLabel> */}
                <InputGroup>
                  <Input
                    placeholder={placeholder}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    onKeyDown={handleKeyDown} // 加键盘支持
                  />
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Field orientation="horizontal">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={form.formState.isSubmitting}
            >
              {cancelText}
            </Button>
            <Button disabled={form.formState.isSubmitting} className="min-w-[80px]">
              {form.formState.isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                confirmText
              )}
            </Button>
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
}
