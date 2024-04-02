import BasicHeader from '@/components/basic-header';
import { Outlet } from 'react-router-dom';

export default function BasicLayout() {
  return (
    <div className="flex-col flex items-center min-h-screen justify-center">
      <BasicHeader />
      <Outlet />
    </div>
  );
}
