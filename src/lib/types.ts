import { z } from 'zod';

export const FormSchema = z.object({
  email: z.string().describe('Email').email({
    message: 'Invalid email',
  }),

  password: z
    .string()
    .describe('Password')
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

export const CreateWorkspaceFormSchema = z.object({
  workspaceName: z
    .string()
    .describe('Workspace name')
    .min(1, { message: 'Workspace name must be at least 1 characters long' }),
  logo: z.any(),
});
