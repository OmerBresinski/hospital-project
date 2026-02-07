import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';

// Validation schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggingIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Get the page user was trying to access
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(t('auth.loginError'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {t('auth.loginTitle')}
          </CardTitle>
          <CardDescription>{t('auth.loginDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field data-invalid={!!errors.username}>
              <FieldLabel htmlFor="username">{t('auth.username')}</FieldLabel>
              <Input
                id="username"
                placeholder={t('auth.usernamePlaceholder')}
                {...register('username')}
              />
              {errors.username && (
                <FieldError>{errors.username.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">{t('auth.password')}</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                {...register('password')}
              />
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>

            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? t('auth.loggingIn') : t('auth.loginButton')}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Demo: nurse1 / password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
