import DashboardSetup from '@/components/dashboard-setup/dashboard-setup';
import db from '@/lib/superbase/db';
import { getUserSubscriptionStatus } from '@/lib/superbase/queries';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

const Dashboard = async () => {
  const superbase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await superbase.auth.getUser();

  if (!user) return;

  const workspace = await db.query.workspaces.findFirst({
    where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id),
  });

  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);
  if (subscriptionError) return;

  if (!workspace)
    return (
      <div
        className='bg-background
  h-screen
  w-screen
  flex
  justify-center
  items-center
  '
      >
        <DashboardSetup
          user={user}
          subscription={subscription}
        ></DashboardSetup>
      </div>
    );

  redirect(`/dashboard/${workspace.id}`);
};

export default Dashboard;
