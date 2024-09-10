import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronUp } from 'lucide-react';

import { cn } from '@/utils';
import ArrowDropDown from '@/assets/arrow_drop_down.svg?react';
import CancelOutline from '@/assets/cancel_outline.svg?react';
import { NetworkErrorMessage } from './network-error-message';

interface OptionType {
  label: string;
  value: string;
}

export interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  placeholder?: React.ReactNode;
  options: OptionType[];
  triggerClassName?: string;
  clearable?: boolean;
  borderless?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  renderOption?: (option: OptionType) => React.ReactNode;
  onRefetch?: () => void;
  onChange?: (value: string, label: string) => void;
  onClick?: () => void;
}

const Select = ({
  triggerClassName,
  clearable,
  borderless,
  isLoading,
  isError,
  renderOption = option => option.label,
  onRefetch,
  onChange,
  onValueChange,
  onClick,
  onOpenChange,
  ...props
}: SelectProps) => {
  const handleChange = (value: string) =>
    onValueChange
      ? onValueChange(value)
      : onChange?.(value, props.options.find(option => option.value === value)?.label || '');
  return (
    <SelectPrimitive.Root
      {...props}
      onValueChange={handleChange}
      onOpenChange={onClick || onOpenChange}
    >
      <SelectTrigger
        className={cn(
          borderless && 'bg-background-secondary border-line-primary text-base',
          triggerClassName,
        )}
      >
        <SelectValue placeholder={props.placeholder} />
        {clearable && props.value && (
          <CancelOutline
            width={18}
            height={18}
            className='text-icon-fade-contrast pointer-events-auto absolute z-50 right-9'
            onClick={() => handleChange?.('')}
          />
        )}
      </SelectTrigger>
      <SelectContent className={cn(isLoading && 'min-h-16', isError && 'min-h-20')}>
        <NetworkErrorMessage
          isLoading={isLoading}
          isError={isError}
          textSize='sm'
          center
          onRefetch={onRefetch}
        />
        {props.options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {renderOption(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectPrimitive.Root>
  );
};
Select.displayName = SelectPrimitive.Value.displayName;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Value ref={ref} className={cn('text-sm', className)} {...props} />
));
SelectValue.displayName = SelectPrimitive.Value.displayName;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'relative flex h-9 w-full items-center gap-1 rounded-lg border border-line-primary bg-[transparent] pl-4 pr-3 py-2 text-sm tracking-[0.1px] truncate leading-5 text-left text-foreground ring-offset-background transition-colors duration-300 ease-in-out data-[placeholder]:text-foreground hover:bg-background-contrast-fade/20 focus:outline-none focus:border-line-focused disabled:cursor-not-allowed disabled:opacity-50 [&>span]:pr-3 [&>span]:truncate [&>span]:mr-auto',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ArrowDropDown className='min-h-6 min-w-6 text-icon-fade-contrast' />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className='h-4 w-4' />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ArrowDropDown className='h-4 w-4' />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-line-primary bg-background text-popover-foreground shadow-base data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'py-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center py-2 pl-3 pr-8 text-sm outline-none focus:bg-background-theme-fade data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <span className='absolute right-4 flex h-3.5 w-3.5 items-center justify-center text-foreground-secondary'>
      <SelectPrimitive.ItemIndicator>
        <Check className='h-4 w-4' />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
