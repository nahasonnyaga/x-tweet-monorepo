import cn from 'clsx';

type IconName = keyof typeof Icons;

type IconProps = {
  className?: string;
};

type CustomIconProps = IconProps & {
  iconName: IconName;
};

export function CustomIcon({ iconName, className }: CustomIconProps): JSX.Element {
  const Icon = Icons[iconName];
  return <Icon className={className ?? 'h-6 w-6'} />;
}

// === ICONS BELOW === //

function TwitterIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={cn('fill-current', className)} viewBox="0 0 24 24">
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733..." />
    </svg>
  );
}

function FeatherIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={cn('fill-current', className)} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03..." />
    </svg>
  );
}

function SpinnerIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={cn('animate-spin', className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0..." />
    </svg>
  );
}

// ✅ NEW ICON
function ArrowPathIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={cn('animate-spin', className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12a7.5 7.5 0 1112.6 5.303L18 19m0 0v-4m0 4h-4"
      />
    </svg>
  );
}

function GoogleIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22..." />
    </svg>
  );
}

function AppleIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M16.365 1.43c0 1.14-.493 2.27..." />
    </svg>
  );
}

function TriangleIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.538 6.478c-.14-.146-.335-.228..." />
    </svg>
  );
}

function PinIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor">
      <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7..." />
    </svg>
  );
}

function PinOffIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor">
      <path d="M15 4.5l-3.249 3.249m-2.57 1.433..." />
    </svg>
  );
}

// === ICON MAP === //
const Icons = {
  PinIcon,
  PinOffIcon,
  AppleIcon,
  GoogleIcon,
  TwitterIcon,
  FeatherIcon,
  SpinnerIcon,
  TriangleIcon,
  ArrowPathIcon,
};
