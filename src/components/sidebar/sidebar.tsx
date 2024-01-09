import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from '@/lib/superbase/queries';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import WorkspaceDropdown from './workspaceDropdown';

interface SidebarProps {
  params: { workspaceId: string };
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = async ({ params, className }) => {
  const superbase = createServerComponentClient({
    cookies,
  });

  //user
  const {
    data: { user },
  } = await superbase.auth.getUser();
  if (!user) return;

  //subscription
  const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  //folders
  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    params.workspaceId
  );

  //error
  if (subscriptionError || foldersError) redirect('/dashboard');

  const [privateWorkspaces, collaboratedWorkspcaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ]);

  //get all the different sidebars

  return (
    <aside
      className={twMerge(
        'hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4',
        className
      )}
    >
      <WorkspaceDropdown
        privateWorkspaces={privateWorkspaces}
        sharedWorkspaces={sharedWorkspaces}
        collaboratingWorkspaces={collaboratedWorkspcaces}
        defaultValue={[
          ...privateWorkspaces,
          ...sharedWorkspaces,
          ...collaboratedWorkspcaces,
        ].find((workspace) => workspace.id === params.workspaceId)}
      ></WorkspaceDropdown>
    </aside>
  );
};

export default Sidebar;
