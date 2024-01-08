'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../../../public/cypresslogo.svg';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/laoder';
import {
  actionLoginUser,
  actionSignupUser,
} from '@/lib/server-actions/auth-actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MailCheck } from 'lucide-react';

const SignUpFormSchema = z
  .object({
    email: z.string().describe('Email').email({ message: 'Invalid email' }),
    password: z
      .string()
      .describe('Password')
      .min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z
      .string()
      .describe('Confirm Password')
      .min(6, { message: 'Password must be at least 6 characters long' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
const Signup = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState('');
  const [confirmation, setConfirmation] = useState(false);

  const codeExchangeError = useMemo(() => {
    if (!searchParams) return '';
    return searchParams.get('error_description');
  }, [searchParams]);

  const confirmationAndErrorStyles = useMemo(
    () =>
      clsx('bg-primary', {
        'bg-red-500/10': codeExchangeError,
        'border-red-500/50': codeExchangeError,
        'text-red-700': codeExchangeError,
      }),
    []
  );

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const isLoading = form.formState.isLoading;
  const onSubmit = async ({
    email,
    password,
  }: z.infer<typeof SignUpFormSchema>) => {
    const { error } = await actionSignupUser({ email, password });

    if (error) {
      setSubmitError(error.message);
      form.reset();
      return;
    }
    setConfirmation(true);
  };

  return (
    <Form {...form}>
      <form
        onChange={() => {
          if (submitError) setSubmitError('');
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full sm:justify-center sm:w-[400px]
        space-y-6 flex  flex-col
        '
      >
        <Link
          href='/'
          className='
            w-full
            flex
            justify-left
            items-center
            
            '
        >
          <Image src={Logo} alt='logo' width={50} height={50} />
          <span className='font-semibold dark:text-white text-4xl first-letter:ml-2'>
            cypress.
          </span>
        </Link>
        <FormDescription
          className='
        text-foreground/60'
        >
          An all-In-One Collaboration and Productivity Platform
        </FormDescription>

        {!confirmation && !codeExchangeError && (
          <>
            <FormField
              disabled={isLoading}
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type='email' placeholder='Email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type='password' placeholder='Password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Confirm Password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {submitError && <FormMessage>{submitError}</FormMessage>}

            <Button type='submit' className='w-full p-6' disabled={isLoading}>
              {!isLoading ? 'Create Account' : <Loader />}
            </Button>
          </>
        )}
        <span className='self-center'>
          Already have an account ?{' '}
          <Link href={'/login'} className='text-primary'>
            Login
          </Link>
        </span>
        {confirmation && codeExchangeError && (
          <>
            <Alert className={confirmationAndErrorStyles}>
              {!codeExchangeError && <MailCheck className='h-4 w-4' />}
              <AlertTitle>
                {codeExchangeError ? 'Invalid link' : 'Check your email'}
              </AlertTitle>
              <AlertDescription>
                {codeExchangeError || 'An Email confirmation has been sent'}
              </AlertDescription>
            </Alert>
          </>
        )}
      </form>
    </Form>
  );
};

export default Signup;
