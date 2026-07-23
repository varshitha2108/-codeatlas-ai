interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
}

export function RadioGroup({ name, options, value, onChange }: RadioGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 text-sm text-primary cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
           onChange={() => {
  console.log('Radio clicked:', option.value)
  onChange(option.value)
}}
            className="accent-accent"
          />
          {option.label}
        </label>
      ))}
    </div>
  )
}