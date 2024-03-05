'use client';

import { useState } from 'react';
import { login, registerUser } from '@/actions';
import clsx from 'clsx';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { name, email, password } = data;

    // Server action
    const response = await registerUser(name, email, password);

    if (!response.ok) {
      setErrorMessage(response.message);
      return;
    }

    await login(email.toLowerCase(), password);
    window.location.replace('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <label htmlFor="name">Nombre completo</label>
      <input
        className={clsx('register-field', {
          'border-red-500': errors.name,
        })}
        type="name"
        autoFocus
        {...register('name', { required: true })}
      />

      <label htmlFor="email">Email</label>
      <input
        className={clsx('register-field', {
          'border-red-500': errors.email,
        })}
        type="email"
        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
      />

      <label htmlFor="password">Contraseña</label>
      <input
        className={clsx('register-field', {
          'border-red-500': errors.password,
        })}
        type="password"
        {...register('password', { required: true, minLength: 6 })}
      />

      {errorMessage && (
        <span className="my-2 text-red-500">{errorMessage}</span>
      )}

      <button className="btn-primary">Crear cuenta</button>

      {/* divisor line */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Ingresar
      </Link>
    </form>
  );
};
