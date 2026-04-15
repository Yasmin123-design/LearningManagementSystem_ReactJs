import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import { fetchProfile, setToken } from '../../features/auth/authSlice';

const AuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken) {
      dispatch(setToken({ accessToken, refreshToken: refreshToken ?? undefined }));

      dispatch(fetchProfile()).then((action) => {
        if (fetchProfile.fulfilled.match(action)) {
          const userRole = action.payload.role;
          if (userRole === 'instructor') {
            navigate('/instructorcourses', { replace: true });
          } else {
            navigate('/courses', { replace: true });
          }
        } else {
          navigate('/courses', { replace: true });
        }
      });
    } else {
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.1rem',
        color: '#6c757d',
      }}
    >
      Signing you in…
    </div>
  );
};

export default AuthSuccess;
