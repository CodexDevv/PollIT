import { Outlet } from 'react-router-dom';

function Content() {
  return (
    <div className="flex flex-col items-center space-y-2 p-2 pt-16 text-white">
      <Outlet />
    </div>
  );
}

export default Content;
