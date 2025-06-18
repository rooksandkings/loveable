import { lazy, Suspense } from 'react';
import { Icons, IconName } from '@/utils/icons';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

const Icon = ({ name, size = 24, ...props }: IconProps) => {
  const IconComponent = Icons[name];

  return (
    <Suspense fallback={<div style={{ width: size, height: size }} />}>
      <IconComponent size={size} {...props} />
    </Suspense>
  );
};

export default Icon; 