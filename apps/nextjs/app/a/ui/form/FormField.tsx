import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import React from 'react'
import {
  Controller,
  useForm,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

// interface FormFieldProps extends

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  render,
  label,
  ...props
}: ControllerProps<TFieldValues, TName> & {
  label?: string
  description?: string
}) => {
  return (
    <Controller
      {...props}
      render={({ field, fieldState, formState }) => (
        <Field data-invalid={fieldState.invalid} className="gap-1">
          {label && <FieldLabel className="mb-1">{label}</FieldLabel>}
          {render({ field, fieldState, formState })}
          {fieldState.invalid && (
            <FieldError className="text-xs" errors={[fieldState.error]} />
          )}
          {props.description && <FieldDescription>{props.description}</FieldDescription>}
        </Field>
      )}
    />
  )
}
export interface InputProps extends React.ComponentProps<'input'> {
  invalid?: boolean
}
export const Input = ({ invalid, children, className, ...props }: InputProps) => {
  return (
    <InputGroup className="max-w-120">
      <InputGroupInput {...props} aria-invalid={invalid} className={className} />
      {children}
    </InputGroup>
  )
}
export const Textarea = ({
  invalid,
  children,
  className,
  ...props
}: React.ComponentProps<'textarea'> & { invalid?: boolean }) => {
  return (
    <InputGroup className="max-w-120">
      <InputGroupTextarea {...props} aria-invalid={invalid} className={className} />
      {children}
    </InputGroup>
  )
}
