export const Select = ({
  value,
  onValueChange,
  children,
  className = '',
  trigger,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  trigger?: React.ReactNode;
}) => {
  return (
    <div className='relative'>
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={`flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          trigger ? 'opacity-0 absolute inset-0 cursor-pointer' : ''
        } ${className}`}
      >
        {children}
      </select>
      {trigger && <div className='pointer-events-none'>{trigger}</div>}
    </div>
  );
};
