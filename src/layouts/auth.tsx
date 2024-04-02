import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex flex-col h-full min-h-screen items-center justify-center">
      <Outlet />
    </div>
  );
}
