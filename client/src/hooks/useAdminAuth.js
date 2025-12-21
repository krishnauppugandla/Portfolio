import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export function useAdminAuth() {
  const { admin, loading, verify } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    verify().then((valid) => {
      if (!valid) navigate('/admin/login', { replace: true });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { admin, loading };
}
