'use client'

import { z } from 'zod'
import {
  useForm,
  type AnyFieldMeta,
  type FormState,
  type useField,
} from '@tanstack/react-form'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldGroup,
} from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { FileInput } from '@/components/ui/file-input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useState, type JSX } from 'react'
import { createFormHookContexts, createFormHook } from '@tanstack/react-form'

import { toast } from 'sonner'
import { useAppForm } from '@/hooks/useAppForm'

const formSchema = z.object({
  fileFieldBbf04f3a: z
    .array(z.custom<File>(val => val instanceof File))
    .min(1, 'File Field must be at least 1 file'),
  selectField1a0db135: z
    .string()
    .refine(
      val => ['option1', 'option2'].includes(val),
      'Select Field must be a valid option',
    ),
  textFieldB19823c8: z
    .string()
    .min(1, 'Text Field must be at least 1 character')
    .max(255, 'Text Field must be at most 255 characters'),
})

type FormSchema = z.infer<typeof formSchema>

export const MultiForm = () => {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: 'Step 1',
      fields: ['fileFieldBbf04f3a'],
    },
    {
      title: 'Step 2',
      fields: ['selectField1a0db135', 'textFieldB19823c8'],
    },
  ] as const
  const isLastStep = step === steps.length - 1
  const progress = ((step + 1) / steps.length) * 100

  const form = useAppForm({
    defaultValues: {
      fileFieldBbf04f3a: [] as File[],
      selectField1a0db135: 'option1',
      textFieldB19823c8: '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('form.onSubmit:', value)
    },
  })

  const handleNextButton = async () => {
    const currentFields = steps[step].fields
    console.log('handleNextButton.currentFields:', currentFields)
    // 验证
    await Promise.all(currentFields.map(name => form.validateField(name, 'change')))

    // 检查
    const hasErrors = currentFields.some(field => {
      const errLen = form.getFieldMeta(field as keyof FormSchema)?.errors.length
      return errLen ? errLen > 0 : false
    })
    if (!hasErrors && !isLastStep) {
      setStep(prev => prev + 1)
      console.log('下一步')
      return
    }
    console.log('无法下一步, 验证未通过')
  }

  const handleBackButton = () => {
    if (step > 0) {
      setStep(prev => prev - 1)
    }
  }

  const renderCurrentStepContent = () => {
    switch (step) {
      case 0: {
        return (
          <FieldGroup>
            <form.AppField name="fileFieldBbf04f3a">
              {field => <field.FileInput />}
            </form.AppField>
            <form.Subscribe
              selector={state => state.values.fileFieldBbf04f3a}
              children={files => (
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              )}
            />
          </FieldGroup>
        )
      }

      case 1: {
        return (
          <FieldGroup>
            <form.Field
              name="selectField1a0db135"
              children={field => {
                const invalid = !field.state.meta.isValid && field.state.meta.isTouched
                const options = [
                  { label: 'Option 1', value: 'option1' },
                  { label: 'Option 2', value: 'option2' },
                ]

                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor="selectField1a0db135">Select Field</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      disabled={false}
                    >
                      <SelectTrigger id="selectField1a0db135" aria-invalid={invalid}>
                        <SelectValue placeholder="" />
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select an option</SelectLabel>
                            {options.map(item => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                    <FieldDescription></FieldDescription>
                    {invalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
            <form.AppField
              name="textFieldB19823c8"
              children={field => <field.FieldInput title="Text Field" />}
            />
          </FieldGroup>
        )
      }

      default: {
        return null
      }
    }
  }
  // 共享 selector 逻辑（避免重复）
  const createSelector = () => (state: typeof form.state) => {
    console.log('createSelector.state.values:', state.values)
    console.log('createSelector.state.errors:', state.errors)
    const currentFields = steps[step].fields
    let hasErrors = false
    let isTouched = false
    for (const field of currentFields) {
      const meta = state.fieldMeta[field as keyof FormSchema]
      if (meta) {
        if (meta.errors.length > 0) hasErrors = true
        if (meta.isTouched) isTouched = true
      }
      // 早停：如果已确定 hasErrors 和 hasTouched，都 true 时停止
      if (hasErrors && isTouched) break
    }
    return {
      canNext: !(hasErrors || (step === 0 && !isTouched)),
      isTouched,
      isSubmitting: state.isSubmitting,
    }
  }
  return (
    <form.AppForm>
      <form
        onSubmit={e => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2>{steps[step].title}</h2>
          </div>
          <Progress value={progress} />
        </div>
        {renderCurrentStepContent()}
        <Field className="justify-between" orientation="horizontal">
          {step > 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(prev => prev - 1)}
            >
              <ChevronLeft /> Back
            </Button>
          )}

          {!isLastStep && (
            <form.NextButton
              isFirstStep={step === 0}
              currentFields={steps[step].fields}
              handleNext={handleNextButton}
            />
          )}

          {isLastStep && <form.SubmitButton />}
        </Field>
      </form>
    </form.AppForm>
  )
}
