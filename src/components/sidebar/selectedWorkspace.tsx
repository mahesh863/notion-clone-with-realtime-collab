'use client';
import { workspace } from '@/lib/superbase/superbase.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface SelectedWorkspaceProps {
  workspace: workspace;
  onClick?: (workspace: workspace) => void;
}

const SelectedWorkspace: React.FC<SelectedWorkspaceProps> = ({
  workspace,
  onClick,
}) => {
  const superbase = createClientComponentClient();
  const [workspaceLogo, setWorkspaceLogo] = useState('/cypresslogo.svg');

  useEffect(() => {
    if (workspace.logo) {
      const path = superbase.storage
        .from('workspace-logos')
        .getPublicUrl(workspace.logo)?.data.publicUrl;

      setWorkspaceLogo(path);
    }
  }, [workspace]);

  return (
    <Link
      href={`/dashboard/${workspace.id}`}
      onClick={() => {
        if (onClick) onClick(workspace);
      }}
      className='flex rounded-md hover:bg-muted transition-all flex-row p-2 gap-4 justify-center
  items-center cursor-pointer my-2'
    >
      <Image
        src={workspaceLogo}
        alt='workspace logo'
        width={26}
        height={26}
        objectFit='cover'
      />
      <p
        className='
      text-lg
      w-[170px]
      overflow-hidden
      overflow-ellipsis
      whitespace-nowrap
      '
      >
        {workspace.title}
      </p>
    </Link>
  );
};

export default SelectedWorkspace;
