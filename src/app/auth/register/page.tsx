import { RegisterForm } from '@/components/registerForm';
import { createItem } from '@/app/api/auth/register/route';

export default function Register() {
  return (
    <div>
      <h1>Registreer</h1>
      <RegisterForm createItem={createItem} />
    </div>
  );
}
