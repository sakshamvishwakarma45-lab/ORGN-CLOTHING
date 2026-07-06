import Link from 'next/link';
import { cn } from '@/lib/utils';

const sizeMap = {
  sm: 'text-2xl text-pop-xs',
  md: 'text-3xl text-pop-sm',
  lg: 'text-6xl md:text-7xl text-pop',
  xl: 'text-8xl md:text-[10rem] text-pop-lg',
};

export function Wordmark({
  size = 'md',
  className,
  as: Tag = 'span',
  linkTo,
}: {
  size?: keyof typeof sizeMap;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'div';
  linkTo?: string;
}) {
  const content = (
    <Tag className={cn('font-display font-black leading-none tracking-tight text-ink', sizeMap[size], className)}>
      ORGN
    </Tag>
  );

  if (linkTo) {
    return <Link href={linkTo}>{content}</Link>;
  }
  return content;
}
